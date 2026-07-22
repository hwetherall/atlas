import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceUrl =
  process.env.ATLAS_PROCESS_SOURCE_URL ?? "http://localhost:3000/atlas-process";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDirectory, "../exports/atlas-research-loop.html");

function mimeType(url, header) {
  if (header) return header.split(";")[0];
  if (url.endsWith(".woff2")) return "font/woff2";
  if (url.endsWith(".woff")) return "font/woff";
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
  if (url.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

async function fetchOrThrow(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch ${url}: ${response.status}`);
  }
  return response;
}

async function asDataUrl(url) {
  const response = await fetchOrThrow(url);
  const bytes = Buffer.from(await response.arrayBuffer());
  const type = mimeType(url, response.headers.get("content-type"));
  return `data:${type};base64,${bytes.toString("base64")}`;
}

async function inlineCssAssets(css, stylesheetUrl) {
  const matches = [...css.matchAll(/url\(([^)]+)\)/g)];
  const replacements = new Map();

  for (const match of matches) {
    const raw = match[1].trim().replace(/^['"]|['"]$/g, "");
    if (!raw || raw.startsWith("data:") || raw.startsWith("#")) continue;
    const assetUrl = new URL(raw, stylesheetUrl).href;
    if (!replacements.has(match[0])) {
      replacements.set(match[0], `url("${await asDataUrl(assetUrl)}")`);
    }
  }

  for (const [from, to] of replacements) {
    css = css.split(from).join(to);
  }
  return css;
}

const pageResponse = await fetchOrThrow(sourceUrl);
let html = await pageResponse.text();
const stylesheetLinks = [
  ...html.matchAll(
    /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*\/?>(?:<\/link>)?/gi,
  ),
];
let bundledCss = "";

for (const link of stylesheetLinks) {
  const stylesheetUrl = new URL(link[1], sourceUrl).href;
  const response = await fetchOrThrow(stylesheetUrl);
  const css = await inlineCssAssets(await response.text(), stylesheetUrl);
  bundledCss += `\n/* ${link[1]} */\n${css}\n`;
}

const imageSources = [...html.matchAll(/\bsrc="(\/(?!\/_next\/)[^"]+)"/g)];
for (const match of imageSources) {
  const assetUrl = new URL(match[1], sourceUrl).href;
  html = html
    .split(`src="${match[1]}"`)
    .join(`src="${await asDataUrl(assetUrl)}"`);
}

html = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(
    /<link\b[^>]*rel="(?:stylesheet|preload|modulepreload)"[^>]*\/?>(?:<\/link>)?/gi,
    "",
  )
  .replace(/<div hidden="">[\s\S]*?<\/div>(?=<main\b)/i, "")
  .replace(/<meta name="next-size-adjust" content=""\s*\/?>(?:<\/meta>)?/gi, "");

const exportCss = `
nextjs-portal { display: none !important; }
section.export-overview {
  width: min(96rem, calc(100vw - 2rem));
  max-height: calc(100dvh - 7rem);
  aspect-ratio: auto;
  padding: 0.2rem;
  background: transparent;
  box-shadow: none;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
  gap: 1rem;
  container-type: normal;
}
section.export-overview > div {
  display: block !important;
  position: relative;
  inset: auto;
  aspect-ratio: 16 / 9;
  outline: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  container-type: inline-size;
}
section.export-overview > div:hover,
section.export-overview > div:focus-visible {
  outline-color: #78cfd8;
}
section.export-overview article {
  box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.24);
}
`;

const exportScript = String.raw`
(() => {
  document.querySelectorAll("body > div[hidden]").forEach((node) => node.remove());
  const root = document.querySelector('main[aria-label="Atlas research loop presentation"]');
  const stage = root?.querySelector('section[aria-live="polite"]');
  const nav = root?.querySelector('nav[aria-label="Presentation controls"]');
  if (!root || !stage || !nav) return;

  const slots = [...stage.children].filter((node) => node.querySelector("[data-slide]"));
  const total = slots.length;
  const activeClass = [...slots[0].classList].find((name) => name.includes("activeSlot"));
  const previousButton = nav.querySelector('button[aria-label="Previous slide"]');
  const nextButton = nav.querySelector('button[aria-label="Next slide"]');
  const buttons = [...nav.querySelectorAll("button")];
  const overviewButton = buttons.find((button) => button.textContent.trim() === "Overview");
  const fullscreenButton = buttons.find((button) => button.textContent.trim() === "Fullscreen");
  const printButton = buttons.find((button) => button.textContent.trim() === "Print");
  const counter = nav.querySelector("div span");
  const progress = nav.querySelector('[role="progressbar"]');
  const progressFill = progress?.querySelector("span");
  let current = Math.max(0, Math.min(total - 1, Number(location.hash.replace("#slide-", "")) - 1 || 0));
  let overview = false;
  let pointerStart = null;

  function render(updateHash = true) {
    stage.classList.toggle("export-overview", overview);
    slots.forEach((slot, index) => {
      if (activeClass) slot.classList.toggle(activeClass, !overview && index === current);
      slot.style.display = overview || index === current ? "block" : "none";
      slot.setAttribute("aria-hidden", String(!overview && index !== current));
      slot.tabIndex = overview ? 0 : -1;
      slot.setAttribute("role", overview ? "button" : "presentation");
    });

    if (counter) counter.textContent = String(current + 1).padStart(2, "0") + " / " + total;
    if (progress) {
      progress.setAttribute("aria-valuemax", String(total));
      progress.setAttribute("aria-valuenow", String(current + 1));
      progress.setAttribute("aria-label", "Slide " + (current + 1) + " of " + total);
    }
    if (progressFill) progressFill.style.width = ((current + 1) / total) * 100 + "%";
    previousButton.disabled = current === 0 || overview;
    nextButton.disabled = current === total - 1 || overview;
    overviewButton.textContent = overview ? "Close overview" : "Overview";
    overviewButton.setAttribute("aria-pressed", String(overview));
    stage.setAttribute("aria-label", overview ? "Slide overview" : "Showing slide " + (current + 1) + " of " + total);
    if (updateHash && !overview) history.replaceState(null, "", "#slide-" + (current + 1));
  }

  function goTo(index) {
    current = Math.max(0, Math.min(total - 1, index));
    overview = false;
    render();
  }

  previousButton.addEventListener("click", () => goTo(current - 1));
  nextButton.addEventListener("click", () => goTo(current + 1));
  overviewButton.addEventListener("click", () => {
    overview = !overview;
    render(false);
  });
  fullscreenButton.addEventListener("click", async () => {
    if (!document.fullscreenElement) await root.requestFullscreen();
    else await document.exitFullscreen();
  });
  printButton.addEventListener("click", () => window.print());

  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen";
  });

  slots.forEach((slot, index) => {
    slot.addEventListener("click", () => {
      if (overview) goTo(index);
    });
    slot.addEventListener("keydown", (event) => {
      if (overview && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        goTo(index);
      }
    });
  });

  window.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target?.matches?.("button, a, input, textarea, select, summary, [popover], [contenteditable='true']")) {
      return;
    }
    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      goTo(current + 1);
    } else if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(total - 1);
    } else if (event.key.toLowerCase() === "o") {
      event.preventDefault();
      overview = !overview;
      render(false);
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      fullscreenButton.click();
    } else if (event.key.toLowerCase() === "p") {
      event.preventDefault();
      window.print();
    } else if (event.key === "Escape" && overview) {
      overview = false;
      render(false);
    }
  });

  root.addEventListener("pointerdown", (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
  });
  root.addEventListener("pointerup", (event) => {
    if (!pointerStart || overview) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) < 54 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    goTo(current + (dx < 0 ? 1 : -1));
  });

  window.addEventListener("hashchange", () => {
    const requested = Number(location.hash.replace("#slide-", ""));
    if (requested >= 1 && requested <= total) goTo(requested - 1);
  });

  render(false);
})();
`;

html = html
  .replace(
    "</head>",
    `<style>${bundledCss.replaceAll("</style>", "<\\/style>")}\n${exportCss}</style></head>`,
  )
  .replace(
    "</body>",
    `<script>${exportScript.replaceAll("</script>", "<\\/script>")}</script></body>`,
  );

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html, "utf8");
console.log(outputPath);
