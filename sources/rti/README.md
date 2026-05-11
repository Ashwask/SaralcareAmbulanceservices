# RTI applications and responses

This folder holds the formal Right to Information (RTI Act 2005) applications
that the Saralcare ambulance directory project files with government bodies,
and the responses received.

## Filing strategy

We file **staged** RTIs — narrow, specific requests two weeks apart — rather
than one comprehensive request. Reasons:

- Each request stays inside the 30-day statutory window without risking
  rejection on "voluminous" grounds (Section 7(9)).
- Builds a working relationship with the PIO over multiple interactions.
- Gives us natural publish moments (one credible reveal per fortnight).
- Easier to escalate via first appeal if any single request is unanswered.

## Current applications

| File | Subject | Status | Filed | Acknowledged | Responded |
|---|---|---|---|---|---|
| `rti-1-station-list.md` | List of all 108 stations in Karnataka, with contractor mapping | Drafted, not yet filed | — | — | — |
| `rti-2-fleet-count.md` | Fleet count + vehicle type + staffing per station | Drafted, not yet filed | — | — | — |
| `rti-3-response-times.md` | Call volume + response time + complaints, last 12 months | Drafted, not yet filed | — | — | — |

When filing:

1. Print the relevant `.md` file.
2. Fill in applicant name, address, email, phone.
3. Attach ₹10 IPO / DD / cash receipt.
4. File at NHM Karnataka office or send by registered post.
5. Update the table above with file date and acknowledgement number.
6. Save the signed application + acknowledgement receipt as PDF under
   `sources/rti/filed/rti-N-application.pdf` and `sources/rti/filed/rti-N-ack.pdf`.

## Response handling

When a response arrives:

1. Save the original response (scanned PDF) under
   `sources/rti/responses/rti-N-response-YYYY-MM-DD.pdf`.
2. Extract structured data from the response into the relevant YAML records
   under `data/`. Cite the response file in the `sources` array:
   ```yaml
   sources:
     - type: rti-response
       url: sources/rti/responses/rti-1-response-2026-06-15.pdf
       accessed: 2026-06-15
       notes: "NHM Karnataka response to application dated 2026-05-15."
   ```
3. Open a PR titled `[RTI-N] integrate response from <agency>` describing
   what changed in the data as a result.
4. Consider a short public update (LinkedIn post, README pin) noting the
   transparency win.

## First appeal procedure

If no response within 30 days, or the response is unsatisfactory:

1. Draft a first appeal under Section 19(1) to the First Appellate Authority
   (typically the head of the department — for NHM Karnataka, the Mission
   Director).
2. Attach a copy of the original application + acknowledgement + any partial
   response received.
3. File within 30 days of the original deadline.

If first appeal also fails: second appeal to the Karnataka Information
Commission (KIC).

## What we do *not* do

- We do not file RTIs to private companies (the Act does not apply).
- We do not file RTIs to harass; each request must serve the public-interest
  research purpose of the directory.
- We do not threaten litigation in RTI applications; we use the appeal process.
