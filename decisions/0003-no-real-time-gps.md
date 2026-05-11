# ADR 0003: Do not pursue real-time GPS / vehicle tracking in v1

- **Status:** Accepted
- **Date:** 2026-05-11
- **Deciders:** founding maintainer

## Context

A frequent feature request is "show me which ambulance is closest to me
*right now*". This appears trivial — the BloodBridge donor map does
something similar for blood donors — but the structural shape of the
ambulance market is the opposite of the blood-donor market.

**Blood donors *want* to be findable.** They self-register voluntarily,
gain no commercial advantage from hiding their availability, and benefit
from being matched to nearby recipients.

**Ambulance providers do not want to be findable in real time.** Their
availability data is competitive information. Their position relative to
demand is the moat that justifies their pricing. RED.Health raised $20M
USD partly because they keep their fleet visibility proprietary.

A "real-time ambulance map" therefore requires one of:

1. **Cooperation from providers** — they push their GPS / availability to
   our endpoint. Won't happen for free; would require commercial deals
   that contradict the public-good positioning.
2. **Independent vehicle tracking** — we deploy hardware in their fleets.
   Massive operational investment and legal complexity.
3. **Inference from external signals** — Bluetooth, traffic data, call
   records. Speculative, unreliable, ethically grey.

Beyond feasibility, putting "live availability" on the site **changes our
legal posture from information aggregator to dispatch / availability
service**. We would be making real-time claims that users rely on — at
which point our "no warranty, no liability" framing becomes untenable.

## Decision

We do **not** ship real-time vehicle tracking in v1. Specifically:

- The site does not show GPS positions of any vehicle.
- The site does not show "available now" indicators on any provider.
- The "what users report" aggregates are explicitly labelled as
  **historical observation**, never as real-time availability.
- The disclaimer states this explicitly: "We do not show real-time vehicle
  availability."

We do ship a **demand-side observation layer**:

- Users can report their actual call experiences after the fact (call
  attempts, response times, fares).
- Aggregates surface as per-provider stats — "78% answered, 18 min
  median response, ₹2800 median fare".

This data is historical, not predictive. It tells you what a provider
*typically* did, not what's happening right now.

We leave open a v2 / v3 **provider-cooperative path**:

- Optional webhook where a provider can push *hourly availability counts*
  (not GPS, not vehicle IDs) — e.g., "2 BLS available in Bangalore right
  now".
- Providers who participate earn a visible "Live availability" badge.
- This requires provider buy-in and adds operational complexity; deferred
  to a future ADR.

## Consequences

**Good:**
- Liability framing is preserved. "Information aggregator" remains
  defensible.
- We don't compete with provider aggregators on their home turf. No
  marketplace anxiety from listed providers.
- The product scope stays achievable for a small team / single
  maintainer.
- The demand-side observation layer creates a unique dataset that
  aggregators legally cannot replicate (they can't reveal poor
  performance about themselves).

**Costs:**
- Some users will be disappointed. "Find an ambulance" sometimes implies
  "find an ambulance that's free *right now*", and we cannot deliver
  that.
- The product is harder to demo than a real-time dot-on-a-map. Our
  differentiator (the freshness contract + sourced affiliations + user
  reports) requires more explanation.
- We may miss a market window if a competitor combines public-good
  positioning with real-time tracking. We accept this risk because we
  judge the structural impediment (provider opt-in) as insurmountable
  for them too.

## Alternatives considered

- **Estimate availability from public signals.** Scrape JustDial's
  "X cabs near you" or call-completion rates inferred from social media.
  Rejected: unreliable, ethically grey, and would force us to defend bad
  estimates in moments of distress.
- **Partner with one aggregator** (e.g., 108 / GVK EMRI) for live
  availability of their fleet only. Rejected: surfaces only one slice of
  the market, creates the perception of "108 plus also-rans", undercuts
  the neutrality position.
- **Show last-call-success-rate as a real-time proxy.** Considered. The
  aggregates we *do* show (answer rate, median response time) already
  serve this purpose without misrepresenting their nature.

## When this might be revisited

- A government EMS operator (NHM Karnataka, ABDM if/when an EMS layer
  ships) offers to expose station-level fleet count as a public API.
  Adopt it under the existing schema as a per-record field.
- 5+ private providers express written interest in the hourly-counts
  webhook. At that point: spec it, ship it, badge it.
- Material funding arrives that enables independent vehicle tracking on a
  voluntary opt-in basis with full provider consent.
