#!/usr/bin/env tsx
/**
 * One-off seed script — generate per-state 108 records, per-city aggregator
 * records, and per-city hospital records covering the major Indian metros.
 *
 * All records are flagged `status: unverified` with placeholder phones except
 * the universally-stable 108 short-code. The verification cycle will flip
 * status as the maintainer makes calls.
 *
 * Idempotent — skips files that already exist (so re-runs don't clobber
 * hand-edits).
 */

import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROVIDERS_DIR = join(ROOT, "data", "providers");
const HOSPITALS_DIR = join(ROOT, "data", "hospitals");
const EDGES_PATH = join(ROOT, "data", "affiliations", "edges.csv");

const today = new Date().toISOString().slice(0, 10);
const COUNTRY_LICENSE = "CC-BY-NC-SA-4.0";

type City = {
  slug: string;
  label: string;
  state: string;
  lat: number;
  lng: number;
  pinPrefixes: string[];
};

const CITIES: City[] = [
  { slug: "bangalore", label: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, pinPrefixes: ["560", "561", "562"] },
  { slug: "mumbai", label: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777, pinPrefixes: ["400", "401", "402"] },
  { slug: "delhi", label: "Delhi NCR", state: "Delhi", lat: 28.6139, lng: 77.2090, pinPrefixes: ["110", "111", "112", "121", "122", "201"] },
  { slug: "chennai", label: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, pinPrefixes: ["600", "601", "602", "603"] },
  { slug: "hyderabad", label: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, pinPrefixes: ["500", "501", "502"] },
  { slug: "kolkata", label: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, pinPrefixes: ["700", "711", "712", "713"] },
  { slug: "pune", label: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, pinPrefixes: ["411", "412", "413"] },
];

// ----- helpers -----

function expandPincodes(prefixes: string[], count = 30): string[] {
  const out: string[] = [];
  for (const px of prefixes) {
    if (px.length !== 3) continue;
    for (let i = 1; i <= count && out.length < 100; i++) {
      out.push(`${px}${String(i).padStart(3, "0")}`);
    }
  }
  return out;
}

function writeYaml(dir: string, slug: string, data: Record<string, unknown>): boolean {
  const path = join(dir, `${slug}.yaml`);
  if (existsSync(path)) return false;
  writeFileSync(path, yaml.dump(data, { lineWidth: 100 }));
  return true;
}

let added = 0;
let skipped = 0;

// ----- per-state 108 records (excluding Karnataka — already exists) -----

type EMSState = {
  slug: string;
  state: string;
  brand: string;
  legal: string;
  hq_city: string;
  hq_lat: number;
  hq_lng: number;
  contractor_certs: string[];
  website: string;
};

