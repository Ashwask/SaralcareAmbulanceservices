# Mirroring this project

The Saralcare Ambulance Directory is a public-good civic dataset. If our
domain goes down — outage, takedown, registrar dispute, anything — the
dataset should still be reachable. This document tells you how to spin up
a mirror.

## Canonical source of truth

The **GitHub repository** is the canonical source:

> https://github.com/Ashwask/SaralcareAmbulanceservices

The site at `ambulance.saralcare.com` is a render of the GitHub repo,
nothing more. Any mirror is also a render of the same repo (or a
fork thereof).

## When to mirror

- Our domain is unreachable for >24 hours.
- Our hosting provider takes us offline.
- A legal injunction forces a takedown that you believe is unjust.
- You want a regional sub-mirror for your own users' speed / offline
  access.

You don't need permission to mirror under our licence (CC BY-NC-SA 4.0 +
MIT). You do need to:

- Attribute the source ("Mirror of Saralcare Ambulance Directory").
- Preserve the licence files.
- Apply the same non-commercial restriction on data.
- Make clear it's a mirror, not the canonical site.

## How to spin up a mirror — 30 minutes

1. **Clone the repository.**
   ```
   git clone https://github.com/Ashwask/SaralcareAmbulanceservices ambulance-mirror
   cd ambulance-mirror
   npm install
   ```

2. **Build the static site.**
   ```
   npm run site:build
   ```
   Output lands in `site/dist/`.

3. **Deploy the `site/dist/` directory** to any static host:
   - Cloudflare Pages, Vercel, Netlify, GitHub Pages (free tiers all
     adequate).
   - An S3 bucket + CloudFront.
   - A bare nginx / Caddy server.

4. **Point your subdomain** at the deploy. Examples:
   - `ambulance-mirror.you.org`
   - `ambulance.example.in`
   - `your-mirror.glitch.me`

5. **Add a top-of-page banner** identifying this as a mirror. Edit
   `site/src/layouts/Base.astro` and add:
   ```astro
   <div style="background: #fef3c7; padding: 0.5rem; text-align: center; font-size: 0.9rem;">
     Mirror of <a href="https://www.ambulance.saralcare.com">ambulance.saralcare.com</a>.
     Data may lag the canonical source. Last synced: <span id="sync-date">YYYY-MM-DD</span>.
   </div>
   ```

6. **Set up a sync job.** Pull from the canonical repo daily:
   ```
   #!/bin/bash
   # In your mirror's hosting environment
   git fetch origin
   git reset --hard origin/main
   npm run site:build
   # then re-deploy site/dist
   ```
   Schedule this via cron, GitHub Actions, or your host's scheduler.

7. **Notify us** (optional but encouraged):
   - Open a GitHub issue tagged `mirror` with your mirror URL.
   - We'll link to it from the main site as a "known mirror" (no
     governance approval needed — just a courtesy).

## What a mirror should NOT do

- **Don't change the data without contributing the changes back.** If you
  find an error, file an issue / open a PR on the canonical repo. Don't
  fix it in your mirror only — that creates data divergence.
- **Don't accept user submissions on the mirror.** Submissions should go
  to the canonical site's Worker so they reach the canonical moderation
  queue. Configure `PUBLIC_SUBMIT_URL` on your build to point at the
  canonical Worker URL.
- **Don't replace the licence files.** They travel with the data.
- **Don't add ads.** The licence forbids commercial use of the data; that
  includes monetising a mirror.

## If you want to FORK instead of mirror

A mirror tracks our data; a fork diverges. See `CITY-TEMPLATE.md` for
the fork path. A fork makes sense if you're covering a different
country, a different schema, or a different licence. Mirrors make sense
if you just want a fast / always-on copy of *our* data.

## Federation, eventually

Once we have 3+ active mirrors, we'll publish a federation manifest
(`mirrors.json`) listing known mirrors, last-sync timestamps, and a
trust signal. The canonical site will then have a "find a mirror near
you" feature. For v1, mirrors are ad-hoc.

## What we owe mirrors

If the canonical site has to take a record down for legal reasons, we
will:

- Document the takedown in `corrections/` with the date and reason.
- Notify known mirrors via the same GitHub issue thread.
- Recommend (but not require) mirrors to mirror the takedown.

Mirrors are not legally bound by our jurisdiction's decisions; whether to
mirror a takedown is their call.
