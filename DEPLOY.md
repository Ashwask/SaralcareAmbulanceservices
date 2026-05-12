# Deploy — 15-minute quick start

You have the repo locally. This document gets the site live at
`https://www.ambulance.saralcare.com` in roughly 15 minutes, assuming
your Cloudflare and GitHub accounts are signed in.

For the longer, exhaustive checklist see `launch/handover-checklist.md`.

## Step 1 — Push the repo (2 minutes)

```bash
cd ~/Documents/Saralcare_moat/Ambulances

# Add the remote (skip if already added)
git remote add origin git@github.com:Ashwask/SaralcareAmbulanceservices.git

# Push
git push -u origin main
```

In the GitHub UI:
- Settings → General → Features → enable **Discussions**.
- Settings → General → set description: *"Open, verified directory of ambulance providers in India. CC BY-NC-SA 4.0."*
- Settings → General → add topics: `civic-tech`, `open-data`, `healthcare`, `india`, `ambulance`, `cc-by-nc-sa`, `astro`, `pwa`.

## Step 2 — Cloudflare Pages (5 minutes)

In the Cloudflare dashboard:

1. **Pages → Create a project → Connect to Git → GitHub.**
2. Authorise + select `Ashwask/SaralcareAmbulanceservices`.
3. Build configuration:
   - **Framework preset:** Astro
   - **Build command:** `npm run site:build`
   - **Build output directory:** `site/dist`
   - **Root directory:** `/`
   - **Environment variables (Production):**
     - `PUBLIC_SUBMIT_URL` — leave empty for now, set after Step 4.
4. **Save and Deploy.** First build takes ~3-5 minutes.
5. Note the `*.pages.dev` URL it gives you.

## Step 3 — DNS (3 minutes)

In Cloudflare DNS for `saralcare.com`:

1. Add a **CNAME** record:
   - **Name:** `www.ambulance` (or `ambulance` if you drop the `www`)
   - **Target:** the `*.pages.dev` URL from Step 2
   - **Proxy:** enabled (orange cloud)
2. Back in Pages → your project → **Custom domains** → add `www.ambulance.saralcare.com`.
3. Cloudflare auto-issues an SSL cert (1-2 minutes).
4. Verify: `https://www.ambulance.saralcare.com` renders the site.

## Step 4 — Cloudflare Worker for forms (5 minutes — OPTIONAL but recommended)

Without this, forms fall back to `mailto:` — uglier but functional.

```bash
cd workers/submit
npm install
npx wrangler login            # if first time
npx wrangler kv namespace create RATE
# Copy the returned id into wrangler.toml (replace REPLACE_AFTER_WRANGLER_KV_CREATE)
```

Set secrets:
```bash
npx wrangler secret put GH_TOKEN
# Paste a fine-grained GitHub PAT:
#   Repository access → only Ashwask/SaralcareAmbulanceservices
#   Permissions → Issues: Read and write
#   Expiration → 90 days
npx wrangler secret put GH_REPO
# Type: Ashwask/SaralcareAmbulanceservices
```

Deploy:
```bash
npx wrangler deploy
```

Cloudflare dashboard → Workers → ambulance-submit → **Custom Domains** →
add `submit.ambulance.saralcare.com`.

Back in Cloudflare Pages → your Pages project → **Settings → Environment
variables** → add `PUBLIC_SUBMIT_URL = https://submit.ambulance.saralcare.com`
(Production). Re-deploy.

## Step 5 — Sanity check (2 minutes)

Open `https://www.ambulance.saralcare.com` on a phone and:

- [ ] Geolocate button shows nearest 5 providers
- [ ] Tap-to-call opens the dialer
- [ ] First-visit modal appears once, then dismisses
- [ ] `/saved` works after starring a provider
- [ ] `/open-source` renders with all 4 stat tiles
- [ ] `/moderation` either shows the queue (if any issues exist) or a clear "couldn't reach GitHub" message
- [ ] `/federation` shows the canonical entry
- [ ] Language switcher in nav offers English / Hindi / Kannada / …
- [ ] PWA install banner appears in Chrome (or "Add to Home Screen" in Safari)

If any of these break, file a bug against your own repo using the
`[BUG]` template (eat your own dog food).

## What's still on you after this

1. **First 10 verification calls.** Open the records under
   `data/providers/*.yaml`, call each provider, flip status to `verified`
   with a `call_logs` entry. Commit each as a separate small PR.
2. **File RTI-1.** Templates in `sources/rti/`.
3. **Lawyer review** of `DISCLAIMER.md` and `TAKEDOWN.md`.
4. **Create Discord** and add the invite to `COMMUNITY.md` + site
   footer + LinkedIn post.
5. **Post the LinkedIn announcement** from `launch/linkedin-post.md`.
6. **Watch the moderation queue** for the first 72 hours and respond
   within 4 hours to anything that lands.

That's the v1 ship. Everything beyond it (Section 8 registration,
grant applications, hiring a verifier, opening accept-donations) is
v1.5 — triggered by traction signals, not pre-baked.
