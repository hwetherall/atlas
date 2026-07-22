# Atlas process HTML presentation

The presentation is available at `/atlas-process`.

## Editing

- Slide content and ordering: `AtlasProcessDeck.tsx`
- Presentation styling: `AtlasProcessDeck.module.css`
- Route metadata: `page.tsx`

Each slide is a semantic `<article>`. The deck is intentionally separate from
the main Atlas dashboard and the existing Frank presentation.

## Presenting

- Arrow keys, Page Up / Page Down, or Space: navigate
- Home / End: first or last slide
- O: overview
- F: fullscreen
- P: print or save as PDF
- Swipe horizontally on touch devices

The current slide is stored in the URL hash, so links such as
`/atlas-process#slide-4` open directly to a specific slide.

## Standalone HTML

With the local app running, use:

```bash
node scripts/export-atlas-process-html.mjs
```

This writes `exports/atlas-research-loop.html` with the deck styles, fonts,
navigation, and presentation controls bundled into one file.