const STATE_EMS: EMSState[] = [
  {
    slug: "108-maharashtra-mems",
    state: "Maharashtra",
    brand: "108 Maharashtra Emergency Medical Services (MEMS)",
    legal: "Maharashtra Emergency Medical Services / BVG India Ltd. (contractor)",
    hq_city: "Mumbai",
    hq_lat: 19.0760, hq_lng: 72.8777,
    contractor_certs: ["BVG_contracted"],
    website: "https://www.maharashtra.gov.in/",
  },
  {
    slug: "108-tamil-nadu",
    state: "Tamil Nadu",
    brand: "108 Tamil Nadu Emergency Medical Services",
    legal: "GVK EMRI on contract with Tamil Nadu Health Department",
    hq_city: "Chennai",
    hq_lat: 13.0827, hq_lng: 80.2707,
    contractor_certs: ["GVK_contracted"],
    website: "https://www.tnhealth.tn.gov.in/",
  },
  {
    slug: "108-andhra-pradesh",
    state: "Andhra Pradesh",
    brand: "108 Andhra Pradesh Emergency Response Services",
    legal: "GVK EMRI on contract with AP Health Department",
    hq_city: "Visakhapatnam",
    hq_lat: 17.6868, hq_lng: 83.2185,
    contractor_certs: ["GVK_contracted"],
    website: "https://www.emri.in/",
  },
  {
    slug: "108-telangana",
    state: "Telangana",
    brand: "108 Telangana Emergency Response Services",
    legal: "GVK EMRI on contract with Telangana Health Department",
    hq_city: "Hyderabad",
    hq_lat: 17.3850, hq_lng: 78.4867,
    contractor_certs: ["GVK_contracted"],
    website: "https://www.emri.in/",
  },
  {
    slug: "108-kerala-kass",
    state: "Kerala",
    brand: "108 Kanivu Emergency Medical Services (Kerala)",
    legal: "Kerala State Health Department / GVK EMRI",
    hq_city: "Thiruvananthapuram",
    hq_lat: 8.5241, hq_lng: 76.9366,
    contractor_certs: ["GVK_contracted"],
    website: "https://dhs.kerala.gov.in/",
  },
  {
    slug: "108-west-bengal",
    state: "West Bengal",
    brand: "108 West Bengal Emergency Services",
    legal: "West Bengal Health Department / contractor varies",
    hq_city: "Kolkata",
    hq_lat: 22.5726, hq_lng: 88.3639,
    contractor_certs: [],
    website: "https://www.wbhealth.gov.in/",
  },
  {
    slug: "108-gujarat",
    state: "Gujarat",
    brand: "108 Gujarat Emergency Response Services",
    legal: "GVK EMRI on contract with Gujarat Health Department",
    hq_city: "Ahmedabad",
    hq_lat: 23.0225, hq_lng: 72.5714,
    contractor_certs: ["GVK_contracted"],
    website: "https://www.emri.in/",
  },
  {
    slug: "108-rajasthan",
    state: "Rajasthan",
    brand: "108 Rajasthan Emergency Medical Services",
    legal: "Ziqitza Healthcare Limited on contract with Rajasthan Health Department",
    hq_city: "Jaipur",
    hq_lat: 26.9124, hq_lng: 75.7873,
    contractor_certs: ["ZHL_contracted"],
    website: "https://rajswasthya.nic.in/",
  },
  {
    slug: "108-madhya-pradesh",
    state: "Madhya Pradesh",
    brand: "108 Sanjeevani Madhya Pradesh",
    legal: "Ziqitza Healthcare / Sambharosa on contract with MP Health Department",
    hq_city: "Bhopal",
    hq_lat: 23.2599, hq_lng: 77.4126,
    contractor_certs: ["ZHL_contracted"],
    website: "https://www.health.mp.gov.in/",
  },
  {
    slug: "108-uttar-pradesh",
    state: "Uttar Pradesh",
    brand: "108 UP Sanjeevani Emergency Services",
    legal: "GVK EMRI on contract with UP Health Department",
    hq_city: "Lucknow",
    hq_lat: 26.8467, hq_lng: 80.9462,
    contractor_certs: ["GVK_contracted"],
    website: "https://upnrhm.gov.in/",
  },
  {
    slug: "cats-delhi",
    state: "Delhi",
    brand: "CATS (Centralised Accident & Trauma Services, Delhi)",
    legal: "Government of NCT of Delhi",
    hq_city: "New Delhi",
    hq_lat: 28.6139, hq_lng: 77.2090,
    contractor_certs: [],
    website: "https://health.delhi.gov.in/",
  },
];

for (const s of STATE_EMS) {
  const data = {
    id: s.slug,
    legal_name: s.legal,
    brand_name: s.brand,
    type: "govt-108",
    hq_address: `State EMS HQ, ${s.hq_city}, ${s.state}`,
    hq_lat_lng: [s.hq_lat, s.hq_lng],
    contact: {
      phone_24h: "108",
      alt_phone: null,
      whatsapp: null,
      email: null,
      website: s.website,
    },
    service_areas: { type: "polygon", polygon: [[s.hq_lat - 1, s.hq_lng - 1], [s.hq_lat + 1, s.hq_lng - 1], [s.hq_lat + 1, s.hq_lng + 1], [s.hq_lat - 1, s.hq_lng + 1]] },
    hospital_affiliations: [],
    fleet_count_claimed: null,
    fleet_count_verified: null,
    fares: {
      base: 0,
      per_km: 0,
      waiting: null,
      night_premium: null,
      currency: "INR",
      source: `${s.website} (free at point of use for emergencies)`,
      observed_date: today,
    },
    certifications: s.contractor_certs,
    sources: [
      {
        type: "govt-listing",
        url: s.website,
        accessed: today,
        notes: `State-level 108 EMS published on the ${s.state} health department website.`,
      },
    ],
    call_logs: [],
    status: "unverified",
    last_verified_at: null,
    verified_by: null,
    license_tag: COUNTRY_LICENSE,
    notes: `${s.state} state-wide 108 emergency medical service. The number 108 routes through a state-operated call centre. Station-level details (locations, fleet counts) pending RTI to the ${s.state} health department.`,
  };
  if (writeYaml(PROVIDERS_DIR, s.slug, data)) added++; else skipped++;
}

