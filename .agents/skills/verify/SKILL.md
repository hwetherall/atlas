---
name: verify
description: Build, launch and drive the Atlas demo to verify changes at the GUI surface.
---

# Verifying Atlas changes

Single-route Next.js 16 client app; all state is client-side. Data modules
(`lib/ledger.ts`, `lib/risks.ts`, `lib/featured.ts`, `lib/nextSteps.ts`)
self-validate at module load, so a bad id/shape fails `npm run build`
(static prerender) — build is the cheapest smoke test.

## Launch

- The user often already has `next dev` on **port 3000** (check
  `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000`). A second
  `next dev` refuses to start; drive the existing one — it hot-reloads edits.
  Do NOT kill the user's server (PID hint appears in the refusal message).
- Otherwise: `PORT=3457 npm run dev`.

## Drive (gstack browse)

`browse` needs bun on PATH: `export PATH="$HOME/.bun/bin:$PATH"`, binary at
`~/.Codex/skills/gstack/browse/dist/browse`.

- `FLAGS.intro` is on → app boots at the intake wizard. Walk it:
  click `text=Continue →` ×3, `text=Execute research plan →`, wait ~9s
  (scripted thinking sequence), `text=Continue to the fact bank →`.
- A full page reload resets to the intake — after hot-reload edits, re-walk.
- Tab nav: `text=<label>` collides ("Dashboard" vs "New dashboard") — use
  `$B js "[...document.querySelectorAll('nav button')].find(b=>b.innerText.includes('<label>')).click()"`.
- Hidden tabs stay mounted (`hidden` class), so `document.querySelectorAll`
  hits invisible surfaces — scope queries or filter `offsetParent !== null`.
- Many labels are CSS-`uppercase` — match rendered text case-insensitively.
- Risk rows have ids `#rr-row-<risk.id>`; drawers close on Escape.
- Lever probe: dashboard Germany checkbox (snapshot ref "Germany — included")
  should re-price register severities, Σ exposure, and the tab-8 VOI figures.

## Gotcha

JSX sometimes swallows the space in `</span> word` when the text continues on
the next source line — write `</span>{" "}` + newline instead. Check rendered
copy for jammed words (`innerText.match(/[a-z][A-Z]/)`-style spot checks).
