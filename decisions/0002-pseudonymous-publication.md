# ADR 0002: Publish pseudonymously under the Saralcare umbrella

- **Status:** Accepted
- **Date:** 2026-05-11
- **Deciders:** founding maintainer

## Context

The directory publishes a structured graph of provider × hospital
affiliations, fares, and call experiences. Some of that information is
**contestable**, even when sourced from public statements:

- Hospitals may dispute that their ER routes to a particular provider.
- Providers may dispute reported response times.
- Affiliation edges, even when sourced, can attract legal threats —
  defamation suits in India have a low filing threshold and high defence
  cost.

A named individual maintainer is the easiest target. A pseudonymous
project under a known umbrella is harder to harass while remaining
contactable for legitimate process.

## Decision

The project is published as **Saralcare Ambulances** with no individual
byline on:

- The website (`ambulance.saralcare.com`).
- The LinkedIn launch post.
- Press references.
- The GitHub README's prominent surface.

The domain registrant of `saralcare.com` is the de-facto rights-holder and
remains contactable through `ashwinsk@saralcare.com`. Pseudonymity is a
**posture**, not a legal shield — a court order will pierce WHOIS privacy
and we accept that.

What is published anonymously:
- The contributor identity of merged PRs (Git author can be a project email
  rather than a personal name).
- The site footer ("Saralcare ambulance directory project").
- All public correspondence.

What remains identifiable behind the curtain:
- Domain registrant.
- The maintainer's email address.
- The legal entity (when one is registered — see ADR-future).

## Consequences

**Good:**
- A motivated bad-faith actor cannot trivially LinkedIn-search the
  founder and apply social pressure.
- The "Saralcare brand publishes a directory" framing scales beyond a
  single individual when volunteers are recruited.
- Contributor attribution is opt-in (`CONTRIBUTORS.md`), respecting that
  many contributors prefer not to be publicly associated with a
  contested project.

**Costs:**
- Open-source projects with a named maintainer tend to attract more
  contributors initially — anonymity reads as evasive to some.
- Pseudonymity reads as "anonymous random site" to journalists doing due
  diligence. We mitigate by naming an **independent methodology reviewer**
  in the launch post (`launch/linkedin-post.md` checklist).
- If the project ever wants to receive grants, the funder will need a
  natural person or registered entity to contract with. At that point the
  pseudonymity layer becomes part of the entity (Section 8) governance,
  not a personal shield.
- WHOIS pierces in minutes for any party with legal standing. This is a
  brand-framing posture, not a legal one.

## Operational rules

To make pseudonymity honest rather than performative:

- Site, README front-page, and LinkedIn copy use plural pronouns ("we",
  "the project") and never name the founder.
- Email replies are signed "Saralcare ambulance directory project" — no
  individual name.
- Press inquiries get the same treatment.
- Git author of merged PRs is configured to a project email (the
  maintainer's commits ride under `maintainer@ambulance.saralcare.com`,
  not personal Gmail).
- If/when a Section 8 entity is registered, the entity becomes the named
  publisher; the founder may then *choose* to attach name as a board
  member. That is a deliberate decision, not a default.

## Alternatives considered

- **Named personal byline.** Standard open-source practice for solo
  founders. Rejected because the legal exposure profile is unfavourable
  for a directory that publishes contestable claims.
- **Section 8 not-for-profit company on day one.** Recommended once the
  project has organic traction or the first donation arrives. Pre-baking
  the entity adds operational overhead (board, AGM, filings) without
  current need.
- **LLP under a holding entity.** A middle path. Considered, deferred —
  same overhead concern.

## When this might be revisited

- The first material grant offer arrives (Wikimedia, civic-tech funder,
  individual donor of substance). At that point: register Section 8,
  attach name as board member.
- The dataset reaches scale (e.g., 1000+ records, 10k weekly users) where
  a single-maintainer governance model is no longer defensible. Council
  members are likely named individuals.
- A material legal action arrives. We accept the founder identity will be
  pierced; the question is whether to acknowledge proactively or react.
