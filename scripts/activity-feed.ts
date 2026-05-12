#!/usr/bin/env tsx
/**
 * Generate api/v1/activity.json from git log.
 *
 * Categorises commits into: verify, claim, correct, report, new, dispute,
 * takedown, schema, code, doc. Each entry has commit hash, ISO date,
 * author, subject, category, and (if recognisable) the affected record id.
 *
 * Surfaced on /, /providers/[id], /hospitals/[id], /changes to give the
 * site a "live-feel" without going dynamic.
 */

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "api", "v1");

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const CATEGORIES = [
  { pattern: /\[VERIFY\]|verify\b|verified by phone/i, cat: "verify" },
  { pattern: /\[CLAIM\]|claim(ed)?/i, cat: "claim" },
  { pattern: /\[FIX\]|\[CORRECTION\]|correct|fix/i, cat: "correct" },
  { pattern: /\[REPORT\]|report a call/i, cat: "report" },
  { pattern: /\[NEW\]|add(ed)? provider|add(ed)? hospital/i, cat: "new" },
  { pattern: /\[DISPUTE\]|dispute/i, cat: "dispute" },
  { pattern: /\[TAKEDOWN\]|takedown|archive|delist/i, cat: "takedown" },
  { pattern: /\[DEAD\b|dead number/i, cat: "dead-number" },
  { pattern: /schema/i, cat: "schema" },
  { pattern: /\[DOC\]|^docs?:|documentation/i, cat: "doc" },
];

function categorise(subject: string): string {
  for (const c of CATEGORIES) {
    if (c.pattern.test(subject)) return c.cat;
  }
  return "code";
}

// Extract record id if the subject mentions one: heuristic — look for slug-like
// tokens matching provider/hospital id patterns. Not perfect; good enough for
// surfacing.
function extractRecordId(subject: string, files: string[]): { type: "provider" | "hospital" | null; id: string | null } {
  for (const f of files) {
    const m = f.match(/^data\/(providers|hospitals)\/([a-z0-9][a-z0-9-]*)\.yaml$/);
    if (m) return { type: m[1].replace(/s$/, "") as any, id: m[2] };
  }
  return { type: null, id: null };
}

let entries: any[] = [];
try {
  // Get last 100 commits with hash, ISO date, author, subject — separated by NUL
  const log = execSync(
    `git log --pretty=format:'%H%x09%aI%x09%an%x09%s' --name-only -n 100`,
    { cwd: ROOT, encoding: "utf8" }
  );
  // Parse the log: commits are separated by a blank line; first line is
  // metadata, subsequent lines (until blank) are filenames.
  const blocks = log.split(/\n\n+/).filter(Boolean);
  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);
    if (lines.length === 0) continue;
    const [hash, date, author, subject] = lines[0].split("\t");
    const files = lines.slice(1);
    const record = extractRecordId(subject, files);
    entries.push({
      hash: hash.slice(0, 7),
      date,
      author,
      subject,
      category: categorise(subject),
      record_type: record.type,
      record_id: record.id,
      files_changed: files.length,
    });
  }
} catch (e) {
  console.warn("git log unavailable; activity.json will be empty");
  entries = [];
}

writeFileSync(
  join(OUT, "activity.json"),
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      count: entries.length,
      entries,
    },
    null,
    2
  )
);

console.log(`✓ Wrote api/v1/activity.json (${entries.length} entries)`);
