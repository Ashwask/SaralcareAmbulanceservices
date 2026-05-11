# Contributing to the Saralcare Ambulance Directory

Thank you for considering a contribution. This project lives or dies
on **freshness** — phone numbers that work, fares that are current,
affiliations that reflect reality. Every verified record is a small
public good.

This document explains:

- How records are added, corrected, and re-verified.
- The verification protocol (the phone-call script).
- How to submit a pull request.
- What we will and will not accept.

---

## Three ways to contribute

1. **Re-verify a stale record.** Pick a record with a stale (amber)
   badge from the freshness dashboard. Call the number, run the
   script, update the YAML, open a PR.
2. **Add a missing provider.** Find a provider not yet in the
   directory. Call to verify. Create a new YAML file. Open a PR.
3. **Report an inaccuracy.** No call required — just open an issue or
   email `ashwinsk@saralcare.com`. We re-verify ourselves.

---

## The verification phone-call script

Use this exact script. Consistency matters more than charm.

> "Hello, I'm calling to verify your ambulance service listing for a
> public directory called the Saralcare Ambulance Directory. May I
> ask a few short questions? It will take about two minutes."

If they agree, ask in this order:

1. **Service name and location**
   "Is this [Provider Name]? Where is your ambulance based?"

2. **Operating hours**
   "Do you operate 24 hours, or specific hours?"

3. **Vehicle types**
   "What kinds of ambulances do you operate — basic (BLS), advanced
   life support (ALS), MICU, neonatal, patient transport?"

4. **Equipment**
   "Do your vehicles have oxygen, defibrillator, cardiac monitor,
   ventilator?"

5. **Paramedic / staffing**
   "Is a trained paramedic always on board?"

6. **Service area**
   "Which areas do you cover? Within Bangalore only, or outside?"

7. **Hospital affiliations**
   "Do you have any contracts or regular tie-ups with specific
   hospitals?"

8. **Fares**
   "What's the base fare? Per-kilometre charge? Night or waiting
   premium?"

9. **Best number to publish**
   "Is this number the right one for someone needing an ambulance
   urgently, or should we list a different number?"

End with: "Thank you. We're listing you for free under a public-good
licence at ambulance.saralcare.com. If anything is incorrect once
listed, please email us at `ashwinsk@saralcare.com` and we'll fix it
within 48 hours."

If they decline: thank them and end the call. Record `status:
declined-to-confirm` with the date in the YAML.

---

## What to log

For every call (whether answered or not):

```yaml
call_logs:
  - date: 2026-05-11
    caller_initials: AS    # not full name, for pseudonymous repo history
    outcome: answered | no-answer | wrong-number | declined-to-confirm
    notes: |
      Confirmed BLS + 1 ALS. Affiliated with Manipal Hospital.
      Fare ₹1,800 base, ₹40/km. Will publish primary number 9876543210.
```

Personal-information rules:
- **Do not** record the name of the person who answered, unless they
  are the official spokesperson and consent.
- **Do not** record personal phone numbers other than the published
  business number.
- **Do not** record any patient-related information you may overhear.

---

## YAML record format

See `schema/provider.schema.json` for the formal schema. A minimal
new record looks like this:

```yaml
id: example-bangalore           # stable slug
legal_name: "Example Ambulance Services Pvt Ltd"
brand_name: "Example Ambulance"
type: private-standalone        # or govt-108, private-aggregator, hospital-owned, ngo, charitable
hq_address: "12, MG Road, Bengaluru 560001"
hq_lat_lng: [12.9716, 77.5946]
contact:
  phone_24h: "+91 98765 43210"
  alt_phone: null
  whatsapp: null
  email: null
  website: "https://example.com"
service_areas:
  type: pincode-list
  pincodes: ["560001", "560002", "560025"]
hospital_affiliations: []       # to fill in if confirmed
fleet_count_claimed: 5
fleet_count_verified: null      # null until physically verified
fares:
  base: 1800
  per_km: 40
  waiting: 100
  night_premium: 200
  currency: INR
  source: "verification call 2026-05-11"
  observed_date: 2026-05-11
certifications: []
sources:
  - type: website
    url: "https://example.com/services"
    accessed: 2026-05-11
  - type: phone-verification
    date: 2026-05-11
    caller_initials: AS
status: verified                # or unverified, stale, dead
last_verified_at: 2026-05-11
verified_by: AS
license_tag: CC-BY-NC-SA-4.0
```

---

## Affiliation edges — extra care required

Hospital affiliation is the most useful and the most legally exposed
field in this dataset. Rules:

- **Only publish edges that are factually verifiable.** A printed
  affiliation on the hospital's website, a public statement, an
  RTI response, or a verbatim verification call from both the
  hospital and the provider.
- **Cite the source on the edge.** Every affiliation in
  `data/affiliations/edges.csv` carries a source URL or call log
  reference.
- **Describe behaviour, never motive.** Acceptable: "Hospital X's
  published ER number routes to Provider Y." Unacceptable: "Hospital
  X has an exclusive kickback arrangement with Provider Y."
- **If contested, annotate not delete.** If a hospital disputes an
  edge, mark the edge `disputed` with a link to their statement. Do
  not silently remove a sourced edge.

