/**
 * Cloudflare Worker — form submission endpoint for the Saralcare Ambulance Directory.
 *
 * Accepts POST /submit with JSON: { form_type, payload }
 * form_type ∈ { "report", "new-provider", "provider-claim", "correction" }
 *
 * - Validates minimally (server-side; full validation happens at moderator review).
 * - Rate-limits 10 submissions / hour / IP (Cloudflare KV).
 * - Creates a GitHub issue with the payload and an appropriate label.
 * - Returns { ok: true, issue_url } or { ok: false, error }.
 *
 * Secrets: GH_TOKEN (fine-scoped PAT), GH_REPO.
 * Vars: ALLOWED_ORIGIN, RATE_LIMIT_PER_HOUR.
 * Bindings: RATE (KV namespace).
 */

export interface Env {
  GH_TOKEN: string;
  GH_REPO: string;
  ALLOWED_ORIGIN: string;
  RATE_LIMIT_PER_HOUR: string;
  RATE: KVNamespace;
}

type FormType = "report" | "new-provider" | "provider-claim" | "correction" | "dead-number" | "capacity-check";

const LABELS: Record<FormType, string[]> = {
  report: ["report", "needs-moderation"],
  "new-provider": ["new-provider", "needs-verification-call"],
  "provider-claim": ["provider-claim", "needs-verification"],
  correction: ["correction"],
  "dead-number": ["dead-number", "needs-reverify"],
  "capacity-check": ["capacity-check", "urgent-ping"],
};

const TITLES: Record<FormType, (p: any) => string> = {
  report: (p) => `[REPORT] ${p.provider_id} — ${p.outcome} on ${p.date_of_call}`,
  "new-provider": (p) => `[NEW PROVIDER] ${p.brand_name ?? "unknown"} (${p.city ?? "Bangalore"})`,
  "provider-claim": (p) => `[CLAIM] ${p.provider_id} — ${p.claimant_role ?? "?"}`,
  correction: (p) => `[CORRECTION] ${p.target_id} — ${p.field ?? "?"}`,
  "dead-number": (p) => `[DEAD NUMBER] ${p.provider_id} — ${p.phone}`,
  "capacity-check": (p) => `[CAPACITY CHECK] ${p.provider_id} — pincode ${p.pincode ?? "?"}`,
};

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get("Origin") ?? "";
    const corsHeaders: HeadersInit = {
      "Access-Control-Allow-Origin":
        origin === env.ALLOWED_ORIGIN ? origin : env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (req.method !== "POST")
      return json({ ok: false, error: "method-not-allowed" }, 405, corsHeaders);

    // ----- rate limit -----
    const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
    const limit = parseInt(env.RATE_LIMIT_PER_HOUR ?? "10", 10);
    const key = `rl:${ip}`;
    const current = parseInt((await env.RATE.get(key)) ?? "0", 10);
    if (current >= limit) {
      return json({ ok: false, error: "rate-limited" }, 429, corsHeaders);
    }
    await env.RATE.put(key, String(current + 1), { expirationTtl: 3600 });

    // ----- parse -----
    let body: { form_type: FormType; payload: any };
    try {
      body = await req.json();
    } catch {
      return json({ ok: false, error: "invalid-json" }, 400, corsHeaders);
    }
    if (!body.form_type || !body.payload)
      return json({ ok: false, error: "missing-fields" }, 400, corsHeaders);
    if (!(body.form_type in LABELS))
      return json({ ok: false, error: "unknown-form-type" }, 400, corsHeaders);

    // ----- create GitHub issue -----
    const title = TITLES[body.form_type](body.payload);
    const issueBody = renderIssueBody(body.form_type, body.payload, ip);
    const labels = LABELS[body.form_type];

    const ghResp = await fetch(
      `https://api.github.com/repos/${env.GH_REPO}/issues`,
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${env.GH_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "saralcare-ambulance-submit-worker",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body: issueBody, labels }),
      }
    );

    if (!ghResp.ok) {
      const text = await ghResp.text();
      console.error("github error", ghResp.status, text);
      return json({ ok: false, error: "github-failed" }, 502, corsHeaders);
    }
    const issue = (await ghResp.json()) as { html_url: string; number: number };
    return json({ ok: true, issue_url: issue.html_url, issue_number: issue.number }, 200, corsHeaders);
  },
} satisfies ExportedHandler<Env>;

function json(obj: any, status: number, headers: HeadersInit): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function renderIssueBody(formType: FormType, payload: any, ip: string): string {
  const tableRows = Object.entries(payload)
    .filter(([k]) => !k.startsWith("_"))
    .map(([k, v]) => `| \`${k}\` | ${formatVal(v)} |`)
    .join("\n");

  return `
**Submitted via ${formType} form on ambulance.saralcare.com.**

| Field | Value |
|---|---|
${tableRows}

---

<details>
<summary>Moderator notes</summary>

- Submitted IP (hashed elsewhere; kept short here for rate-limit forensics only): \`${ip.slice(0, 4)}…\`
- Schema: schema/${formType === "report" ? "report" : formType === "new-provider" ? "provider" : "n/a"}.schema.json
- Next step: verify the claim by phone, then either close (rejected) or open a PR moving this into \`data/\` with \`moderator_status: published\`.

</details>

_Submitted under the terms of the disclaimer at https://www.ambulance.saralcare.com/disclaimer. By submitting, the contributor licenses the content to the project under CC BY-NC-SA 4.0._
`.trim();
}

function formatVal(v: any): string {
  if (v === null || v === undefined) return "_(empty)_";
  if (typeof v === "string") return v.replaceAll("|", "\\|").slice(0, 500);
  if (typeof v === "object") return "`" + JSON.stringify(v).slice(0, 500) + "`";
  return String(v);
}