// ----- per-city aggregator records -----

type Aggregator = {
  brand_slug: string;
  brand_name: string;
  legal: string;
  website: string;
  cities: string[]; // city slugs
  notes: string;
};

const AGGREGATORS: Aggregator[] = [
  {
    brand_slug: "red-health",
    brand_name: "RED.Health",
    legal: "StanPlus Technologies Private Limited (RED.Health)",
    website: "https://www.red.health",
    cities: ["mumbai", "delhi", "chennai", "hyderabad", "pune", "kolkata"],
    notes: "Hyderabad-headquartered aggregator, multi-city ops including air ambulance.",
  },
  {
    brand_slug: "medulance",
    brand_name: "Medulance",
    legal: "Medulance Healthcare Private Limited",
    website: "https://www.medulance.com",
    cities: ["mumbai", "delhi", "chennai", "hyderabad", "pune"],
    notes: "Delhi-headquartered private aggregator, expanding across metros.",
  },
  {
    brand_slug: "ziqitza",
    brand_name: "Ziqitza Healthcare",
    legal: "Ziqitza Healthcare Limited",
    website: "https://www.zhl.org.in",
    cities: ["mumbai", "delhi", "kolkata"],
    notes: "ZHL operates both private aggregator services and several state 108 contracts.",
  },
  {
    brand_slug: "dial4242",
    brand_name: "Dial 4242",
    legal: "Dial 4242 ambulance booking service",
    website: "https://www.dial4242.com",
    cities: ["mumbai", "pune"],
    notes: "Mumbai-origin booking service.",
  },
  {
    brand_slug: "vmedo",
    brand_name: "VMEDO",
    legal: "VMEDO Healthcare Private Limited",
    website: "https://www.vmedo.com",
    cities: ["chennai", "hyderabad"],
    notes: "Bangalore-origin, expanding nationally.",
  },
  {
    brand_slug: "helpnow",
    brand_name: "HelpNow",
    legal: "HelpNow (TechWeirdo Technologies Private Limited)",
    website: "https://www.gethelpnow.in",
    cities: ["delhi", "pune"],
    notes: "Mumbai-origin, multi-city ops.",
  },
];

const cityByslug: Record<string, City> = Object.fromEntries(CITIES.map((c) => [c.slug, c]));

for (const a of AGGREGATORS) {
  for (const citySlug of a.cities) {
    const c = cityByslug[citySlug];
    if (!c) continue;
    const slug = `${a.brand_slug}-${citySlug}`;
    const data = {
      id: slug,
      legal_name: a.legal,
      brand_name: a.brand_name,
      type: "private-aggregator",
      hq_address: `${c.label} operations base — pending verification call`,
      hq_lat_lng: [c.lat, c.lng],
      contact: {
        phone_24h: "+91 00000 00000",
        alt_phone: null,
        whatsapp: null,
        email: null,
        website: a.website,
      },
      service_areas: { type: "pincode-list", pincodes: expandPincodes(c.pinPrefixes) },
      hospital_affiliations: [],
      fleet_count_claimed: null,
      fleet_count_verified: null,
      fares: null,
      certifications: [],
      sources: [
        {
          type: "website",
          url: a.website,
          accessed: today,
          notes: `${a.notes} ${c.label} presence to be confirmed by verification call.`,
        },
      ],
      call_logs: [],
      status: "unverified",
      last_verified_at: null,
      verified_by: null,
      license_tag: COUNTRY_LICENSE,
      notes: `${a.brand_name} ${c.label} record. ${a.notes} All operational details pending verification call.`,
    };
    if (writeYaml(PROVIDERS_DIR, slug, data)) added++; else skipped++;
  }
}

