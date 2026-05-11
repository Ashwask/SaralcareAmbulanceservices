/**
 * localStorage personalisation. No PII leaves the device.
 *
 * Keys are prefixed `sc.amb.*` to namespace the site. All writes go through
 * these helpers so we have one place to add schema migrations later.
 */

const PREFIX = "sc.amb";

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function read<T>(key: string, fallback: T): T {
  return safe(() => {
    const raw = localStorage.getItem(`${PREFIX}.${key}`);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  }, fallback);
}

function write(key: string, value: unknown): void {
  safe(() => {
    localStorage.setItem(`${PREFIX}.${key}`, JSON.stringify(value));
  }, undefined);
}

function remove(key: string): void {
  safe(() => localStorage.removeItem(`${PREFIX}.${key}`), undefined);
}

// ----- saved providers -----
export type SavedProvider = {
  id: string;
  brand_name: string;
  phone: string;
  type?: string;
  saved_at: string; // ISO
};

export const savedProviders = {
  list(): SavedProvider[] {
    return read<SavedProvider[]>("saved", []);
  },
  has(id: string): boolean {
    return this.list().some((p) => p.id === id);
  },
  add(p: Omit<SavedProvider, "saved_at">): void {
    const cur = this.list();
    if (cur.some((x) => x.id === p.id)) return;
    cur.unshift({ ...p, saved_at: new Date().toISOString() });
    write("saved", cur.slice(0, 50));
  },
  remove(id: string): void {
    write("saved", this.list().filter((p) => p.id !== id));
  },
  clear(): void {
    remove("saved");
  },
};

// ----- home pincode -----
export const homePincode = {
  get(): string | null {
    return read<string | null>("home-pincode", null);
  },
  set(p: string): void {
    if (/^[1-9][0-9]{5}$/.test(p)) write("home-pincode", p);
  },
  clear(): void {
    remove("home-pincode");
  },
};

// ----- last successful geolocation -----
export type LastLoc = { lat: number; lng: number; at: string };

export const lastLocation = {
  get(): LastLoc | null {
    return read<LastLoc | null>("last-loc", null);
  },
  set(lat: number, lng: number): void {
    write("last-loc", { lat, lng, at: new Date().toISOString() });
  },
  clear(): void {
    remove("last-loc");
  },
};

// ----- first-visit notice -----
export const notice = {
  seen(): boolean {
    return read<boolean>("notice-seen", false);
  },
  mark(): void {
    write("notice-seen", true);
  },
};

// ----- pre-emergency plans -----
export type Plan = {
  id: string;
  label: string; // "Mum's plan", "Whitefield home"
  pincode?: string;
  lat?: number;
  lng?: number;
  provider_ids: string[];
  hospital_ids?: string[];
  created_at: string;
};

export const plans = {
  list(): Plan[] {
    return read<Plan[]>("plans", []);
  },
  get(id: string): Plan | undefined {
    return this.list().find((p) => p.id === id);
  },
  save(p: Plan): void {
    const cur = this.list().filter((x) => x.id !== p.id);
    cur.unshift(p);
    write("plans", cur.slice(0, 10));
  },
  remove(id: string): void {
    write("plans", this.list().filter((p) => p.id !== id));
  },
};

// ----- report history (local copies of what the user submitted) -----
export type LocalReport = {
  id: string;
  provider_id: string;
  provider_name: string;
  date_of_call: string;
  outcome: string;
  submitted_at: string;
  issue_url?: string;
};

export const reportHistory = {
  list(): LocalReport[] {
    return read<LocalReport[]>("reports", []);
  },
  add(r: LocalReport): void {
    const cur = this.list();
    cur.unshift(r);
    write("reports", cur.slice(0, 100));
  },
  count(): number {
    return this.list().length;
  },
};

// ----- bulk export / import (for QR share) -----
export type Snapshot = {
  v: 1;
  saved: SavedProvider[];
  plans: Plan[];
  homePincode?: string | null;
};

export const snapshot = {
  read(): Snapshot {
    return {
      v: 1,
      saved: savedProviders.list(),
      plans: plans.list(),
      homePincode: homePincode.get(),
    };
  },
  apply(snap: Snapshot, mode: "merge" | "replace" = "merge"): void {
    if (snap.v !== 1) throw new Error("unknown snapshot version");
    if (mode === "replace") {
      savedProviders.clear();
      remove("plans");
    }
    for (const p of snap.saved ?? []) savedProviders.add(p);
    for (const pl of snap.plans ?? []) plans.save(pl);
    if (snap.homePincode) homePincode.set(snap.homePincode);
  },
};
