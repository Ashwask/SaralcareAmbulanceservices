#!/usr/bin/env tsx
/**
 * Emit freshness stats for the dataset, both as console output and as
 * api/v1/freshness.json (consumed by the site's /freshness page).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROVIDERS = join(ROOT, "data", "providers");
const OUT = join(ROOT, "api", "v1");

type AnyRec = Record<string, any>;

const records: AnyRec[] = existsSync(PROVIDERS)
  ? readdirSync(PROVIDERS)
      .filter((f) => f.endsWith(".yaml"))
      .map((f) => yaml.load(readFileSync(join(PROVIDERS, f), "utf8"), { schema: yaml.JSON_SCHEMA }) as AnyRec)
  : [];

function badge(r: AnyRec): "verified" | "stale" | "dead" | "unverified" | "disputed" {
  if (r.status === "disputed") return "disputed";
  if (r.status === "dead") return "dead";
  if (!r.last_verified_at) return "unverified";
  const age = Math.floor((Date.now() - new Date(r.last_verified_at).getTime()) / (1000 * 60 * 60 * 24));
  if (age > 60) return "dead";
  if (age > 30) return "stale";
  return "verified";
}

const counts = { verified: 0, stale: 0, dead: 0, unverified: 0, disputed: 0 };
for (const r of records) counts[badge(r)]++;

const report = {
  generated_at: new Date().toISOString(),
  total_records: records.length,
  counts,
  by_type: records.reduce((acc: Record<string, number>, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {}),
  oldest_verified: records
    .filter((r) => r.last_verified_at && badge(r) === "verified")
    .map((r) => ({ id: r.id, last_verified_at: r.last_verified_at }))
    .sort((a, b) => new Date(a.last_verified_at).getTime() - new Date(b.last_verified_at).getTime())
    .slice(0, 5),
};

console.log("Freshness report:");
console.log(`  total: ${report.total_records}`);
console.log(`  verified: ${counts.verified}`);
console.log(`  stale:    ${counts.stale}`);
console.log(`  dead:     ${counts.dead}`);
console.log(`  unverified: ${counts.unverified}`);
console.log(`  disputed: ${counts.disputed}`);

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "freshness.json"), JSON.stringify(report, null, 2));
console.log(`\nWrote ${join("api", "v1", "freshness.json")}.`);