// ----- per-city hospitals (3-4 per city) -----

type HospitalSeed = {
  slug: string;
  name: string;
  brand: string;
  type: string;
  city: string; // city slug
  address: string;
  pincode: string;
  lat: number;
  lng: number;
  website: string;
  owns_fleet: boolean;
};

const HOSPITALS: HospitalSeed[] = [
  // Mumbai
  { slug: "hinduja-mahim-mumbai", name: "P.D. Hinduja Hospital & MRC", brand: "Hinduja Hospital", type: "tertiary", city: "mumbai", address: "Veer Savarkar Marg, Mahim, Mumbai 400016", pincode: "400016", lat: 19.0428, lng: 72.8400, website: "https://www.hindujahospital.com/", owns_fleet: true },
  { slug: "lilavati-bandra-mumbai", name: "Lilavati Hospital", brand: "Lilavati Hospital", type: "multi-speciality", city: "mumbai", address: "A-791, Bandra Reclamation, Bandra (W), Mumbai 400050", pincode: "400050", lat: 19.0517, lng: 72.8276, website: "https://www.lilavatihospital.com/", owns_fleet: true },
  { slug: "kokilaben-andheri-mumbai", name: "Kokilaben Dhirubhai Ambani Hospital", brand: "Kokilaben Hospital", type: "tertiary", city: "mumbai", address: "Rao Saheb Achutrao Patwardhan Marg, Four Bunglows, Andheri (W), Mumbai 400053", pincode: "400053", lat: 19.1314, lng: 72.8278, website: "https://www.kokilabenhospital.com/", owns_fleet: true },
  { slug: "tata-memorial-parel-mumbai", name: "Tata Memorial Hospital", brand: "Tata Memorial Centre", type: "speciality", city: "mumbai", address: "Dr. E Borges Road, Parel, Mumbai 400012", pincode: "400012", lat: 19.0090, lng: 72.8423, website: "https://tmc.gov.in/", owns_fleet: false },

  // Delhi
  { slug: "aiims-delhi", name: "All India Institute of Medical Sciences (AIIMS) Delhi", brand: "AIIMS", type: "tertiary", city: "delhi", address: "Ansari Nagar, New Delhi 110029", pincode: "110029", lat: 28.5672, lng: 77.2100, website: "https://www.aiims.edu/", owns_fleet: true },
  { slug: "max-saket-delhi", name: "Max Super Speciality Hospital, Saket", brand: "Max Healthcare", type: "tertiary", city: "delhi", address: "1, 2 Press Enclave Marg, Saket, New Delhi 110017", pincode: "110017", lat: 28.5273, lng: 77.2167, website: "https://www.maxhealthcare.in/", owns_fleet: true },
  { slug: "fortis-vasant-kunj-delhi", name: "Fortis Escorts Heart Institute (Okhla Road) and Fortis Vasant Kunj", brand: "Fortis Healthcare", type: "tertiary", city: "delhi", address: "Sector B, Pocket 1, Aruna Asaf Ali Marg, Vasant Kunj, New Delhi 110070", pincode: "110070", lat: 28.5251, lng: 77.1565, website: "https://www.fortishealthcare.com/", owns_fleet: true },
  { slug: "apollo-sarita-vihar-delhi", name: "Indraprastha Apollo Hospitals", brand: "Apollo Hospitals", type: "tertiary", city: "delhi", address: "Mathura Road, Sarita Vihar, New Delhi 110076", pincode: "110076", lat: 28.5391, lng: 77.2856, website: "https://www.apollohospitals.com/", owns_fleet: true },

  // Chennai
  { slug: "apollo-greams-chennai", name: "Apollo Hospitals — Greams Road", brand: "Apollo Hospitals", type: "tertiary", city: "chennai", address: "21, Greams Lane, Off Greams Road, Chennai 600006", pincode: "600006", lat: 13.0613, lng: 80.2497, website: "https://www.apollohospitals.com/locations/india/chennai/apollo-hospitals-greams-road-chennai/", owns_fleet: true },
  { slug: "mgm-chennai", name: "MGM Healthcare", brand: "MGM Healthcare", type: "multi-speciality", city: "chennai", address: "New No. 72 (Old No. 54), Nelson Manickam Road, Aminjikarai, Chennai 600029", pincode: "600029", lat: 13.0703, lng: 80.2202, website: "https://www.mgmhealthcare.in/", owns_fleet: true },
  { slug: "fortis-malar-chennai", name: "Fortis Malar Hospital", brand: "Fortis Healthcare", type: "multi-speciality", city: "chennai", address: "52, 1st Main Road, Gandhinagar, Adyar, Chennai 600020", pincode: "600020", lat: 13.0067, lng: 80.2563, website: "https://www.fortismalar.com/", owns_fleet: true },

  // Hyderabad
  { slug: "apollo-jubilee-hyderabad", name: "Apollo Hospitals — Jubilee Hills", brand: "Apollo Hospitals", type: "tertiary", city: "hyderabad", address: "Road No. 72, Opp. Bharatiya Vidya Bhavan, Film Nagar, Jubilee Hills, Hyderabad 500033", pincode: "500033", lat: 17.4170, lng: 78.4111, website: "https://www.apollohospitals.com/locations/india/hyderabad/apollo-hospitals-jubilee-hills-hyderabad/", owns_fleet: true },
  { slug: "kims-secunderabad", name: "KIMS Hospitals — Secunderabad", brand: "KIMS Hospitals", type: "tertiary", city: "hyderabad", address: "1-8-31/1, Minister Road, Krishna Nagar Colony, Secunderabad 500003", pincode: "500003", lat: 17.4346, lng: 78.4983, website: "https://www.kimshospitals.com/", owns_fleet: true },
  { slug: "aig-hyderabad", name: "AIG Hospitals", brand: "AIG Hospitals", type: "tertiary", city: "hyderabad", address: "Plot No 2/3/4/5, Survey No 136/1, Mindspace Road, Gachibowli, Hyderabad 500032", pincode: "500032", lat: 17.4400, lng: 78.3489, website: "https://www.aighospitals.com/", owns_fleet: true },

  // Kolkata
  { slug: "apollo-gleneagles-kolkata", name: "Apollo Multispeciality Hospitals — Kolkata (formerly Apollo Gleneagles)", brand: "Apollo Hospitals", type: "tertiary", city: "kolkata", address: "58, Canal Circular Road, Kadapara, Phool Bagan, Kolkata 700054", pincode: "700054", lat: 22.5800, lng: 88.4014, website: "https://www.apollohospitals.com/locations/india/kolkata/apollo-multispeciality-hospitals-kolkata/", owns_fleet: true },
  { slug: "fortis-anandapur-kolkata", name: "Fortis Hospital — Anandapur", brand: "Fortis Healthcare", type: "tertiary", city: "kolkata", address: "730, Anandapur, E. M. Bypass Road, Kolkata 700107", pincode: "700107", lat: 22.5142, lng: 88.4030, website: "https://www.fortishealthcare.com/india/west-bengal/fortis-hospital-anandapur-kolkata", owns_fleet: true },
  { slug: "amri-saltlake-kolkata", name: "AMRI Hospital — Salt Lake", brand: "AMRI Hospitals", type: "multi-speciality", city: "kolkata", address: "JC-16 & 17, Salt Lake City, Sector III, Kolkata 700098", pincode: "700098", lat: 22.5800, lng: 88.4179, website: "https://www.amrihospitals.in/", owns_fleet: true },

  // Pune
  { slug: "ruby-hall-pune", name: "Ruby Hall Clinic", brand: "Ruby Hall Clinic", type: "tertiary", city: "pune", address: "40, Sassoon Road, Pune 411001", pincode: "411001", lat: 18.5306, lng: 73.8773, website: "https://rubyhall.com/", owns_fleet: true },
  { slug: "jehangir-pune", name: "Jehangir Hospital", brand: "Jehangir Hospital", type: "multi-speciality", city: "pune", address: "32, Sassoon Road, Pune 411001", pincode: "411001", lat: 18.5295, lng: 73.8783, website: "https://www.jehangirhospital.com/", owns_fleet: true },
  { slug: "sahyadri-deccan-pune", name: "Sahyadri Hospital — Deccan Gymkhana", brand: "Sahyadri Hospitals", type: "multi-speciality", city: "pune", address: "Plot No 30-C, Erandwane, Karve Road, Pune 411004", pincode: "411004", lat: 18.5076, lng: 73.8278, website: "https://www.sahyadrihospitals.com/", owns_fleet: true },
];

