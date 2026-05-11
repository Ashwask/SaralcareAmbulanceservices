#!/usr/bin/env tsx
/**
 * Emit a Markdown list of providers due for re-verification.
 * Sorted by most overdue first. Used by the weekly reverify-queue workflow
 * to update a tracking GitHub issue.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROVIDERS = join(ROOT, "data", "providers");

type AnyRec = Record<string, any>;

const records: AnyRec[] = existsSync(PROVIDERS)
  ? readdirSync(PROVIDERS)
      .filter((f) => f.endsWith(".yaml"))
      .map((f) => yaml.load(readFileSync(join(PROVIDERS, f), "utf8"), { schema: yaml.JSON_SCHEMA }) as AnyRec)
  : [];

function ageDays(d: string | null | undefined): number | null {
  if (!d) return null;
  return Math.floor((Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24));
}

const overdue = records
  .map((r) => ({
    id: r.id,
    name: r.brand_name ?? r.legal_name,
    phone: r.contact?.phone_24h ?? "—",
    status: r.status,
    age: ageDays(r.last_verified_at),
  }))
  .filter((r) => r.status !== "dead" && (r.age === null || r.age >= 25))
  .sort((a, b) => (b.age ?? 999) - (a.age ?? 999));

console.log("# Weekly reverify queue\n");
console.log(`Generated ${new Date().toISOString().slice(0, 10)}.\n`);
console.log(`**${overdue.length} records** need a verification call this week.\n`);

if (overdue.length === 0) {
  console.log("All verified records are within the 30-day freshness window. Good week.\n");
  process.exit(0);
}

console.log("| Provider | Phone | Status | Days since verified |");
console.log("|---|---|---|---|");
for (const r of overdue) {
  const age = r.age === null ? "_never_" : `${r.age}d`;
  console.log(`| [${r.name}](data/providers/${r.id}.yaml) | \`${r.phone}\` | ${r.status} | ${age} |`);
}
console.log("\n_Use the verification script in `CONTRIBUTING.md`. Open a PR titled `[VERIFY] <provider-name>` when done._\n");
