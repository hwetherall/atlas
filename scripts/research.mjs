// ─────────────────────────────────────────────────────────────────────────────
// Cached Exa research pass — runner.
//
// Executes scripts/research-plan.mjs against the Exa search API and caches the
// raw results as research/raw/<groupId>.json. The demo app NEVER calls this at
// runtime — the cached JSON is an audit trail that curation (lib/ledger.ts)
// cites. Zero deps: plain Node ESM + global fetch; EXA_API_KEY read from .env.
//
//   npm run research                      run all groups not yet cached
//   npm run research -- --only=a,b        (re)run a subset
//   npm run research -- --force           re-run everything
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { QUERY_PLAN } from "./research-plan.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = path.join(ROOT, "research", "raw");

function apiKey() {
  const envPath = path.join(ROOT, ".env");
  const env = fs.readFileSync(envPath, "utf8");
  const key = env.match(/^EXA_API_KEY=["']?([^"'\r\n]+)/m)?.[1];
  if (!key) throw new Error("EXA_API_KEY missing from .env");
  return key;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function exaSearch(key, query, attempt = 0) {
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key },
    body: JSON.stringify({
      query,
      type: "auto",
      numResults: 8,
      contents: { text: { maxCharacters: 1500 } },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt === 0) {
      console.warn(`  ${res.status} — retrying in 5s…`);
      await sleep(5000);
      return exaSearch(key, query, 1);
    }
    throw new Error(`Exa ${res.status} for "${query}": ${body}`);
  }
  return res.json();
}

// Keep only the fields curation needs — drops image/favicon etc.
function slimResult(r) {
  return {
    title: r.title ?? null,
    url: r.url,
    publishedDate: r.publishedDate ?? null,
    author: r.author ?? null,
    text: r.text ?? null,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const only = args
    .find((a) => a.startsWith("--only="))
    ?.slice("--only=".length)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const key = apiKey();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const groups = QUERY_PLAN.filter((g) => (only ? only.includes(g.id) : true));
  if (only && groups.length !== only.length) {
    const known = new Set(QUERY_PLAN.map((g) => g.id));
    throw new Error(`Unknown group(s) in --only: ${only.filter((id) => !known.has(id)).join(", ")}`);
  }

  for (const group of groups) {
    const outFile = path.join(OUT_DIR, `${group.id}.json`);
    if (fs.existsSync(outFile) && !force && !only) {
      console.log(`○ ${group.id} — cached, skipping`);
      continue;
    }
    console.log(`● ${group.id} (${group.queries.length} queries)`);
    const queries = [];
    for (const query of group.queries) {
      console.log(`  → ${query}`);
      const data = await exaSearch(key, query);
      queries.push({
        query,
        requestId: data.requestId ?? null,
        results: (data.results ?? []).map(slimResult),
      });
      await sleep(1200); // politeness / rate limits
    }
    const payload = {
      id: group.id,
      feeds: group.feeds,
      intent: group.intent,
      fetchedAt: new Date().toISOString(),
      queries,
    };
    fs.writeFileSync(outFile, JSON.stringify(payload, null, 2) + "\n");
    console.log(`  ✓ wrote research/raw/${group.id}.json`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