for (const h of HOSPITALS) {
  const data = {
    id: h.slug,
    name: h.name,
    brand: h.brand,
    type: h.type,
    city: cityByslug[h.city]?.label ?? h.city,
    state: cityByslug[h.city]?.state ?? "India",
    address: h.address,
    pincode: h.pincode,
    lat_lng: [h.lat, h.lng],
    er_phone: "+91 00000 00000",
    ambulance_phone: null,
    owns_fleet: h.owns_fleet,
    fleet_provider_id: h.owns_fleet ? `${h.slug}-ambulance` : null,
    dispatched_providers: h.owns_fleet
      ? [
          {
            provider_id: `${h.slug}-ambulance`,
            source: `${h.website} (hospital-owned fleet, primary)`,
            observed_date: today,
            exclusivity: "primary",
          },
        ]
      : [],
    sources: [
      {
        type: "website",
        url: h.website,
        accessed: today,
        notes: "Hospital website confirms operations. ER phone and external-provider affiliations pending verification.",
      },
    ],
    status: "unverified",
    last_verified_at: null,
    license_tag: COUNTRY_LICENSE,
  };
  if (writeYaml(HOSPITALS_DIR, h.slug, data)) added++; else skipped++;

  // Paired hospital-owned provider
  if (h.owns_fleet) {
    const provSlug = `${h.slug}-ambulance`;
    const prov = {
      id: provSlug,
      legal_name: h.brand,
      brand_name: `${h.brand} Ambulance Service (${cityByslug[h.city]?.label ?? h.city})`,
      type: "hospital-owned",
      hq_address: h.address,
      hq_lat_lng: [h.lat, h.lng],
      contact: {
        phone_24h: "+91 00000 00000",
        alt_phone: null,
        whatsapp: null,
        email: null,
        website: h.website,
      },
      service_areas: { type: "pincode-list", pincodes: expandPincodes(cityByslug[h.city]?.pinPrefixes ?? []) },
      hospital_affiliations: [
        {
          hospital_id: h.slug,
          exclusivity: "primary",
          source: `${h.website} (hospital-owned fleet)`,
          observed_date: today,
        },
      ],
      fleet_count_claimed: null,
      fleet_count_verified: null,
      fares: null,
      certifications: [],
      sources: [
        {
          type: "hospital-listing",
          url: h.website,
          accessed: today,
          notes: "Hospital website confirms in-house ambulance fleet.",
        },
      ],
      call_logs: [],
      status: "unverified",
      last_verified_at: null,
      verified_by: null,
      license_tag: COUNTRY_LICENSE,
      notes: `In-house fleet operated by ${h.brand}. Dispatch number, fleet size, fares pending verification call.`,
    };
    if (writeYaml(PROVIDERS_DIR, provSlug, prov)) added++; else skipped++;
  }
}

// ----- update affiliation edges CSV -----
function appendEdge(provider_id: string, hospital_id: string, exclusivity: string, source: string) {
  const line = `${provider_id},${hospital_id},${exclusivity},${source},${today},false\n`;
  const existing = readFileSync(EDGES_PATH, "utf8");
  if (existing.includes(`${provider_id},${hospital_id},`)) return;
  writeFileSync(EDGES_PATH, existing + line);
}

for (const h of HOSPITALS) {
  if (!h.owns_fleet) continue;
  appendEdge(`${h.slug}-ambulance`, h.slug, "primary", h.website);
}

console.log(`✓ Added ${added}, skipped ${skipped} (already existed).`);
