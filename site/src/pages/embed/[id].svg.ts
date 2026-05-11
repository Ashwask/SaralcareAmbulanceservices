import type { APIRoute } from "astro";
import { getProviders, badge } from "@/lib/data";

export const prerender = true;

export async function getStaticPaths() {
  const providers = getProviders();
  return providers.map((p) => ({
    params: { id: p.id },
    props: { provider: p },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const provider = (props as any).provider;
  const b = badge(provider);
  const badgeColor = {
    verified: "#15803d",
    stale: "#b45309",
    dead: "#525252",
    unverified: "#94a3b8",
    disputed: "#b91c1c",
  }[b];
  const badgeText = {
    verified: "Verified",
    stale: "Verify due",
    dead: "Unreachable",
    unverified: "Listed",
    disputed: "Disputed",
  }[b];

  const name = (provider.brand_name ?? "Provider").slice(0, 36);
  const phone = provider.contact?.phone_24h ?? "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80" viewBox="0 0 320 80" role="img" aria-label="${name} listed on Saralcare Ambulances">
  <style>
    .bg { fill: #ffffff; stroke: #e2e8f0; stroke-width: 1; }
    .red { fill: #b91c1c; }
    .name { font: 600 14px -apple-system, system-ui, sans-serif; fill: #0f172a; }
    .phone { font: 700 13px -apple-system, system-ui, sans-serif; fill: #1d4ed8; font-variant-numeric: tabular-nums; }
    .meta { font: 500 10px -apple-system, system-ui, sans-serif; fill: #64748b; letter-spacing: 0.04em; text-transform: uppercase; }
    .badge-text { font: 700 9px -apple-system, system-ui, sans-serif; fill: #ffffff; letter-spacing: 0.06em; }
  </style>
  <rect class="bg" x="0.5" y="0.5" width="319" height="79" rx="10" />
  <rect class="red" x="0.5" y="0.5" width="56" height="79" rx="10" />
  <text x="28" y="34" text-anchor="middle" font="700 24px sans-serif" fill="#ffffff">🚑</text>
  <text x="28" y="56" text-anchor="middle" class="badge-text">SARALCARE</text>
  <text x="70" y="22" class="meta">Listed · ${badgeText}</text>
  <text x="70" y="42" class="name">${escapeXml(name)}</text>
  <text x="70" y="62" class="phone">${escapeXml(phone)}</text>
  <rect x="280" y="14" width="30" height="14" rx="7" fill="${badgeColor}" />
  <text x="295" y="24" text-anchor="middle" class="badge-text">${badgeText.toUpperCase().slice(0, 6)}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
};

function escapeXml(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  }[c] as string));
}
