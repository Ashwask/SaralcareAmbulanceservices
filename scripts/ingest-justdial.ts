#!/usr/bin/env tsx
/**
 * Ingest ambulance services from JustDial-style listings.
 *
 * JustDial does not offer an official API. This script reads a CSV file
 * curated by hand (sources/scrapes/justdial-bangalore.csv) and emits
 * stub YAML records. The CSV is produced by:
 *   - manually searching JustDial / Sulekha / IndiaMART for "ambulance bangalore"
 *   - copy-pasting the listings into the CSV
 *
 * CSV format (header row required):
 *   name,phone,address,website,pincode,notes
 *
 * Run: pnpm ingest:justdial
 *
 * Why a CSV intermediate? It makes the human-curated step auditable,
 * keeps scrape provenance out of the public repo, and respects JustDial's TOS.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROVIDERS_DIR = join(ROOT, "data", "providers");
const CSV_PATH = join(ROOT, "sources", "scrapes", "justdial-bangalore.csv");

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function parseCsv(s: string): Record<string, string>[] {
  const lines = s.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    // simple CSV parse — does not handle escaped commas. Edit your CSV to avoid commas in fields.
    const cells = line.split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

function existingRecords(): Set<string> {
  if (!existsSync(PROVIDERS_DIR)) return new Set();
  return new Set(
    readdirSync(PROVIDERS_DIR)
      .filter((f) => f.endsWith(".yaml"))
      .map((f) => {
        const d = yaml.load(readFileSync(join(PROVIDERS_DIR, f), "utf8"), { schema: yaml.JSON_SCHEMA }) as any;
        return (d.brand_name ?? "").toLowerCase().trim();
      })
  );
}

if (!existsSync(CSV_PATH)) {
  console.error(`Expected CSV at: ${CSV_PATH}`);
  console.error("Format: name,phone,address,website,pincode,notes (one row per provider).");
  process.exit(1);
}

const rows = parseCsv(readFileSync(CSV_PATH, "utf8"));
console.log(`Loaded ${rows.length} rows from ${CSV_PATH}`);

const seen = existingRecords();
let added = 0;
let skipped = 0;

for (const row of rows) {
  if (!row.name) continue;
  if (seen.has(row.name.toLowerCase().trim())) {
    skipped++;
    continue;
  }
  const slug = slugify(`${row.name}-bangalore`);
  const phone = row.phone?.startsWith("+91") ? row.phone : `+91 ${row.phone?.replace(/\D/g, "")}`;

  const record = {
    id: slug,
    legal_name: row.name,
    brand_name: row.name,
    type: "private-standalone",
    hq_address: row.address || "Bengaluru",
    hq_lat_lng: [12.9716, 77.5946], // placeholder — geocode separately
    contact: {
      phone_24h: phone && phone.length > 7 ? phone : "+91 00000 00000",
      alt_phone: null,
      whatsapp: null,
      email: null,
      website: row.website || null,
    },
    service_areas: { type: "pincode-list", pincodes: row.pincode ? [row.pincode] : [] },
    hospital_affiliations: [],
    fleet_count_claimed: null,
    fleet_count_verified: null,
    fares: null,
    certifications: [],
    sources: [
      {
        type: "justdial",
        url: null,
        accessed: new Date().toISOString().slice(0, 10),
        notes: row.notes || "Hand-curated from JustDial-style listing.",
      },
    ],
    call_logs: [],
    status: "unverified",
    last_verified_at: null,
    verified_by: null,
    license_tag: "CC-BY-NC-SA-4.0",
    notes: "Ingested from CSV intermediate. Geocoding + verification call required before reliance.",
  };

  writeFileSync(join(PROVIDERS_DIR, `${slug}.yaml`), yaml.dump(record, { lineWidth: 100 }));
  added++;
  seen.add(row.name.toLowerCase().trim());
}

console.log(`✓ Added ${added}, skipped ${skipped} (duplicates).`);
