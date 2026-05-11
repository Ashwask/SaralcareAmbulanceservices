# Cloudflare Workers

## `submit` — form submission endpoint

Forwards user-submitted reports, new-provider applications, and provider claims to GitHub Issues for moderator review.

### Deploy steps

1. **Install wrangler** (once, globally):
   ```
   npm install -g wrangler
   wrangler login
   ```

2. **Create the rate-limit KV namespace:**
   ```
   cd workers/submit
   wrangler kv namespace create RATE
   ```
   Copy the returned `id` into `wrangler.toml` (replace `REPLACE_AFTER_WRANGLER_KV_CREATE`).

3. **Set secrets:**
   ```
   wrangler secret put GH_TOKEN
   # paste a fine-scoped GitHub PAT (Issues write only) when prompted

   wrangler secret put GH_REPO
   # e.g.  Ashwask/SaralcareAmbulanceservices
   ```

4. **Update vars** in `wrangler.toml` if your domain differs from `ambulance.saralcare.com`.

5. **Deploy:**
   ```
   wrangler deploy
   ```
   Note the URL it prints, e.g. `https://ambulance-submit.<your-subdomain>.workers.dev`.

6. **Add a custom route** (optional but cleaner):
   - Cloudflare dashboard → Workers → ambulance-submit → Triggers → Add custom domain → `submit.ambulance.saralcare.com`
   - Or add a route `ambulance.saralcare.com/api/submit*` and re-deploy.

7. **Point the site form at the Worker.** Set `PUBLIC_SUBMIT_URL` in `site/.env.production`:
   ```
   PUBLIC_SUBMIT_URL=https://submit.ambulance.saralcare.com/submit
   ```
   (or whichever URL you chose). Until this is set, the forms fall back to `mailto:` — still functional, just less ergonomic.

### Local dev

```
cd workers/submit
npm install
wrangler dev
# Worker available at http://localhost:8787
```

To test against this from the site:
```
PUBLIC_SUBMIT_URL=http://localhost:8787 npm run --workspace=site dev
```

### How the moderator workflow runs

1. User submits → Worker creates a GitHub issue labelled `report` / `new-provider` / `provider-claim` / `correction`.
2. Maintainer reviews the issue, verifies by phone where needed.
3. For accepted reports: maintainer commits a new YAML to `data/reports/` with `moderator_status: published` and closes the issue referencing the commit.
4. For rejected: maintainer closes the issue with reason; nothing enters `data/`.
5. For new providers: maintainer verifies by call, creates a `data/providers/<slug>.yaml` PR, closes the issue.

### GitHub PAT scope

Use a **fine-grained PAT** restricted to:
- Repository: `Ashwask/SaralcareAmbulanceservices` only
- Permissions: `Issues` → Read and write (nothing else)
- Expiration: 90 days; rotate before expiry

Never use a classic token. Never grant `repo` (it's all-or-nothing).
