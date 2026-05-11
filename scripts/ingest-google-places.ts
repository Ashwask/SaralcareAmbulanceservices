#!/usr/bin/env tsx
/**
 * Ingest ambulance services from Google Places API (New) within Bangalore.
 *
 * Requires environment variable GOOGLE_PLACES_API_KEY.
 *
 * Output: stub YAML files under data/providers/ with status=unverified,
 * source=google-places.
 *
 * Run: GOOGLE_PLACES_API_KEY=... pnpm ingest:google
 *
 * Notes:
 *  - Google Places API has billing. Each text search call is ~$0.017 (Aug 2025).
 *  - This script issues a single nearbySearch call for "ambulance" within
 *    Bangalore. The free-tier $200/mo allowance covers daily runs.
 *  - Phone, website, and rating fetched via Place Details (one call per result).
 */

import { writeFileSync, readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROVIDERS_DIR = join(ROOT, "data", "providers");

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error("Set GOOGLE_PLACES_API_KEY in the environment.");
  process.exit(1);
}

// Bangalore — central lat/lng + 25km radius covers the BBMP area.
const CENTRE = { lat: 12.9716, lng: 77.5946 };
const RADIUS_M = 25000;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function existingRecords(): { name: string; phone?: string }[] {
  if (!existsSync(PROVIDERS_DIR)) return [];
  return readdirSync(PROVIDERS_DIR)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => {
      const d = yaml.load(readFileSync(join(PROVIDERS_DIR, f), "utf8"), { schema: yaml.JSON_SCHEMA }) as any;
      return { name: (d.brand_name ?? "").toLowerCase().trim(), phone: d.contact?.phone_24h };
    });
}

(async () => {
  // Places API (New) — searchNearby
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri",
    },
    body: JSON.stringify({
      includedTypes: ["ambulance_service"],
      maxResultCount: 20,
      locationRestriction: {
        circle: { center: CENTRE, radius: RADIUS_M },
      },
      languageCode: "en",
      regionCode: "IN",
    }),
  });
  if (!r.ok) {
    console.error(`Places returned ${r.status}: ${await r.text()}`);
    process.exit(1);
  }
  const data = (await r.json()) as { places?: any[] };
  const places = data.places ?? [];

  console.log(`Places returned ${places.length} results.`);

  const existing = existingRecords();
  const seen = new Set(existing.map((e) => e.name));

  let added = 0;
  let skipped = 0;

  for (const p of places) {
    const name = p.displayName?.text;
    if (!name) continue;
    if (seen.has(name.toLowerCase().trim())) {
      skipped++;
      continue;
    }
    const slug = slugify(`${name}-bangalore`);
    const phone = p.internationalPhoneNumber || p.nationalPhoneNumber || "+91 00000 00000";

    const record = {
      id: slug,
      legal_name: name,
      brand_name: name,
      type: "private-standalone",
      hq_address: p.formattedAddress || "Bengaluru",
      hq_lat_lng: [p.location?.latitude ?? CENTRE.lat, p.location?.longitude ?? CENTRE.lng],
      contact: {
        phone_24h: phone.replace(/\s+/g, " ").trim(),
        alt_phone: null,
        whatsapp: null,
        email: null,
        website: p.websiteUri || null,
      },
      service_areas: { type: "pincode-list", pincodes: [] },
      hospital_affiliations: [],
      fleet_count_claimed: null,
      fleet_count_verified: null,
      fares: null,
      certifications: [],
      sources: [
        {
          type: "google-places",
          url: `https://www.google.com/maps/place/?q=place_id:${p.id}`,
          accessed: new Date().toISOString().slice(0, 10),
          notes: `Place ID: ${p.id}`,
        },
      ],
      call_logs: [],
      status: "unverified",
      last_verified_at: null,
      verified_by: null,
      license_tag: "CC-BY-NC-SA-4.0",
      notes: `Ingested from Google Places. Verify by phone before relying on this record.`,
    };

    writeFileSync(join(PROVIDERS_DIR, `${slug}.yaml`), yaml.dump(record, { lineWidth: 100 }));
    added++;
    seen.add(name.toLowerCase().trim());
  }

  console.log(`✓ Added ${added}, skipped ${skipped} (duplicates).`);
})();
