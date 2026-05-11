# Architecture Decision Records

This folder holds the project's [ADRs](https://adr.github.io/) — short,
numbered records of every significant decision the project has made, with
the reasoning preserved in Git history.

## Why ADRs

Future maintainers, contributors, and observers should be able to ask "why
did we choose X over Y?" without re-litigating the original discussion.
Each ADR captures the **context** at the time of the decision, the
**decision itself**, and the **consequences** we expected.

ADRs are immutable once merged. If a later decision overturns an earlier
one, write a new ADR that supersedes it (don't edit the old one).

## Index

| # | Title | Status | Date |
|---|---|---|---|
| [0001](0001-license-cc-by-nc-sa.md) | Use CC BY-NC-SA 4.0 for data, MIT for code, CC BY-SA 4.0 for content | Accepted | 2026-05-10 |
| [0002](0002-pseudonymous-publication.md) | Publish pseudonymously under the Saralcare umbrella | Accepted | 2026-05-11 |
| [0003](0003-no-real-time-gps.md) | Do not pursue real-time GPS / vehicle tracking in v1 | Accepted | 2026-05-11 |
| [0004](0004-pan-india-scope.md) | Scope is pan-India from launch, not Bangalore-only | Accepted | 2026-05-11 |

## Template

```markdown
# ADR <NNNN>: <Title>

- **Status:** Proposed / Accepted / Superseded by ADR-XXXX
- **Date:** YYYY-MM-DD
- **Deciders:** maintainer (+ council members in v2+)

## Context

What pressure / question / constraint led us to make a decision?

## Decision

What we decided. One paragraph.

## Consequences

What follows from this — both the good and the costs.

## Alternatives considered

Bullet list of the options we didn't pick, and why not.
```
