#!/usr/bin/env tsx
/**
 * Compute trend metrics from data + git history. Emit api/v1/trends.json.
 *
 * Most metrics start sparse and fill in as the dataset grows. Each metric
 * has a clear definition the trends page can quote.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA = join(ROOT, "data");
const OUT = join(ROOT, "api", "v1");

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

type AnyRec = Record<string, any>;

function loadYamls(dir: string): AnyRec[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => yaml.load(readFileSync(join(dir, f), "utf8"), { schema: yaml.JSON_SCHEMA }) as AnyRec);
}

const providers = loadYamls(join(DATA, "providers"));
const hospitals = loadYamls(join(DATA, "hospitals"));
const reports = loadYamls(join(DATA, "reports")).filter((r) => r.moderator_status === "published");

const now = Date.now();
const dayMs = 86400000;

function ageDays(d: string | null | undefined): number | null {
  if (!d) return null;
  return Math.floor((now - new Date(d).getTime()) / dayMs);
}

function badge(r: AnyRec): "verified" | "stale" | "dead" | "unverified" | "disputed" {
  if (r.status === "disputed") return "disputed";
  if (r.status === "dead") return "dead";
  if (!r.last_verified_at) return "unverified";
  const age = ageDays(r.last_verified_at)!;
  if (age > 60) return "dead";
  if (age > 30) return "stale";
  return "verified";
}

// ----- 1. Freshness distribution -----
const freshness = providers.reduce(
  (acc: Record<string, number>, p) => {
    acc[badge(p)] = (acc[badge(p)] ?? 0) + 1;
    return acc;
  },
  { verified: 0, stale: 0, dead: 0, unverified: 0, disputed: 0 }
);

// ----- 2. By provider type -----
const byType = providers.reduce((acc: Record<string, number>, p) => {
  acc[p.type] = (acc[p.type] ?? 0) + 1;
  return acc;
}, {});

// ----- 3. Geographic distribution (by pincode prefix → city) -----
const PIN_PREFIX_CITY: Record<string, string> = {
  "560": "Bengaluru", "561": "Bengaluru", "562": "Bengaluru",
  "400": "Mumbai", "401": "Mumbai", "402": "Mumbai",
  "411": "Pune", "412": "Pune", "413": "Pune",
  "110": "Delhi NCR", "121": "Delhi NCR", "122": "Delhi NCR", "201": "Delhi NCR",
  "600": "Chennai", "601": "Chennai", "602": "Chennai", "603": "Chennai",
  "500": "Hyderabad", "501": "Hyderabad", "502": "Hyderabad",
  "700": "Kolkata", "711": "Kolkata", "712": "Kolkata",
};

const byCity: Record<string, number> = {};
for (const p of providers) {
  const pins = p.service_areas?.type === "pincode-list" ? (p.service_areas.pincodes ?? []) : [];
  const cities = new Set<string>();
  for (const pin of pins) {
    const c = PIN_PREFIX_CITY[String(pin).slice(0, 3)];
    if (c) cities.add(c);
  }
  for (const c of cities) byCity[c] = (byCity[c] ?? 0) + 1;
}

// ----- 4. Fare dispersion (provider-claimed) -----
const farePoints = providers
  .map((p) => p.fares?.base)
  .filter((n: any) => typeof n === "number" && n > 0) as number[];
farePoints.sort((a, b) => a - b);
const fareStats = farePoints.length === 0
  ? null
  : {
      count: farePoints.length,
      min: farePoints[0],
      p25: farePoints[Math.floor(farePoints.length * 0.25)],
      median: farePoints[Math.floor(farePoints.length / 2)],
      p75: farePoints[Math.floor(farePoints.length * 0.75)],
      max: farePoints[farePoints.length - 1],
    };

// ----- 5. Report-based response time (from user reports) -----
const dispatchedReports = reports.filter(
  (r) => r.outcome === "answered-dispatched" && typeof r.response_minutes === "number"
);
const responseTimes = dispatchedReports.map((r) => r.response_minutes!).sort((a, b) => a - b);
const responseStats = responseTimes.length === 0
  ? null
  : {
      count: responseTimes.length,
      min: responseTimes[0],
      median: responseTimes[Math.floor(responseTimes.length / 2)],
      max: responseTimes[responseTimes.length - 1],
    };

// ----- 6. Activity over time (from git log) -----
type CategoryCount = Record<string, number>;
const activityByWeek: Record<string, CategoryCount> = {};

function categorise(subject: string): string {
  const s = subject.toLowerCase();
  if (s.includes("[verify]") || s.includes("verify ")) return "verify";
  if (s.includes("[claim]")) return "claim";
  if (s.includes("[fix]") || s.includes("[correction]") || s.startsWith("fix")) return "correct";
  if (s.includes("[report]")) return "report";
  if (s.includes("[new]") || s.includes("add provider") || s.includes("add hospital")) return "new";
  if (s.includes("[dispute]")) return "dispute";
  if (s.includes("[takedown]") || s.includes("delist")) return "takedown";
  if (s.includes("[dead")) return "dead-number";
  return "other";
}

function isoWeek(d: Date): string {
  // ISO week: yyyy-Www format
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((date.getTime() - week1.getTime()) / dayMs - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${date.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

try {
  const log = execSync(
    `git log --pretty=format:'%aI%x09%s' -n 500`,
    { cwd: ROOT, encoding: "utf8" }
  );
  for (const line of log.split("\n").filter(Boolean)) {
    const [date, subject] = line.split("\t");
    const week = isoWeek(new Date(date));
    if (!activityByWeek[week]) activityByWeek[week] = { verify: 0, claim: 0, correct: 0, report: 0, new: 0, dispute: 0, takedown: 0, "dead-number": 0, other: 0 };
    const cat = categorise(subject);
    activityByWeek[week][cat] = (activityByWeek[week][cat] ?? 0) + 1;
  }
} catch {
  // git unavailable
}

const weekKeys = Object.keys(activityByWeek).sort();
const last12Weeks = weekKeys.slice(-12);

// ----- 7. Records added over time -----
let recordsByMonth: Record<string, number> = {};
try {
  const adds = execSync(
    `git log --diff-filter=A --name-only --pretty=format:'%aI' -- data/providers/ data/hospitals/`,
    { cwd: ROOT, encoding: "utf8" }
  );
  let currentDate = "";
  for (const line of adds.split("\n")) {
    if (line.match(/^\d{4}-\d{2}-\d{2}T/)) {
      currentDate = line.slice(0, 7); // yyyy-mm
    } else if (line.match(/^data\/(providers|hospitals)\//) && currentDate) {
      recordsByMonth[currentDate] = (recordsByMonth[currentDate] ?? 0) + 1;
    }
  }
} catch {
  // git unavailable
}

// ----- 8. Contributor count over time -----
let contributors = new Set<string>();
try {
  const authors = execSync(
    `git log --pretty=format:'%ae' -- data/`,
    { cwd: ROOT, encoding: "utf8" }
  );
  for (const a of authors.split("\n").filter(Boolean)) contributors.add(a);
} catch {}
const contributorCount = contributors.size;

// ----- output -----
const out = {
  generated_at: new Date().toISOString(),
  totals: {
    providers: providers.length,
    hospitals: hospitals.length,
    published_reports: reports.length,
    contributors: contributorCount,
  },
  freshness,
  by_type: byType,
  by_city: byCity,
  fare_dispersion_inr: fareStats,
  response_time_minutes: responseStats,
  activity_last_12_weeks: last12Weeks.map((w) => ({ week: w, ...activityByWeek[w] })),
  records_added_by_month: recordsByMonth,
};

writeFileSync(join(OUT, "trends.json"), JSON.stringify(out, null, 2));
console.log(`✓ Wrote api/v1/trends.json`);
console.log(`  ${providers.length} providers, ${hospitals.length} hospitals, ${reports.length} reports, ${contributorCount} contributors`);
