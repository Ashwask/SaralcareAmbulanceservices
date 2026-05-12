# License FAQ — What Counts as Commercial?

The structured data in this repository is licensed under
**CC BY-NC-SA 4.0**. Non-commercial use is free with attribution.
Commercial use requires a separate bilateral license — email
`ashwinsk@saralcare.com`.

The line between "commercial" and "non-commercial" is sometimes
unclear. This FAQ explains how we read it, with worked examples. If
your case is not listed, write to us — we will answer in writing, and
the answer becomes part of our governance precedent.

---

## Worked examples

### ✅ Non-commercial (no license needed)

**A family member books an ambulance for an elderly parent.**
→ Pure personal use. Always free.

**A doctor or hospital staff looks up alternatives to suggest to a
patient or family.**
→ Patient care is non-commercial, even when conducted inside a
fee-charging facility. The data is being used to *inform a patient*,
not to monetise the data itself.

**A journalist quotes a fare or affiliation in an article, with
attribution.**
→ Journalism is non-commercial use of the *data*, even when published
on a for-profit media site. The article makes money; the use of our
data does not.

**A researcher analyses our dataset for an academic paper or thesis.**
→ Always free.

**An NGO compiles a printed leaflet of local ambulance options for a
slum community, with attribution.**
→ Charitable, non-commercial. Always free.

**Government EMS (108 / Arogya Kavacha) ingests the dataset to
cross-reference its own records.**
→ Free, with attribution.

**A civic-tech project forks the data to build a regional sub-map for
a Bangalore neighbourhood.**
→ Non-commercial fork. Must apply the same license (share-alike).

### ❌ Commercial (license required)

**RED.Health / Medulance / Dial4242 ingest our records to populate
their booking app.**
→ Commercial. Email `ashwinsk@saralcare.com`.

**A hospital chain embeds our records into a proprietary app sold to
its patients (or used to lock patients into hospital-affiliated
providers).**
→ Commercial. Email us.

**A health-insurance TPA routes claims via our affiliation graph.**
→ Commercial. Email us.

**A fleet-management SaaS uses our records as a discovery layer for
its operators.**
→ Commercial. Email us.

**A startup launches a "find an ambulance" app monetised by lead-gen,
fees, or ads, using our data as the base layer.**
→ Commercial. Email us.

### ⚠️ Grey areas — please ask

**A news website embeds our live map and runs display advertising on
the page.**
→ Grey. Our default reading: the ads are commercial use of the
surrounding page; if the data is the principal value driver, please
request a license. If the data is incidental to a larger article,
attribution is enough. Ask in advance.

**A doctor builds a free internal lookup tool for their clinic, but
the clinic itself charges for care.**
→ The internal tool is non-commercial (patient care). If the tool
becomes a product the clinic markets to other clinics, that becomes
commercial.

**A LinkedIn post embeds a static snapshot of fares in a discussion
about pricing dispersion.**
→ Non-commercial editorial use. Free with attribution.

**An open-source civic-tech project that itself takes donations or
runs Patreon.**
→ Non-commercial if the project is non-profit and the data is not the
revenue driver. Share-alike still applies.

---

## How "ShareAlike" works

If you adapt or build on our dataset (e.g., add your own records,
re-classify our records, geocode them differently), your derivative
work must be released under the **same license** —
CC BY-NC-SA 4.0 — and must be made publicly available under that
license.

You cannot:
- Combine our data with proprietary data and release the combination
  under a more restrictive license.
- Convert our data into a format that is technically open but legally
  closed (e.g., wrap it in DRM or behind a click-through that prevents
  redistribution).

You can:
- Combine our data with other CC BY-NC-SA 4.0 data and release the
  combined dataset under the same license.
- Build a tool that operates on our data without redistributing the
  data itself; the tool can be under any license (MIT, GPL, etc.) so
  long as the data flowing through it remains under our license.

---

## Attribution — exact wording

Required form:

```
Source: Saralcare ambulance directory project
(https://www.ambulance.saralcare.com), CC BY-NC-SA 4.0.
```

For derivative datasets, add: "Modified from the source. Changes:
[brief description]."

For commercial licensees, attribution wording is included in the
signed license — it must be on the licensee's product/site in an
agreed location.

---

## User-submitted reports — licensing

By submitting a report via the form on the site (or by email to `ashwinsk@saralcare.com`), the contributor:

1. **Attests** the report is their honest first-hand experience.
2. **Licenses** the report content (date, outcome, fare, vehicle type, notes) to the project under **CC BY-NC-SA 4.0**, the same licence as the rest of the dataset.
3. **Permits** us to publish, withhold, summarise, anonymise, or annotate the report at moderator discretion.
4. **Does not** transfer copyright; the contributor retains it and may reuse their own report elsewhere.

We never publish:
- The submitter's full name (only optional initials, up to 4 characters).
- The submitter's email address or phone.
- Identifying details of the patient or the medical condition.

We may publish:
- The provider name, date, time band, outcome, response time, vehicle type, fare paid, and any free-text notes that don't contain personal identifiers.
- Aggregated statistics (answer rate, median response time, fare dispersion) drawn from many reports.

If a contributor wants their submitted content removed, they can email `ashwinsk@saralcare.com` with subject `[CONTRIBUTOR REMOVAL]` and the date of submission. We honour the request within 48 hours; the report leaves the public dataset but remains in the moderation Git history.

## When in doubt

Email **`ashwinsk@saralcare.com`** with subject `[LICENSE QUESTION]`.
We answer in writing. Your question and our answer (with personal
details redacted, if any) may be added to this FAQ to help future
askers.
