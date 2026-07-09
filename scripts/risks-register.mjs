// ─────────────────────────────────────────────────────────────────────────────
// Module hooks that let plain Node run the app's TypeScript lib/ directly:
//   node --import ./scripts/risks-register.mjs scripts/risks-bridge.ts …
//
// Two rewrites, nothing else:
//   1. the tsconfig "@/…" alias → repo root
//   2. extensionless imports → retry with ".ts" (Node's native type stripping
//      handles the rest — zero new dependencies)
//
// This exists so the risk pipeline computes impacts with the REAL engine
// (lib/compute.ts, lib/riskCompute.ts), never a reimplementation.
// ─────────────────────────────────────────────────────────────────────────────

import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

registerHooks({
  resolve(specifier, context, nextResolve) {
    const spec = specifier.startsWith("@/")
      ? pathToFileURL(path.join(ROOT, specifier.slice(2))).href
      : specifier;
    try {
      return nextResolve(spec, context);
    } catch (err) {
      if (!spec.endsWith(".ts") && (spec.startsWith("file:") || spec.startsWith("."))) {
        return nextResolve(`${spec}.ts`, context);
      }
      throw err;
    }
  },
});
