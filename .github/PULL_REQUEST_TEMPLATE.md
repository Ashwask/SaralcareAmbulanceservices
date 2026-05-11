<!--
Thank you for contributing to the Saralcare Ambulance Directory.
Please tick at least one purpose and fill in the relevant section.
-->

## Purpose

- [ ] **[VERIFY]** I called a provider and am updating their record
- [ ] **[NEW]** Adding a new provider, hospital, or affiliation
- [ ] **[FIX]** Correcting an error in an existing record
- [ ] **[CODE]** Site code, script, schema, or CI change
- [ ] **[DOC]** Documentation only
- [ ] **[GOV]** Governance / process change (see GOVERNANCE.md)

## What changed

<!-- One or two sentences. Avoid pasting screenshots of the diff — GitHub shows it. -->

## For data changes

- **Record ID(s):**
- **Field(s) changed:**
- **Source / evidence:** _URL or call log reference (required for any non-empty change)_
- **Date of call (if verification PR):** YYYY-MM-DD
- **Caller initials (if verification PR):** _up to 4 characters_

## Checklist

- [ ] `npm run validate` passes locally
- [ ] Every changed field has a `sources` entry (URL or call log)
- [ ] No assertion of motive on affiliation edges ("kickback", "exclusive contract") without a documented public source
- [ ] No personal data of patients, callers, or providers' staff included
- [ ] I license this contribution under CC BY-NC-SA 4.0 (data) / MIT (code) / CC BY-SA 4.0 (content) as appropriate
- [ ] I'm not closing or refuting a takedown / dispute via this PR (those follow their own process)

## Notes for the reviewer
