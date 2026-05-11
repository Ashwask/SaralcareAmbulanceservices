#!/usr/bin/env tsx
/**
 * Apply phone numbers gathered from publicly-published provider + hospital
 * websites (via WebFetch / WebSearch). Updates YAML records and adds a
 * `website-scrape` source. Status remains `unverified` — extraction is not
 * verification.
 *
 * Sources column documents where each number came from (canonical hospital
 * page, search-engine cached result, etc.) so anyone reviewing can audit.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROV = join(ROOT, "data", "providers");
const HOSP = join(ROOT, "data", "hospitals");
const today = new Date().toISOString().slice(0, 10);

type PhoneEntry = {
  phone: string;
  source_url: string;
  source_note: string;
};

const PROV_PHONES: Record<string, PhoneEntry> = {
  // RED.Health — single national 24/7 number
  ...prefix("red-health-", ["bangalore", "mumbai", "delhi", "chennai", "hyderabad", "pune", "kolkata"], {
    phone: "+91 91149 11911",
    source_url: "https://www.red.health",
    source_note: "24/7 emergency helpline, single national number per red.health homepage.",
  }),
  // Dial 4242 — single toll-free national
  ...prefix("dial4242-", ["bangalore", "mumbai", "pune"], {
    phone: "1800 266 4242",
    source_url: "https://www.dial4242.com",
    source_note: "24x7 helpline per dial4242.com homepage; 886 cities served.",
  }),
  // VMEDO — national mobile booking line
  ...prefix("vmedo-", ["bangalore", "chennai", "hyderabad"], {
    phone: "+91 93431 80000",
    source_url: "https://vmedo.com/blog/ambulance-service-in-bangalore/",
    source_note: "Primary booking number across cities; alternative 080 67335555 also published.",
  }),
  // HelpNow — single toll-free
  ...prefix("helpnow-", ["bangalore", "mumbai", "delhi", "pune"], {
    phone: "+91 88222 88222",
    source_url: "https://www.gethelpnow.in",
    source_note: "24x7 helpline per multiple search-result sources citing gethelpnow.in.",
  }),
  // Ziqitza / Dial 1298
  ...prefix("ziqitza-", ["bangalore", "mumbai", "delhi", "kolkata"], {
    phone: "+91 97000 01298",
    source_url: "https://zhl.org.in/ambulance-in-mumbai",
    source_note: "Dial 1298 booking line, Mumbai-origin, now multi-city.",
  }),

  // Hospital-owned: Apollo chain — national 1860
  ...mapPhone(["apollo-hospitals-ambulance-bangalore", "apollo-sarita-vihar-delhi-ambulance", "apollo-greams-chennai-ambulance", "apollo-jubilee-hyderabad-ambulance", "apollo-gleneagles-kolkata-ambulance"], {
    phone: "1860 500 1066",
    source_url: "https://www.apollohospitals.com",
    source_note: "Ask Apollo pan-India helpline routes by city via IVR. Per indiacustomercare.com listings.",
  }),
  // Manipal chain
  "manipal-hospitals-ambulance-bangalore": {
    phone: "1800 102 5555",
    source_url: "https://www.manipalhospitals.com/contact-us/",
    source_note: "Manipal Hospitals enquiry/appointment toll-free, routes by city via IVR.",
  },
  // Fortis chain
  ...mapPhone(["fortis-vasant-kunj-delhi-ambulance", "fortis-malar-chennai-ambulance", "fortis-anandapur-kolkata-ambulance"], {
    phone: "9205 010 100",
    source_url: "https://www.fortishealthcare.com/contact-us",
    source_note: "Fortis Emergency Response Service single helpline number.",
  }),
  // Max chain
  "max-saket-delhi-ambulance": {
    phone: "011 4055 4055",
    source_url: "https://www.maxhealthcare.in/contact-us",
    source_note: "Max 24x7 emergency helpline per maxhealthcare.in.",
  },
  // Narayana chain
  "narayana-health-ambulance-bangalore": {
    phone: "1800 309 0309",
    source_url: "https://www.narayanahealth.org/contact-us",
    source_note: "Narayana Health primary contact, toll-free.",
  },
  // AIIMS Delhi (govt)
  "aiims-delhi-ambulance": {
    phone: "011 26596428",
    source_url: "https://www.aiims.edu/index.php/en",
    source_note: "AIIMS MSSO Control Room (emergency) per AIIMS contact page.",
  },
  // Lilavati Mumbai — direct ambulance line
  "lilavati-bandra-mumbai-ambulance": {
    phone: "+91 97692 50010",
    source_url: "https://www.lilavatihospital.com/contact-us",
    source_note: "Lilavati Hospital ambulance dispatch (alt: 75063 58779).",
  },
  // Kokilaben Mumbai — emergency + ambulance unified
  "kokilaben-andheri-mumbai-ambulance": {
    phone: "+91 22 4269 9999",
    source_url: "https://www.kokilabenhospital.com/contacts.html",
    source_note: "Kokilaben emergency treatment / ambulance, 24h.",
  },
  // Hinduja Mumbai
  "hinduja-mahim-mumbai-ambulance": {
    phone: "+91 22 2445 1515",
    source_url: "https://www.hindujahospital.com/contact-us-helpline/",
    source_note: "P. D. Hinduja Hospital main board; specific ambulance number to be confirmed on call.",
  },
  // Ruby Hall Pune
  "ruby-hall-pune-ambulance": {
    phone: "+91 70577 00700",
    source_url: "https://rubyhall.com/accident-emergency",
    source_note: "Ruby Hall main campus emergency ambulance number.",
  },
  // Jehangir Pune
  "jehangir-pune-ambulance": {
    phone: "1066",
    source_url: "https://www.jehangircares.com/ems.php",
    source_note: "Jehangir Cares dial-1066 within 30km radius. Alt: +91 88888 81066.",
  },
  // Sahyadri Deccan
  "sahyadri-deccan-pune-ambulance": {
    phone: "+91 88062 52525",
    source_url: "https://sahyadrihospital.com/deccan/",
    source_note: "Sahyadri Multispeciality Hospital Deccan Gymkhana 24/7 emergency.",
  },
  // AMRI / Manipal Broadway Kolkata
  "amri-saltlake-kolkata-ambulance": {
    phone: "+91 80352 40555",
    source_url: "https://www.amrihospitals.in/contact-us",
    source_note: "AMRI Hospitals (now Manipal Broadway) 24/7 helpline.",
  },
  // MGM Chennai
  "mgm-chennai-ambulance": {
    phone: "+91 44 4524 2407",
    source_url: "https://mgmhealthcare.in/contact-us/",
    source_note: "MGM Healthcare general emergency contact. Chest-pain hotline 4200 4200 also published.",
  },
  // KIMS Secunderabad
  "kims-secunderabad-ambulance": {
    phone: "+91 40 4488 5000",
    source_url: "https://www.kimshospitals.com/contact-us/",
    source_note: "KIMS Hospitals Secunderabad flagship board.",
  },
  // AIG Hyderabad
  "aig-hyderabad-ambulance": {
    phone: "040 4244 4244",
    source_url: "https://www.aighospitals.com/",
    source_note: "AIG Hospitals Gachibowli 24h emergency line.",
  },
};

const HOSP_PHONES: Record<string, PhoneEntry & { ambulance?: string }> = {
  // Bangalore
  "manipal-old-airport-road": {
    phone: "1800 102 5555",
    source_url: "https://www.manipalhospitals.com/oldairportroad/contact-us/",
    source_note: "Manipal chain helpline; routes to Old Airport Road via IVR.",
  },
  "apollo-bannerghatta": {
    phone: "1860 500 1066",
    source_url: "https://www.apollohospitals.com/locations/india/bangalore/",
    source_note: "Apollo pan-India helpline; routes to Bannerghatta via IVR.",
  },
  "fortis-bannerghatta-road": {
    phone: "9205 010 100",
    source_url: "https://www.fortishealthcare.com/bangalore/fortis-hospital-bannerghatta-road",
    source_note: "Fortis ER helpline; routes to Bannerghatta Road campus.",
  },
  "narayana-health-city": {
    phone: "1800 309 0309",
    source_url: "https://www.narayanahealth.org/hospitals/narayana-health-city-bangalore",
    source_note: "Narayana Health main contact; routes to Health City campus.",
  },
  "aster-cmi": {
    phone: "080 4647 4647",
    source_url: "https://www.asterhospitals.in/hospitals/aster-cmi-bangalore",
    source_note: "Aster CMI Bangalore direct emergency line.",
  },
  // Delhi
  "aiims-delhi": {
    phone: "011 26596428",
    source_url: "https://www.aiims.edu/index.php/en",
    source_note: "AIIMS Delhi MSSO Control Room (emergency). Board 011-26588500/26588700.",
  },
  "max-saket-delhi": {
    phone: "011 4055 4055",
    source_url: "https://www.maxhealthcare.in/contact-us",
    source_note: "Max 24x7 emergency helpline.",
  },
  "fortis-vasant-kunj-delhi": {
    phone: "9205 010 100",
    source_url: "https://www.fortishealthcare.com/contact-us",
    source_note: "Fortis ER helpline.",
  },
  "apollo-sarita-vihar-delhi": {
    phone: "1860 500 1066",
    source_url: "https://www.apollohospitals.com/locations/india/delhi/",
    source_note: "Apollo pan-India helpline; routes to Indraprastha Apollo (Sarita Vihar).",
  },
  // Chennai
  "apollo-greams-chennai": {
    phone: "1860 500 1066",
    source_url: "https://www.apollohospitals.com/locations/india/chennai/",
    source_note: "Apollo pan-India helpline; routes to Greams Road campus.",
  },
  "mgm-chennai": {
    phone: "+91 44 4524 2407",
    source_url: "https://mgmhealthcare.in/contact-us/",
    source_note: "MGM Healthcare Aminjikarai direct number.",
  },
  "fortis-malar-chennai": {
    phone: "9205 010 100",
    source_url: "https://www.fortismalar.com/",
    source_note: "Fortis ER helpline; routes to Malar campus.",
  },
  // Hyderabad
  "apollo-jubilee-hyderabad": {
    phone: "1860 500 1066",
    source_url: "https://www.apollohospitals.com/locations/india/hyderabad/",
    source_note: "Apollo pan-India helpline; routes to Jubilee Hills campus.",
  },
  "kims-secunderabad": {
    phone: "+91 40 4488 5000",
    source_url: "https://www.kimshospitals.com/contact-us/",
    source_note: "KIMS Hospitals Secunderabad flagship board.",
  },
  "aig-hyderabad": {
    phone: "040 4244 4244",
    source_url: "https://www.aighospitals.com/",
    source_note: "AIG Hospitals Gachibowli 24h emergency.",
  },
  // Kolkata
  "apollo-gleneagles-kolkata": {
    phone: "1860 500 1066",
    source_url: "https://www.apollohospitals.com/locations/india/kolkata/",
    source_note: "Apollo pan-India helpline; routes to Kolkata Multispeciality.",
  },
  "fortis-anandapur-kolkata": {
    phone: "9205 010 100",
    source_url: "https://www.fortishealthcare.com/india/west-bengal/fortis-hospital-anandapur-kolkata",
    source_note: "Fortis ER helpline.",
  },
  "amri-saltlake-kolkata": {
    phone: "+91 80352 40555",
    source_url: "https://www.amrihospitals.in/contact-us",
    source_note: "AMRI (now Manipal Broadway) 24/7 emergency.",
  },
  // Pune
  "ruby-hall-pune": {
    phone: "+91 70577 00700",
    source_url: "https://rubyhall.com/accident-emergency",
    source_note: "Ruby Hall Sassoon Road campus emergency.",
  },
  "jehangir-pune": {
    phone: "020 66819999",
    source_url: "https://www.jehangirhospital.com/contact-us/",
    source_note: "Jehangir Hospital main number. Ambulance short code: 1066.",
  },
  "sahyadri-deccan-pune": {
    phone: "+91 88062 52525",
    source_url: "https://sahyadrihospital.com/deccan/",
    source_note: "Sahyadri Deccan Gymkhana 24/7 emergency.",
  },
  // Mumbai
  "hinduja-mahim-mumbai": {
    phone: "+91 22 2445 1515",
    source_url: "https://www.hindujahospital.com/contact-us-helpline/",
    source_note: "P. D. Hinduja Hospital main board.",
  },
  "lilavati-bandra-mumbai": {
    phone: "022 69318063",
    ambulance: "+91 97692 50010",
    source_url: "https://www.lilavatihospital.com/contact-us",
    source_note: "Lilavati casualty + direct ambulance line.",
  },
  "kokilaben-andheri-mumbai": {
    phone: "+91 22 4269 9999",
    source_url: "https://www.kokilabenhospital.com/contacts.html",
    source_note: "Kokilaben emergency treatment / ambulance, 24h.",
  },
  "tata-memorial-parel-mumbai": {
    phone: "+91 22 2417 7000",
    source_url: "https://tmc.gov.in/contactus",
    source_note: "Tata Memorial Hospital main contact.",
  },
};

// ----- helpers -----

function prefix(slugPrefix: string, cities: string[], entry: PhoneEntry): Record<string, PhoneEntry> {
  const out: Record<string, PhoneEntry> = {};
  for (const c of cities) out[`${slugPrefix}${c}`] = entry;
  return out;
}

function mapPhone(ids: string[], entry: PhoneEntry): Record<string, PhoneEntry> {
  const out: Record<string, PhoneEntry> = {};
  for (const id of ids) out[id] = entry;
  return out;
}

function updateRecord(dir: string, id: string, mutator: (rec: any) => void): boolean {
  const path = join(dir, `${id}.yaml`);
  if (!existsSync(path)) return false;
  const rec = yaml.load(readFileSync(path, "utf8"), { schema: yaml.JSON_SCHEMA }) as any;
  mutator(rec);
  writeFileSync(path, yaml.dump(rec, { lineWidth: 100 }));
  return true;
}

function addSource(rec: any, e: PhoneEntry) {
  rec.sources = rec.sources ?? [];
  rec.sources.push({
    type: "website",
    url: e.source_url,
    accessed: today,
    notes: `Phone scraped from public source: ${e.source_note}`,
  });
}

// ----- apply -----

let touched = 0;
let missing = 0;

for (const [id, e] of Object.entries(PROV_PHONES)) {
  const ok = updateRecord(PROV, id, (rec) => {
    rec.contact.phone_24h = e.phone;
    addSource(rec, e);
  });
  if (ok) touched++;
  else { missing++; console.log(`  · missing provider: ${id}`); }
}

for (const [id, e] of Object.entries(HOSP_PHONES)) {
  const ok = updateRecord(HOSP, id, (rec) => {
    rec.er_phone = e.phone;
    if (e.ambulance) rec.ambulance_phone = e.ambulance;
    addSource(rec, e);
  });
  if (ok) touched++;
  else { missing++; console.log(`  · missing hospital: ${id}`); }
}

console.log(`\n✓ Updated ${touched} records. ${missing} ID(s) not found.`);
console.log(`  All records remain status=unverified — extraction is not verification.`);
console.log(`  Source URL + scrape date added to each record's sources array.`);
