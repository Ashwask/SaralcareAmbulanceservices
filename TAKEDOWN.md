# Corrections and Takedown Process

We take accuracy seriously. If you find an error in our data, or you
are a provider who wishes to correct or remove your listing, this is
the process.

## Response SLA

- **Acknowledgement:** within 48 hours of receipt.
- **Substantive response:** within 7 working days where investigation
  is required (e.g., re-verifying by phone, cross-checking a hospital
  affiliation).
- **Urgent factual fixes** (a wrong phone number causing live harm)
  are handled within 24 hours.

## Channels

- **Preferred (public):** open a GitHub issue at the project repo. Use
  the "Correction" or "Takedown" issue template.
- **Email:** `ashwinsk@saralcare.com`
  - Subject `[CORRECTION]` for record fixes.
  - Subject `[TAKEDOWN]` for full delisting requests.
  - Subject `[DISPUTE]` for contested affiliation edges or fares.
- We do not accept correction requests by phone, social media DMs,
  or word-of-mouth. We need a written record.

## What we need from you

For a **correction**:
1. The provider ID or URL of the record (e.g., `/providers/red-health-bangalore`).
2. The specific field that is wrong (phone, address, vehicle type,
   affiliation, fare, etc.).
3. The correct information.
4. A source we can cite (a website URL, a screenshot, a leaflet, a
   phone-call log, or your written authorisation as the provider).

For a **takedown** (full delisting):
1. The provider ID or URL.
2. A brief statement that you are the provider, authorised
   representative, or affected party.
3. The reason: ceased operations, changed entity, privacy concern,
   factual error you do not wish to correct, etc.

For a **dispute** (contested affiliation edge or fare):
1. The provider and hospital IDs involved.
2. Your position: "this affiliation does not exist," "this affiliation
   ended on [date]," "fare is incorrect," etc.
3. Any evidence (a public statement, a contract, a press release).

## How we handle it

1. **Acknowledge** within 48 hours with a ticket reference.
2. **Investigate:**
   - For corrections: we call the listed number, check public sources,
     and confirm the correct information.
   - For takedowns: we verify the requester's authority and process
     the delisting.
   - For disputes: we re-examine the source we cited; if our source is
     a public statement (a website, a press release, a leaflet), we
     update the record to reflect the contested status, link to your
     statement, and remove the contested edge.
3. **Resolve:**
   - **Confirmed correction:** record updated. Diff is visible in the
     public Git history (the value changes; if you've requested
     anonymity, your name is not in the commit log).
   - **Confirmed takedown:** record moved from `data/providers/` to
     `data/_archived/` with reason logged. The record no longer appears
     on the map or API.
   - **Confirmed dispute:** affiliation edge removed or annotated; the
     correction is logged in `corrections/` with date and outcome.
4. **Notify** the requester of the outcome.

## What is logged publicly

We maintain a public correction log at `corrections/` (in the GitHub
repo) so that observers can verify our process is real, not
aspirational.

Each entry contains:
- Date of request.
- Type (CORRECTION / TAKEDOWN / DISPUTE).
- Provider ID affected.
- Brief description of the issue (no personal details).
- Outcome (corrected / archived / no action with reason).
- Date of resolution.

We do **not** publish:
- The requester's identity, unless they explicitly authorise.
- Email contents.
- Any personally identifying information from the requester or any
  third party.

## What we will not do

- We will not remove a factually accurate record at the request of a
  party who simply does not like being listed. The dataset includes
  ambulance providers operating in India; listing operators publicly
  is the point of the project.
- We will not remove an affiliation edge that is supported by a
  public source. We will, however, update or annotate it if you
  provide a corrected source.
- We will not enter into adversarial communications. Disputes that
  cannot be resolved through documentation are noted as such on the
  record and left for readers to evaluate.

## Legal escalation

If you believe a record is defamatory, please follow the process above
first. We respond promptly and in good faith. We comply with valid
legal process under Indian law.

For formal legal notice: send to `ashwinsk@saralcare.com` with subject
`[LEGAL NOTICE]`. Include the legal basis, the specific record at issue,
and the relief sought. We will respond through the appropriate channel
within the time stipulated by law.

---

## Tone of communications

We aim to be: prompt, factual, respectful, willing to be wrong, and
unwilling to abandon accurate information under pressure. We are not
here to fight providers; we are here to make the directory more
accurate. Almost every correction request can be resolved cleanly. We
will treat yours that way.
