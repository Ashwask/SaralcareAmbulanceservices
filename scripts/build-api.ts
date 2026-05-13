#!/usr/bin/env tsx
/**
 * Generate api/v1/*.json artifacts from data/*.yaml.
 *
 * Output layout:
 *   api/v1/providers.json            — full list, slim records
 *   api/v1/providers/{id}.json       — full record per provider
 *   api/v1/hospitals.json            — full list, slim records
 *   api/v1/hospitals/{id}.json       — full record per hospital
 *   api/v1/by-pincode/{pin}.json     — providers serving each pincode
 *   api/v1/changelog.json            — most recent N changes from git log
 *   api/v1/freshness.json            — written by freshness-report.ts
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA = join(ROOT, "data");
const OUT = join(ROOT, "api", "v1");

type AnyRec = Record<string, any>;

function badge(r: AnyRec): "verified" | "stale" | "source-published" | "dead" | "unverified" | "disputed" {
  if (r.status === "disputed") return "disputed";
  if (r.status === "dead") return "dead";
  // Phone-verified by maintainer
  if (r.last_verified_at) {
    const age = Math.floor((Date.now() - new Date(r.last_verified_at).getTime()) / (1000 * 60 * 60 * 24));
    if (age > 60) return "dead";
    if (age > 30) return "stale";
    return "verified";
  }
  // No phone verification yet — distinguish source-published from third-party-only
  if (r.status === "source-published") return "source-published";
  return "unverified";
}

function loadYamls(dir: string): AnyRec[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => yaml.load(readFileSync(join(dir, f), "utf8"), { schema: yaml.JSON_SCHEMA }) as AnyRec);
}

// Reset output
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });
mkdirSync(join(OUT, "providers"), { recursive: true });
mkdirSync(join(OUT, "hospitals"), { recursive: true });
mkdirSync(join(OUT, "by-pincode"), { recursive: true });

const providers = loadYamls(join(DATA, "providers"));
const hospitals = loadYamls(join(DATA, "hospitals"));
const reports = loadYamls(join(DATA, "reports")).filter(
  (r) => r.moderator_status === "published"
);

console.log(`Building API for ${providers.length} providers, ${hospitals.length} hospitals, ${reports.length} published reports.`);

// ----- aggregate reports per provider -----
function aggregateReports(providerId: string) {
  const own = reports.filter((r) => r.provider_id === providerId && !r.disputed);
  if (own.length === 0) {
    return { count: 0, count_30d: 0, count_90d: 0 };
  }
  const now = Date.now();
  const dayMs = 86400000;
  const within = (days: number) =>
    own.filter((r) => now - new Date(r.date_of_call).getTime() <= days * dayMs);
  const all = own;
  const last90 = within(90);
  const answered = all.filter((r) =>
    ["answered-dispatched", "answered-unavailable"].includes(r.outcome)
  );
  const dispatched = all.filter((r) => r.outcome === "answered-dispatched");
  const responseTimes = dispatched
    .map((r) => r.response_minutes)
    .filter((n: any) => typeof n === "number") as number[];
  responseTimes.sort((a, b) => a - b);
  const median =
    responseTimes.length > 0
      ? responseTimes[Math.floor(responseTimes.length / 2)]
      : null;
  const fares = all
    .map((r) => r.fare_paid)
    .filter((n: any) => typeof n === "number") as number[];
  fares.sort((a, b) => a - b);
  return {
    count: all.length,
    count_30d: within(30).length,
    count_90d: last90.length,
    answer_rate: all.length ? answered.length / all.length : null,
    dispatch_rate: all.length ? dispatched.length / all.length : null,
    median_response_minutes: median,
    fare_min: fares[0] ?? null,
    fare_median: fares[Math.floor(fares.length / 2)] ?? null,
    fare_max: fares[fares.length - 1] ?? null,
    last_report_at: all
      .map((r) => r.date_of_call)
      .sort()
      .at(-1) ?? null,
  };
}

// ----- filter: only records with a real, callable phone surface publicly -----
const PLACEHOLDER_PHONE = "+91 00000 00000";
function hasRealPhone(r: AnyRec): boolean {
  const phone = r.contact?.phone_24h ?? r.er_phone;
  return !!phone && phone !== PLACEHOLDER_PHONE && phone.trim().length > 2;
}

// ----- slim shape used in list endpoints -----
function slimProvider(r: AnyRec) {
  return {
    id: r.id,
    brand_name: r.brand_name,
    legal_name: r.legal_name,
    type: r.type,
    phone_24h: r.contact?.phone_24h,
    website: r.contact?.website ?? null,
    hq_lat_lng: r.hq_lat_lng,
    service_areas: r.service_areas,
    fleet_count_claimed: r.fleet_count_claimed ?? null,
    fares: r.fares ?? null,
    affiliations_count: (r.hospital_affiliations ?? []).length,
    status: r.status,
    badge: badge(r),
    last_verified_at: r.last_verified_at ?? null,
    reports: aggregateReports(r.id),
  };
}

function slimHospital(h: AnyRec) {
  return {
    id: h.id,
    name: h.name,
    brand: h.brand ?? null,
    type: h.type ?? null,
    address: h.address,
    pincode: h.pincode ?? null,
    lat_lng: h.lat_lng,
    er_phone: h.er_phone,
    owns_fleet: h.owns_fleet ?? false,
    fleet_provider_id: h.fleet_provider_id ?? null,
    dispatched_providers_count: (h.dispatched_providers ?? []).length,
    status: h.status,
    badge: badge(h),
  };
}

// Top-level providers list (alphabetical, with badge)
writeFileSync(
  join(OUT, "providers.json"),
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      license: "CC-BY-NC-SA-4.0",
      attribution: "Saralcare ambulance directory project (https://ambulance.saralcare.com)",
      count: providers.filter(hasRealPhone).length,
      total_in_dataset: providers.length,
      hidden_no_phone: providers.length - providers.filter(hasRealPhone).length,
      providers: providers
        .filter(hasRealPhone)
        .map(slimProvider)
        .sort((a, b) => (a.brand_name ?? "").localeCompare(b.brand_name ?? "")),
    },
    null,
    2
  )
);

// Per-provider full record + per-provider reports endpoint
mkdirSync(join(OUT, "reports"), { recursive: true });
for (const p of providers) {
  const own = reports
    .filter((r) => r.provider_id === p.id)
    .sort((a, b) => (b.date_of_call ?? "").localeCompare(a.date_of_call ?? ""));
  const enriched = { ...p, reports_summary: aggregateReports(p.id), recent_reports: own.slice(0, 10) };
  writeFileSync(join(OUT, "providers", `${p.id}.json`), JSON.stringify(enriched, null, 2));
  writeFileSync(
    join(OUT, "reports", `${p.id}.json`),
    JSON.stringify({ provider_id: p.id, summary: aggregateReports(p.id), reports: own }, null, 2)
  );
}

// Top-level hospitals list
writeFileSync(
  join(OUT, "hospitals.json"),
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      license: "CC-BY-NC-SA-4.0",
      attribution: "Saralcare ambulance directory project (https://ambulance.saralcare.com)",
      count: hospitals.length,
      hospitals: hospitals.map(slimHospital).sort((a, b) => a.name.localeCompare(b.name)),
    },
    null,
    2
  )
);

// Per-hospital full record
for (const h of hospitals) {
  writeFileSync(join(OUT, "hospitals", `${h.id}.json`), JSON.stringify(h, null, 2));
}

// by-pincode index — pincode → providers whose service_areas include it (or whose radius covers).
const byPincode = new Map<string, AnyRec[]>();
for (const p of providers) {
  const sa = p.service_areas;
  if (!sa) continue;
  if (!hasRealPhone(p)) continue; // never surface no-phone records in by-pincode (user would tap nothing)
  if (sa.type === "pincode-list") {
    for (const pin of sa.pincodes ?? []) {
      if (!byPincode.has(pin)) byPincode.set(pin, []);
      byPincode.get(pin)!.push(slimProvider(p));
    }
  }
  // radius / polygon are handled client-side in v1 by Turf.js because pincode→lat/lng requires a separate dataset.
}
for (const [pin, list] of byPincode) {
  writeFileSync(
    join(OUT, "by-pincode", `${pin}.json`),
    JSON.stringify(
      {
        pincode: pin,
        generated_at: new Date().toISOString(),
        count: list.length,
        providers: list,
      },
      null,
      2
    )
  );
}

// changelog — last 20 commits from git
let changelog: any[] = [];
try {
  const log = execSync(
    `git log --pretty=format:'%H%x09%an%x09%aI%x09%s' -n 20 -- data schema`,
    { cwd: ROOT, encoding: "utf8" }
  );
  changelog = log
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, author, date, subject] = line.split("\t");
      return { hash, author, date, subject };
    });
} catch (e) {
  // git history may not be available in some sandboxes — emit empty.
  changelog = [];
}
writeFileSync(
  join(OUT, "changelog.json"),
  JSON.stringify({ generated_at: new Date().toISOString(), entries: changelog }, null, 2)
);

// Copy the federation manifest into the API output for public consumption
const mirrorsSrc = join(ROOT, "data", "mirrors.json");
if (existsSync(mirrorsSrc)) {
  writeFileSync(join(OUT, "mirrors.json"), readFileSync(mirrorsSrc, "utf8"));
}

console.log(`✓ Wrote api/v1/providers.json (${providers.length})`);
console.log(`✓ Wrote api/v1/providers/{id}.json (${providers.length})`);
console.log(`✓ Wrote api/v1/hospitals.json (${hospitals.length})`);
console.log(`✓ Wrote api/v1/hospitals/{id}.json (${hospitals.length})`);
console.log(`✓ Wrote api/v1/by-pincode/{pin}.json (${byPincode.size})`);
console.log(`✓ Wrote api/v1/changelog.json (${changelog.length} entries)`);
