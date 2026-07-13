// ─────────────────────────────────────────────────────────────────────────────
// Cached Next Steps research pass — runner (nextsteps.md §6).
//
// Executes scripts/nextsteps-plan.mjs against Exa (search) and Perplexity
// (cited synthesis) and caches results as research/raw/nextsteps/<id>.json.
// The demo app NEVER calls this at runtime — the cache is the audit trail
// that memo authoring (lib/nextSteps.ts) cites. Zero deps: plain Node ESM +
// global fetch; keys read from .env.
//
//   node scripts/nextsteps-research.mjs                 run all uncached groups
//   node scripts/nextsteps-research.mjs --only=a,b      (re)run a subset
//   node scripts/nextsteps-research.mjs --force         re-run everything
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NEXTSTEPS_PLAN } from "./nextsteps-plan.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = path.join(ROOT, "research", "raw", "nextsteps");

function envKey(name) {
  const env = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
  const key = env.match(new RegExp(`^${name}=["']?([^"'\\r\\n]+)`, "m"))?.[1];
  if (!key) throw new Error(`${name} missing from .env`);
  return key;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function exaSearch(query, attempt = 0) {
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": envKey("EXA_API_KEY") },
    body: JSON.stringify({
      query,
      type: "auto",
      numResults: 8,
      contents: { text: { maxCharacters: 2000 } },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt === 0) {
      console.warn(`  ${res.status} — retrying in 5s…`);
      await sleep(5000);
      return exaSearch(query, 1);
    }
    throw new Error(`Exa ${res.status} for "${query}": ${body}`);
  }
  const json = await res.json();
  return {
    engine: "exa",
    results: (json.results ?? []).map((r) => ({
      title: r.title ?? null,
      url: r.url,
      publishedDate: r.publishedDate ?? null,
      author: r.author ?? null,
      text: r.text ?? null,
    })),
  };
}

async function perplexityAsk(prompt, attempt = 0) {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${envKey("PERPLEXITY_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt === 0) {
      console.warn(`  ${res.status} — retrying in 5s…`);
      await sleep(5000);
      return perplexityAsk(prompt, 1);
    }
    throw new Error(`Perplexity ${res.status}: ${body}`);
  }
  const json = await res.json();
  return {
    engine: "perplexity",
    model: json.model ?? "sonar-pro",
    answer: json.choices?.[0]?.message?.content ?? null,
    citations: json.citations ?? [],
    searchResults: (json.search_results ?? []).map((r) => ({
      title: r.title ?? null,
      url: r.url,
      date: r.date ?? null,
    })),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const only = args
    .find((a) => a.startsWith("--only="))
    ?.slice("--only=".length)
    .split(",")
    .map((s) => s.trim());

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const group of NEXTSTEPS_PLAN) {
    if (only && !only.includes(group.id)) continue;
    const outPath = path.join(OUT_DIR, `${group.id}.json`);
    if (!force && !only && fs.existsSync(outPath)) {
      console.log(`skip ${group.id} (cached)`);
      continue;
    }
    console.log(`run  ${group.id} [${group.engine}]`);
    const payload =
      group.engine === "perplexity"
        ? await perplexityAsk(group.query)
        : await exaSearch(group.query);
    fs.writeFileSync(
      outPath,
      JSON.stringify(
        { id: group.id, memo: group.memo, query: group.query, fetchedAt: new Date().toISOString(), ...payload },
        null,
        2,
      ),
    );
    await sleep(800);
  }
  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
