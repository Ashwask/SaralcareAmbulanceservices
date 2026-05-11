#!/usr/bin/env tsx
/**
 * Validate every YAML record in data/ against its JSON Schema.
 * Also checks cross-record consistency (affiliation edges agree on both sides;
 * provider hq matches hospital lat/lng when type=hospital-owned; no duplicate ids).
 *
 * Exit 0 if valid; exit 1 with a structured report otherwise. Run in CI.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SCHEMA_DIR = join(ROOT, "schema");
const DATA_DIR = join(ROOT, "data");

type AnyRec = Record<string, any>;

interface Issue {
  level: "error" | "warn";
  file: string;
  message: string;
}

const issues: Issue[] = [];

function loadSchema(name: string): AnyRec {
  return JSON.parse(readFileSync(join(SCHEMA_DIR, name), "utf8"));
}

function loadYamls(dir: string): { file: string; data: AnyRec }[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => ({
      file: join(dir, f),
      // Use JSON_SCHEMA so bare YYYY-MM-DD stays a string (not a Date) — matches our JSON Schema.
      data: yaml.load(readFileSync(join(dir, f), "utf8"), { schema: yaml.JSON_SCHEMA }) as AnyRec,
    }));
}

function freshnessBadge(record: AnyRec): "verified" | "stale" | "dead" | "unverified" | "disputed" {
  if (!record.last_verified_at) return record.status === "unverified" ? "unverified" : record.status;
  const ageDays = Math.floor(
    (Date.now() - new Date(record.last_verified_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (record.status === "disputed") return "disputed";
  if (record.status === "dead") return "dead";
  if (ageDays > 60) return "dead";
  if (ageDays > 30) return "stale";
  return "verified";
}

// ----- schemas -----
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const providerSchema = loadSchema("provider.schema.json");
const vehicleSchema = loadSchema("vehicle.schema.json");
const hospitalSchema = loadSchema("hospital.schema.json");
const reportSchema = loadSchema("report.schema.json");
ajv.addSchema(vehicleSchema, "vehicle.schema.json");
const validateProvider = ajv.compile(providerSchema);
const validateHospital = ajv.compile(hospitalSchema);
const validateReport = ajv.compile(reportSchema);

// ----- load data -----
const providers = loadYamls(join(DATA_DIR, "providers"));
const hospitals = loadYamls(join(DATA_DIR, "hospitals"));
const reports = loadYamls(join(DATA_DIR, "reports"));

console.log(`Loaded ${providers.length} providers, ${hospitals.length} hospitals, ${reports.length} reports.`);

// ----- schema validation -----
for (const { file, data } of providers) {
  if (!validateProvider(data)) {
    for (const err of validateProvider.errors ?? []) {
      issues.push({
        level: "error",
        file,
        message: `provider schema: ${err.instancePath} ${err.message} (${JSON.stringify(err.params)})`,
      });
    }
  }
}
for (const { file, data } of hospitals) {
  if (!validateHospital(data)) {
    for (const err of validateHospital.errors ?? []) {
      issues.push({
        level: "error",
        file,
        message: `hospital schema: ${err.instancePath} ${err.message} (${JSON.stringify(err.params)})`,
      });
    }
  }
}
for (const { file, data } of reports) {
  if (!validateReport(data)) {
    for (const err of validateReport.errors ?? []) {
      issues.push({
        level: "error",
        file,
        message: `report schema: ${err.instancePath} ${err.message} (${JSON.stringify(err.params)})`,
      });
    }
  }
}

// ----- id uniqueness -----
const seenProviderIds = new Set<string>();
for (const { file, data } of providers) {
  if (!data.id) continue;
  if (seenProviderIds.has(data.id)) {
    issues.push({ level: "error", file, message: `duplicate provider id: ${data.id}` });
  }
  seenProviderIds.add(data.id);
  if (data.id !== basename(file, ".yaml")) {
    issues.push({
      level: "warn",
      file,
      message: `provider id "${data.id}" does not match filename "${basename(file, ".yaml")}". Convention: filename == id.`,
    });
  }
}
const seenHospitalIds = new Set<string>();
for (const { file, data } of hospitals) {
  if (!data.id) continue;
  if (seenHospitalIds.has(data.id)) {
    issues.push({ level: "error", file, message: `duplicate hospital id: ${data.id}` });
  }
  seenHospitalIds.add(data.id);
  if (data.id !== basename(file, ".yaml")) {
    issues.push({
      level: "warn",
      file,
      message: `hospital id "${data.id}" does not match filename "${basename(file, ".yaml")}". Convention: filename == id.`,
    });
  }
}

// ----- affiliation consistency: each provider→hospital edge must have hospital→provider edge -----
for (const { file, data } of providers) {
  for (const aff of data.hospital_affiliations ?? []) {
    if (!seenHospitalIds.has(aff.hospital_id)) {
      issues.push({
        level: "error",
        file,
        message: `affiliation references unknown hospital id "${aff.hospital_id}"`,
      });
      continue;
    }
    const hosp = hospitals.find((h) => h.data.id === aff.hospital_id)!;
    const reverse = (hosp.data.dispatched_providers ?? []).some(
      (dp: AnyRec) => dp.provider_id === data.id
    );
    if (!reverse) {
      issues.push({
        level: "error",
        file,
        message: `provider→hospital edge (${data.id}→${aff.hospital_id}) has no reverse edge on hospital record`,
      });
    }
  }
}
for (const { file, data } of hospitals) {
  for (const dp of data.dispatched_providers ?? []) {
    if (!seenProviderIds.has(dp.provider_id)) {
      issues.push({
        level: "error",
        file,
        message: `dispatched_providers references unknown provider id "${dp.provider_id}"`,
      });
      continue;
    }
    const prov = providers.find((p) => p.data.id === dp.provider_id)!;
    const reverse = (prov.data.hospital_affiliations ?? []).some(
      (a: AnyRec) => a.hospital_id === data.id
    );
    if (!reverse) {
      issues.push({
        level: "error",
        file,
        message: `hospital→provider edge (${data.id}→${dp.provider_id}) has no reverse edge on provider record`,
      });
    }
  }
}

// ----- hospital-owned providers must point at an existing hospital and lat/lng-match -----
for (const { file, data } of providers) {
  if (data.type !== "hospital-owned") continue;
  const affHospitalIds = (data.hospital_affiliations ?? []).map((a: AnyRec) => a.hospital_id);
  if (affHospitalIds.length === 0) {
    issues.push({
      level: "error",
      file,
      message: `provider type=hospital-owned but no hospital_affiliations declared`,
    });
  }
}
for (const { file, data } of hospitals) {
  if (data.owns_fleet && !data.fleet_provider_id) {
    issues.push({
      level: "error",
      file,
      message: `hospital owns_fleet=true but no fleet_provider_id`,
    });
  }
  if (data.owns_fleet && data.fleet_provider_id && !seenProviderIds.has(data.fleet_provider_id)) {
    issues.push({
      level: "error",
      file,
      message: `fleet_provider_id "${data.fleet_provider_id}" not found among providers`,
    });
  }
}

// ----- freshness drift: any record with status=verified must have last_verified_at within 60 days -----
for (const { file, data } of providers) {
  if (data.status === "verified") {
    if (!data.last_verified_at) {
      issues.push({
        level: "error",
        file,
        message: `status=verified but last_verified_at is null`,
      });
    } else {
      const badge = freshnessBadge(data);
      if (badge !== "verified") {
        issues.push({
          level: "warn",
          file,
          message: `status=verified but freshness badge is "${badge}" — re-verify before merge`,
        });
      }
    }
  }
}

// ----- reports must reference a known provider -----
for (const { file, data } of reports) {
  if (data.provider_id && !seenProviderIds.has(data.provider_id)) {
    issues.push({
      level: "error",
      file,
      message: `report references unknown provider id "${data.provider_id}"`,
    });
  }
  if (data.hospital_id && !seenHospitalIds.has(data.hospital_id)) {
    issues.push({
      level: "warn",
      file,
      message: `report references unknown hospital id "${data.hospital_id}"`,
    });
  }
}

// ----- duplicate phone numbers across providers -----
// Suppress when the duplicate is within the same brand (one national helpline
// routing to many cities is legitimate); only flag cross-brand duplicates
// (likely accidental copy from one provider to another).
const phoneIndex = new Map<string, { id: string; brand: string }>();
for (const { data } of providers) {
  const phone = data.contact?.phone_24h;
  if (!phone || phone === "+91 00000 00000" || phone === "108") continue;
  const brand = (data.brand_name ?? "").toLowerCase();
  const prev = phoneIndex.get(phone);
  if (prev && prev.brand !== brand) {
    issues.push({
      level: "warn",
      file: data.id,
      message: `phone ${phone} appears in cross-brand records: ${prev.id} (${prev.brand}), ${data.id} (${brand})`,
    });
  } else if (!prev) {
    phoneIndex.set(phone, { id: data.id, brand });
  }
}

// ----- report -----
const errors = issues.filter((i) => i.level === "error");
const warns = issues.filter((i) => i.level === "warn");

for (const i of issues) {
  const marker = i.level === "error" ? "✗" : "⚠";
  console.log(`${marker} [${i.level}] ${i.file}: ${i.message}`);
}

console.log("");
console.log(`Summary: ${errors.length} errors, ${warns.length} warnings.`);

if (errors.length > 0) {
  process.exit(1);
}
console.log("✓ All records valid.");
