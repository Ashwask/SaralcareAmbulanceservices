# Security Policy

## Reporting a vulnerability

If you find a security issue in the Saralcare Ambulance Directory codebase,
data pipeline, or hosting infrastructure, **please do not open a public
GitHub issue.** Email `ashwinsk@saralcare.com` with subject
`[SECURITY]` and we will respond within 48 hours.

If you don't get a response within 48 hours, please follow up — it likely
means the email didn't reach the maintainer.

## What we care about most

In rough order of severity:

1. **Submission endpoint abuse.** The Cloudflare Worker creates GitHub
   issues on user submission. If an attacker can flood the moderation queue,
   inject markdown that defaces issues, or escape the rate limiter, that
   directly impacts our ability to triage real reports.
2. **Cache poisoning of the JSON API.** Our `/v1/*.json` files are
   cached at the edge. A successful cache poisoning attack could serve
   wrong phone numbers to users in emergencies. This is the highest-impact
   data-integrity risk.
3. **Cross-site scripting (XSS) via user-submitted content.** Reports
   contain free-text notes. Any path from submission → render that doesn't
   escape correctly is in scope. We render all user content via Astro
   template literals which auto-escape, but bugs happen.
4. **GitHub PAT exposure.** If our Worker's `GH_TOKEN` could be exfiltrated,
   the attacker could open issues / spam the repo. The PAT is fine-grained
   and limited to `Issues` write — the blast radius is limited, but still
   worth reporting.
5. **Subdomain takeover / DNS issues** with `ambulance.saralcare.com`.

## What we treat as a non-issue

- **Open data being open.** All data is published under CC BY-NC-SA 4.0 —
  scraping `/v1/*.json` is the *intended* use. Please don't report
  "the API is unauthenticated" as a vulnerability. It is by design.
- **No login mechanism.** We deliberately don't have user accounts. Reports
  of "no password reset" or "no 2FA" are not in scope.
- **Provider phone numbers being public.** The numbers come from providers'
  own websites. Re-publishing them under attribution is the project's
  purpose.

## Responsible disclosure timeline

We commit to:
- **Acknowledge** within 48 hours.
- **Investigate + provide a remediation timeline** within 7 working days.
- **Credit the reporter publicly** in `CHANGELOG.md` and `CONTRIBUTORS.md`,
  if they wish, after the fix lands.

We ask reporters to:
- Allow at least 30 days for remediation before public disclosure,
  proportionate to severity.
- Not access, modify, or destroy data beyond what's needed to demonstrate
  the issue.
- Not target specific real users; use your own submissions for testing.

## Scope

In scope:
- `github.com/Ashwask/SaralcareAmbulanceservices` (this repo)
- `ambulance.saralcare.com` (when deployed)
- Cloudflare Worker `ambulance-submit` (when deployed)
- The JSON API at `/v1/*.json`

Out of scope:
- `saralcare.com` apex and other Saralcare subdomains (different scope).
- Third-party services we depend on (Cloudflare, GitHub, OSM). Report to
  them directly.
- DNS attacks against domain registrars.

## Bounty

We don't currently run a paid bug-bounty programme. Recognition in
`CHANGELOG.md` and `CONTRIBUTORS.md` is what we can offer for v1. If you
need a paid programme as a condition of reporting, please consider
whether public-good infrastructure is the right target.
