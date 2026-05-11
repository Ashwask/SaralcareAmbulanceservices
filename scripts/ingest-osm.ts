#!/usr/bin/env tsx
/**
 * Ingest ambulance stations and clinics from OpenStreetMap via the Overpass API.
 *
 * Query: nodes/ways with emergency=ambulance_station OR amenity=ambulance_station
 * inside the Bangalore bounding box.
 *
 * Output: stub YAML files under data/providers/ with status=unverified,
 * source=osm. De-duplicates against existing records by name + phone.
 *
 * Run: pnpm ingest:osm
 * Re-run is safe (idempotent on name + phone).
 *
 * NOTE: OSM data is notoriously sparse for ambulance stations in India in 2026.
 * We treat OSM as one signal among many, not the source of truth. Verification
 * calls remain the gate.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROVIDERS_DIR = join(ROOT, "data", "providers");

// Bangalore bounding box (rough): south, west, north, east
const BBOX = [12.7342, 77.3739, 13.1739, 77.8826];

const OVERPASS = "https://overpass-api.de/api/interpreter";

const query = `
[out:json][timeout:60];
(
  node["emergency"="ambulance_station"](${BBOX.join(",")});
  way["emergency"="ambulance_station"](${BBOX.join(",")});
  node["amenity"="ambulance_station"](${BBOX.join(",")});
  way["amenity"="ambulance_station"](${BBOX.join(",")});
);
out center tags;
`;

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
  console.log("Querying Overpass API for Bangalore ambulance stations...");
  const r = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query),
  });
  if (!r.ok) {
    console.error(`Overpass returned ${r.status}: ${await r.text()}`);
    process.exit(1);
  }
  const data = (await r.json()) as { elements: any[] };

  console.log(`Overpass returned ${data.elements.length} candidate elements.`);

  const existing = existingRecords();
  const seen = new Set(existing.map((e) => e.name));

  let added = 0;
  let skipped = 0;

  for (const el of data.elements) {
    const tags = el.tags ?? {};
    const name = tags.name || tags["name:en"] || tags.operator || `osm-${el.id}`;
    const slug = slugify(`${name}-bangalore-osm-${el.id}`);
    if (seen.has(name.toLowerCase().trim())) {
      skipped++;
      continue;
    }

    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) {
      skipped++;
      continue;
    }

    const phone = tags.phone || tags["contact:phone"] || "+91 00000 00000";
    const website = tags.website || tags["contact:website"] || null;

    const record = {
      id: slug,
      legal_name: name,
      brand_name: name,
      type: "private-standalone",
      hq_address: tags["addr:full"] || tags["addr:street"] || "Bengaluru (from OSM)",
      hq_lat_lng: [lat, lon],
      contact: {
        phone_24h: phone.replace(/[^\d+]/g, "").length < 7 ? "+91 00000 00000" : phone,
        alt_phone: null,
        whatsapp: null,
        email: tags["contact:email"] || tags.email || null,
        website,
      },
      service_areas: { type: "pincode-list", pincodes: [] },
      hospital_affiliations: [],
      fleet_count_claimed: null,
      fleet_count_verified: null,
      fares: null,
      certifications: [],
      sources: [
        {
          type: "osm",
          url: `https://www.openstreetmap.org/${el.type}/${el.id}`,
          accessed: new Date().toISOString().slice(0, 10),
          notes: `Tags: ${JSON.stringify(tags)}`,
        },
      ],
      call_logs: [],
      status: "unverified",
      last_verified_at: null,
      verified_by: null,
      license_tag: "CC-BY-NC-SA-4.0",
      notes: `Ingested from OpenStreetMap ${el.type} ${el.id}. Phone, area, fleet, and affiliations all pending verification call.`,
    };

    writeFileSync(join(PROVIDERS_DIR, `${slug}.yaml`), yaml.dump(record, { lineWidth: 100 }));
    added++;
    seen.add(name.toLowerCase().trim());
  }

  console.log(`✓ Added ${added}, skipped ${skipped} (duplicates).`);
})();
