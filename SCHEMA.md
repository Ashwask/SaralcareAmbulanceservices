# Schema Reference

The Saralcare Ambulance Directory uses three principal record types:

- **Provider** — an ambulance service operator. One YAML per provider in
  `data/providers/`.
- **Hospital** — a hospital that may have an affiliated provider or
  receive transfers. One YAML per hospital in `data/hospitals/`.
- **Vehicle** — an optional sub-record of a Provider, used when
  individual vehicle data is known. v1 typically uses the rolled-up
  `fleet_count_*` fields on the Provider instead.

All schemas are formally defined in `schema/*.schema.json` (JSON Schema
2020-12) and enforced by `scripts/validate.ts` in CI. This document is
the human-readable companion.

**Schema version:** `1.0.0` (semver). Breaking changes bump the major.
**Data license tag:** every record carries `license_tag:
CC-BY-NC-SA-4.0`.

---

## Provider

Required fields:

| Field | Type | Notes |
|---|---|---|
| `id` | slug | lowercase, hyphenated, unique |
| `legal_name` | string | registered name |
| `brand_name` | string | as marketed |
| `type` | enum | `govt-108`, `private-aggregator`, `private-standalone`, `hospital-owned`, `ngo`, `charitable` |
| `hq_address` | string | postal address |
| `hq_lat_lng` | `[lat, lng]` | decimal degrees |
| `contact.phone_24h` | string | `+91 XXXXX XXXXX` format |
| `service_areas` | object | one of: `pincode-list`, `polygon`, `radius` |
| `sources` | array | ≥1 provenance entry required |
| `status` | enum | `verified`, `unverified`, `stale`, `dead`, `disputed` |
| `license_tag` | const | `CC-BY-NC-SA-4.0` |

Optional but encouraged:

- `hospital_affiliations[]` — every edge requires a `source`. Behaviour-described, not motive.
- `fares` — `base`, `per_km`, `waiting`, `night_premium`, plus `source` and `observed_date`.
- `fleet_count_claimed` / `fleet_count_verified` — operator-claimed vs. independently verified.
- `vehicles[]` — when granular vehicle data is known.
- `call_logs[]` — every verification call with date, outcome, optional initials.

### Status semantics

| Status | Meaning |
|---|---|
| `verified` | Phone-confirmed within the last 30 days. Green badge. |
| `stale` | Last verified 30–60 days ago. Amber badge. Re-verify before relying. |
| `dead` | Unreachable across multiple attempts. Hidden from map; kept in repo for provenance. |
| `unverified` | Ingested from a source (Google Places, JustDial, OSM) but never called. Grey badge. Visible with prominent caveat. |
| `disputed` | Provider has contested the record. Banner shows their statement; underlying data flagged. |

### Service area shapes

`service_areas` is `oneOf`:

```yaml
service_areas:
  type: pincode-list
  pincodes: ["560001", "560002"]
```

```yaml
service_areas:
  type: radius
  centre: [12.9716, 77.5946]
  radius_km: 15
```

```yaml
service_areas:
  type: polygon
  polygon:
    - [12.95, 77.55]
    - [13.00, 77.55]
    - [13.00, 77.65]
    - [12.95, 77.65]
```

---

## Hospital

Required fields:

| Field | Type | Notes |
|---|---|---|
| `id` | slug | unique |
| `name` | string | |
| `city`, `state`, `pincode` | strings | state defaults to Karnataka in v1 |
| `address`, `lat_lng` | string, `[lat, lng]` | |
| `er_phone` | string | published 24h ER number |
| `sources` | array | ≥1 |
| `license_tag` | const | `CC-BY-NC-SA-4.0` |

Optional but important:

- `owns_fleet` — boolean. If true, a paired Provider record (`type:
  hospital-owned`) should exist; `fleet_provider_id` points to it.
- `ambulance_phone` — separate from `er_phone` if the hospital
  publishes one.
- `dispatched_providers[]` — the affiliation edges *from the hospital's
  side*. Every edge has a `source`. This is the unique asset of this
  project; treat with care.

---

## Vehicle

Used as nested array under Provider (`vehicles[]`). Required: `type`.
All other fields optional but encouraged when known.

| Field | Type | Notes |
|---|---|---|
| `type` | enum | `BLS`, `ALS`, `MICU`, `PTA`, `Neonatal`, `Cardiac`, `Mortuary` |
| `equipment[]` | enum array | `oxygen`, `defibrillator`, `ventilator`, … |
| `base_location_lat_lng` | `[lat, lng]` | if different from provider HQ |
| `staffed_24h`, `paramedic_onboard`, `doctor_onboard` | bools | |
| `registration_number` | string | **not published** in v1 (privacy default), even when known |

---

## Affiliation graph

Affiliations live in two places (intentionally redundant for graph queries):

1. Under each Provider as `hospital_affiliations[]`.
2. Under each Hospital as `dispatched_providers[]`.

Both must agree. The validator checks consistency: if Hospital H lists
Provider P, Provider P should list Hospital H.

The aggregate edge list also lives in `data/affiliations/edges.csv`
as a flat bipartite for analytical use:

```
provider_id,hospital_id,exclusivity,source,observed_date,disputed
red-health-bangalore,manipal-old-airport-road,primary,https://...,2026-05-11,false
```

---

## Versioning

Schema versions follow semver:

- **Major** — breaking change (field removed, type changed, enum restricted).
- **Minor** — additive change (new optional field, new enum value).
- **Patch** — documentation only.

Old data is migrated automatically by `scripts/migrate-vX-to-vY.ts`
when schemas bump major. Migrations preserve all source provenance.

---

## Why these fields

Every field exists because something useful in the public site depends
on it. We are aggressive about deleting fields that don't pay rent:

- `phone_24h` → tap-to-call.
- `service_areas` → "which providers serve my pincode?" query.
- `type` (BLS/ALS/MICU) → "which providers have an ALS today?" filter.
- `hospital_affiliations` → the lock-in/transparency analysis.
- `fares` → the price-dispersion table.
- `last_verified_at` → the freshness badge.
- `sources` → reader can audit any claim.

Anything that doesn't power a public view is excluded from v1.
