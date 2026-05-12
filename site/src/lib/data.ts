/**
 * Site-side data loader. Reads providers + hospitals from data/*.yaml at
 * build time. Astro pages call this to get static data; output ships as
 * pre-rendered HTML and pre-built JSON.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

const ROOT = join(process.cwd(), "..");
const PROVIDERS_DIR = join(ROOT, "data", "providers");
const HOSPITALS_DIR = join(ROOT, "data", "hospitals");
const REPORTS_DIR = join(ROOT, "data", "reports");

export type Provider = {
  id: string;
  legal_name: string;
  brand_name: string;
  type: "govt-108" | "private-aggregator" | "private-standalone" | "hospital-owned" | "ngo" | "charitable";
  hq_address: string;
  hq_lat_lng: [number, number];
  contact: { phone_24h: string; website?: string | null };
  service_areas: any;
  hospital_affiliations: any[];
  fleet_count_claimed: number | null;
  fares: any;
  certifications: string[];
  sources: any[];
  call_logs: any[];
  status: "verified" | "unverified" | "stale" | "dead" | "disputed";
  last_verified_at: string | null;
  verified_by: string | null;
  notes?: string;
};

export type Hospital = {
  id: string;
  name: string;
  brand?: string | null;
  type?: string | null;
  city: string;
  state: string;
  address: string;
  pincode?: string;
  lat_lng: [number, number];
  er_phone: string;
  ambulance_phone?: string | null;
  owns_fleet: boolean;
  fleet_provider_id: string | null;
  dispatched_providers: any[];
  sources: any[];
  status: string;
  last_verified_at: string | null;
};

function loadAll<T>(dir: string): T[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => yaml.load(readFileSync(join(dir, f), "utf8"), { schema: yaml.JSON_SCHEMA }) as T);
}

export type Report = {
  id: string;
  provider_id: string;
  date_of_call: string;
  time_band?: string | null;
  pincode?: string | null;
  outcome: string;
  response_minutes?: number | null;
  vehicle_type_sent?: string | null;
  fare_paid?: number | null;
  hospital_id?: string | null;
  notes?: string | null;
  submitter_initials?: string | null;
  submitted_at: string;
  moderator_status: "pending" | "published" | "rejected";
  disputed?: boolean;
};

export function getProviders(): Provider[] {
  return loadAll<Provider>(PROVIDERS_DIR);
}

export function getHospitals(): Hospital[] {
  return loadAll<Hospital>(HOSPITALS_DIR);
}

export function getReports(): Report[] {
  return loadAll<Report>(REPORTS_DIR).filter((r) => r.moderator_status === "published");
}

export function aggregateReportsFor(providerId: string, reports: Report[]) {
  const own = reports.filter((r) => r.provider_id === providerId && !r.disputed);
  if (own.length === 0) return { count: 0 };
  const answered = own.filter((r) =>
    ["answered-dispatched", "answered-unavailable"].includes(r.outcome)
  );
  const dispatched = own.filter((r) => r.outcome === "answered-dispatched");
  const times = dispatched.map((r) => r.response_minutes).filter((n): n is number => typeof n === "number");
  times.sort((a, b) => a - b);
  const fares = own.map((r) => r.fare_paid).filter((n): n is number => typeof n === "number");
  fares.sort((a, b) => a - b);
  const median = (xs: number[]) => (xs.length ? xs[Math.floor(xs.length / 2)] : null);
  return {
    count: own.length,
    answer_rate: own.length ? Math.round((answered.length / own.length) * 100) : null,
    dispatch_rate: own.length ? Math.round((dispatched.length / own.length) * 100) : null,
    median_response_minutes: median(times),
    fare_min: fares[0] ?? null,
    fare_median: median(fares),
    fare_max: fares[fares.length - 1] ?? null,
  };
}

export function badge(r: { status?: string; last_verified_at?: string | null }):
  | "verified"
  | "stale"
  | "source-published"
  | "dead"
  | "unverified"
  | "disputed" {
  if (r.status === "disputed") return "disputed";
  if (r.status === "dead") return "dead";
  if (r.last_verified_at) {
    const age = Math.floor(
      (Date.now() - new Date(r.last_verified_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (age > 60) return "dead";
    if (age > 30) return "stale";
    return "verified";
  }
  if (r.status === "source-published") return "source-published";
  return "unverified";
}

export function badgeColor(b: ReturnType<typeof badge>): string {
  return {
    verified: "#16a34a",
    stale: "#eab308",
    "source-published": "#1d4ed8",
    dead: "#525252",
    unverified: "#a3a3a3",
    disputed: "#dc2626",
  }[b];
}

export function badgeLabel(b: ReturnType<typeof badge>): string {
  return {
    verified: "Verified by phone",
    stale: "Verified — re-check soon",
    "source-published": "Number published by provider",
    dead: "Unreachable",
    unverified: "Not yet verified",
    disputed: "Disputed by provider",
  }[b];
}

export function freshnessNote(r: { status?: string; last_verified_at?: string | null }): string {
  if (!r.last_verified_at) {
    if (r.status === "source-published") {
      return "Number published by the provider on their own website / hospital page / government listing. We have not independently called to confirm. Should work — but verify before depending on it.";
    }
    return "Compiled from a third-party source (search listing, scrape). Not yet confirmed by phone. Please confirm before relying on this record.";
  }
  const age = Math.floor(
    (Date.now() - new Date(r.last_verified_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  return `Last verified ${r.last_verified_at} (${age} day${age === 1 ? "" : "s"} ago).`;
}
