# Governance

This document describes who decides what in the Saralcare Ambulance
Directory project, and how those decisions are made.

## Current model — v1 (Bangalore launch)

**Benevolent dictator.** A single maintainer (the rights-holder of
`ambulance.saralcare.com`) reviews and merges all pull requests,
approves schema changes, handles correspondence, and decides on
takedowns. All decisions are recorded in the public Git history.

**Why this is acceptable for v1:**
- The dataset is small (target ~150–300 Bangalore records).
- The maintainer is doing the verification calls personally.
- Schema decisions are still in flux; a single decision-maker is
  faster than a committee.
- The community is too small to elect a representative council.

**The risks (acknowledged):**
- **Bus factor of one.** If the maintainer goes offline, the dataset
  goes stale within 30 days. Mitigation: the entire dataset is in a
  public Git repo; anyone can fork and continue.
- **Single point of bias.** The maintainer's judgement shapes every
  affiliation edge. Mitigation: every edge is sourced; any reader
  can audit; corrections process is documented.

## v2 — editorial council (triggered by traction)

When any of the following triggers occur, the project transitions to
a small editorial council:

- The dataset exceeds 500 records.
- More than 5 active contributors with merged PRs.
- The first commercial license is signed.
- A donation or grant of any size is received.
- Whichever comes first.

**Council composition:**
- 3 reviewers minimum (no quorum below 3).
- At least 1 reviewer with healthcare-operations background.
- At least 1 reviewer with civic-tech / open-data background.
- At least 1 reviewer with editorial / journalism background.
- The rights-holder may be a member but does not chair by default.

**Council scope:**
- All **affiliation graph edits** (provider × hospital edges)
  require 2 of 3 reviewer approvals before merge.
- **Schema changes** (breaking) require unanimous approval.
- **Takedown decisions** (delisting a provider against their wishes
  or, conversely, refusing a delisting request) require 2 of 3
  approvals and are logged publicly.
- **Routine PRs** (re-verifying a record, adding a new provider with
  a sourced call) remain single-reviewer.

**How reviewers are chosen:**
- The rights-holder invites the first council based on demonstrated
  contribution or recognised standing.
- Subsequent additions are proposed by the council and ratified by
  community comment (14-day window for objections).
- Reviewers serve 12-month renewable terms.

## v3 — formalisation (if and when)

If the project grows enough to warrant it (10,000+ records, multiple
city captains, regular donations or licenses), the rights-holder will
file a Section 8 not-for-profit company under Indian law and transfer
the dataset, domain, and maintainer rights to it. At that point the
council becomes a board of directors with formal fiduciary duties.

This transition is deliberately **deferred until needed**. Filing a
Section 8 company is a one-way decision that introduces operating
overhead. We will not pre-bake it; we will file it when the project's
operations actually require it.

## Decision log

All non-trivial decisions are recorded in `decisions/` in the
repository, with date, decider(s), context, and outcome.

Examples of decisions that get logged:
- "On 2026-05-11 we adopted CC BY-NC-SA 4.0 for data after considering
  ODbL and CC0; reason: explicit prohibition on commercial use was
  preferred to share-alike."
- "On 2026-06-15 we delisted Provider X at their request following
  cessation of operations; archived to `data/_archived/`."

The decision log makes the project's history auditable and gives
future maintainers context for past choices.

## Changes to this document

Changes to `GOVERNANCE.md` require:
- During v1: a single PR by the rights-holder, with a 7-day comment
  window before merge.
- From v2 onward: unanimous council approval plus a 14-day public
  comment window.

This means governance changes are *visible and slow* by design. That
is the entire point — we want the rules of the road to be hard to
change quietly.

## Contact

Governance discussions happen in GitHub issues, tagged `governance`.
Private governance matters (e.g., conflict-of-interest disclosures,
disputes between reviewers) go to `ashwinsk@saralcare.com`.