If you are unsure whether an edge is safe to publish, **don't.** Open
an issue and ask the maintainers.

---

## Pull request process

1. **Fork** the repository.
2. **Branch** off `main`: `git checkout -b add-<provider-slug>` or
   `verify-<provider-slug>`.
3. **Make changes** to the YAML file(s).
4. **Run validators locally** (optional but recommended):
   ```
   pnpm install
   pnpm validate
   ```
5. **Open a PR** with the title:
   `[VERIFY] <provider-name>` or `[NEW] <provider-name>` or `[FIX] <field>`.
6. The PR template will ask for the date of call, caller initials,
   and outcome. Fill in all fields.
7. CI runs schema validation and dedup checks. PRs that fail CI must
   be fixed before merge.
8. A maintainer reviews and merges. Affiliation edits may take longer
   (multi-reviewer required from v2 onward — see `GOVERNANCE.md`).

---

## What we accept

- Records added or re-verified using the script above.
- Corrections supported by a public source or a logged call.
- Provider-submitted corrections (we'll re-verify before merging).
- Translations of prose documents into Indian languages.
- Code contributions to the site, validators, and ingest scripts.

## What we don't accept

- Records added from scraped sources without any verification call.
  (Scraped stubs go into the `unverified` bucket via the ingest
  scripts, not via human PRs.)
- Affiliation edges without a sourced citation.
- Marketing copy or paid placement — we do not list providers
  preferentially.
- Edits that remove a sourced affiliation without providing
  contrary evidence.

---

## Code of conduct

Be factual. Be specific. Cite sources. Assume good faith from
counterparties; demand it from contributors. Disagreements about a
record are resolved by re-verifying, not by debate.

If a contributor's behaviour interferes with the project's quality or
inclusion, maintainers may revert PRs, restrict contributions, or in
extreme cases block GitHub access. Decisions are documented publicly.

---

## Dead-number reports

The fastest way a user can flag that a number doesn't work is the **"✗ Number didn't work"** link below every phone button.

What happens when a user taps it:

1. **Immediately:** the record is marked as `disputed` in the user's local storage so they see the badge change to red and the call button greyed out. They are pointed at 108.
2. **In the background:** a `[DEAD NUMBER]` GitHub issue is opened by the Cloudflare Worker, labelled `dead-number` and `needs-reverify`.
3. **Moderator action within 48 hours:**
   - Call the reported number to confirm it does (or doesn't) work.
   - If confirmed dead: change `status: dead` on the record, commit, close the issue.
   - If still works: add a `call_logs` entry noting "user reported as dead on X, confirmed working on Y", close the issue with that note. Surge of false reports on a single provider may indicate coordinated abuse — flag for further review.
   - If number changed: update the YAML, commit, close.

**Aggregation note.** If multiple users report the same number dead within a short window (≥3 in 7 days), the maintainer takes that as a stronger signal and re-verifies on priority.

## Report moderation (user-submitted call experiences)

Reports arrive as GitHub issues with the `report` label (posted by the Cloudflare Worker on form submission).

Moderator workflow:

1. **Triage** within 48 hours. Read the report; check the provider exists and the date/outcome combination is plausible.
2. **Validate** against schema (`schema/report.schema.json`). Open a draft commit converting the issue body into a YAML file at `data/reports/YYYY-MM-DD-<rand>.yaml` with `moderator_status: pending`.
3. **Investigate** if anything is unusual — a fare 3x the median, a hospital handover that doesn't match the provider's known affiliations, or a string of negative reports on a single provider within a short window.
4. **Decide**:
   - **Publish:** change `moderator_status` to `published`, commit, close the issue with the commit hash.
   - **Reject:** close the issue with a brief reason (`implausible-fare`, `bad-faith-coordination`, `outside-bangalore`, etc.). Do not merge.
   - **Hold for response:** if a provider may want to dispute, post the report's content (anonymised) and tag the issue `awaiting-provider-input`; wait 7 days before publishing.
5. **Affiliation reports** that contradict an existing affiliation edge require extra care — treat like a dispute (see TAKEDOWN.md).

A report is *not* a dispute and a dispute is *not* a report. Disputes go through `[DISPUTE]` email; reports go through the form. Keep them separate.

## Provider claim moderation

Claims arrive as GitHub issues with the `provider-claim` label.

Workflow:

1. **Call the claimant's direct number** within 48 hours using the verification script (CONTRIBUTING § verification phone-call script). Confirm role + identity.
2. **Cross-check** the claimed corrections against the public information already on file. If the correction makes the record more accurate, draft a PR.
3. **Apply** with `verified_by` set to the maintainer's initials and `last_verified_at` to today's date.
4. **Notify** the claimant by reply that the correction is live, linking to the commit.

If the claim cannot be verified (no answer, claimant cannot confirm role), close the issue with a note and ask them to re-submit.

## Reaching the maintainers

- GitHub issues (preferred for technical and data matters).
- `ashwinsk@saralcare.com` for licensing, takedown, legal, and any
  matter that should not be public.

Thank you for contributing. The freshness of this dataset is its
entire moat — and that moat is built one phone call at a time.
