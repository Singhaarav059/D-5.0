# Demaze Implementation State

Read this file first in any new session on this task, before re-deriving anything from conversation history. Then inspect the actual code in `demaze/` and `index.html` — they're more authoritative than this file's descriptions if they ever disagree.

## Project

Adapting the cloned MOVIQ Framer template (this repo) into the Demaze Technologies website, section by section, on `index.html` (the homepage) only. One approved section at a time — do not implement multiple sections without approval between each.

**Core rule:** MOVIQ = 100% of the design (layout, CSS, animation, components). Demaze = 100% of the content. Never invent Demaze facts/services/metrics/testimonials — only use what's verifiably on demazetech.com. When Demaze has fewer real items than MOVIQ has slots, hide the extra slots (`display:none`) rather than inventing filler.

**Content source of truth:** https://www.demazetech.com/ (live site) — also check `/services`, `/about-us`, `/projects` for section-specific content. Re-verify content on the live site before using it; don't trust old research if a mapping seems off (this bit us once on Why Demaze — sourced content from the wrong page initially).

## Critical architecture: why a "post-hydration override" system exists

This MOVIQ export is **not static HTML** — it ships the original Framer React runtime (`script_main.*.mjs` + ~20 other chunk files loaded from `framerusercontent.com`). On every page load, React hydrates and discards any server-rendered text that doesn't match its compiled component tree, silently reverting direct HTML edits. Confirmed via console: `"Caught a recoverable error... server/client mismatches"`.

**Solution in place:** a small JS layer that waits for hydration to finish, then mutates the *already-hydrated* live DOM in place (`textContent`/`href`/`style` only, never removing nodes React owns), with a few bounded re-checks afterward in case Framer swaps in a different responsive-variant DOM shape shortly after. This is NOT a MutationObserver loop or a polling hack — it runs a fixed number of times then stops permanently.

Files:
- `demaze/demaze-content.js` — all Demaze content as plain data (no logic). Add new section content here.
- `demaze/demaze-override-core.js` — shared `window.DemazeOverride.run({getRoot, isHydrated, apply, verify})` helper. Every section's override script calls this instead of reimplementing polling.
- `demaze/demaze-<section>-override.js` — one file per section, each doing `getSection()` (find the MOVIQ section), `applyOverride()` (mutate it), `verifyStuck()` (used by the bounded re-checks).
- All are wired into `index.html` via `<script>` tags inside the existing `<!-- Start of bodyEnd -->` HTML comment placeholder. Current load order: content.js → override-core.js → hero → testimonial → techstack → process (hide-only) → showcase → capabilities → aboutus → whatdrivesus → industries → whydemaze → cta-pricing → faq → branding.

**Hard-won lessons — read before writing a new override script:**
1. **MOVIQ's own CSS often wins the specificity battle.** Its rules combine an ancestor class + the element's own class (e.g. `.framer-ScIth .framer-1a3dchp{...}`), which beats a plain single-class override (`.my-class{...}`) even though it looks like it should apply. Every new CSS class this project adds that needs to actually change a MOVIQ element's layout uses `!important` on the specific conflicting properties (confirmed the conflict first via computed-style inspection, not just adding it defensively everywhere).
2. **Framer's hydrated DOM shape varies by breakpoint/timing**, sometimes with an extra `.ssr-variant` wrapper, sometimes without. Never assume a fixed child index (`columns[1]`) — this caused a real bug in Why Demaze (grabbed the competitor column instead of "us" at a narrower viewport). Select by stable identifying content (e.g. header text) instead of position.
3. **This site uses Lenis smooth-scroll** (`window.lenis` exists). `window.scrollTo()` desyncs from what Lenis actually paints — always test scroll-driven effects with real wheel-scroll input (`computer{action:"scroll"}`), never `scrollTo`/`scrollY` assertions alone. `window.lenis.scrollTo(x, {immediate:true})` is a reliable way to jump-scroll for testing.
4. Gradient headings use `<h2><span data-text-fill>text</span></h2>` — always update the inner `span`'s text, never `h2.textContent` directly (that deletes the span and kills the gradient).
5. Always test after every change: hard refresh, **brand-new tab** (not a re-navigate on an existing tab — Framer's client router doesn't always do a true hard reload on a same-URL `navigate`, and repeated soft-navigations on one tab accumulate stale mutations that produce false-positive React crashes that don't reflect a real user's experience), ~577px width, mobile (375×812), and for scroll effects, desktop-wide (1400px) with real scrolling in both directions. The dev-server preview pane defaults to a width inside MOVIQ's mobile breakpoint (≤809.98px) — explicitly resize to test true desktop.
6. **Never insert new DOM nodes into a React-owned parent's children list, and never toggle `display:none` on multiple siblings within a section that itself has responsive-breakpoint restructuring logic.** Both confirmed live to fatally crash React's reconciler ("NotFoundError: removeChild/insertBefore: not a child of this node") on mobile-width loads, in ways that don't show up on desktop and don't throw synchronously (so wrapping the call in try/catch doesn't help — the failure surfaces later, inside React's own code). This killed two different approaches this session (Process's cloned 4th card; Branding's footer-column hiding) — both were reverted to text/attribute-only mutation of already-existing nodes, which never crashed in any test. If a section needs more real slots than MOVIQ has, or needs whole siblings hidden, treat it as an open problem requiring a genuinely different technique (not appendChild/display:none on that subtree) rather than shipping it.

## Homepage structure — current state (all planned sections implemented; a few landed with a documented compromise)

| # | MOVIQ section (`data-framer-name`) | Demaze section | Status |
|---|---|---|---|
| 1 | `Hero` | Hero | ✅ Done |
| 2 | *(new)* — nested inside Hero's own container, not a new top-level sibling (see note below) | Founder testimonial (Krupal Chaudhary) | ✅ Done. See `demaze-testimonial-override.js`. |
| 3 | `Badge` | Technology Stack | ✅ Done |
| 4 | `Videos making Step` | Our Process | ⛔ **Hidden, not built** — real Demaze content exists (4 real steps, still in `demaze-content.js` under `process`) but un-hiding this section is confirmed to crash React fatally on mobile no matter what mutation strategy is used (tried: 4th card clone, nested extra-step content, plain text-only edits — all crashed; only fully hidden is safe). See lesson #6 above and the comment block in `demaze-process-override.js`. |
| 5 | `Sricpt` | Featured Projects | ✅ Done — sticky peek-stack, custom-built. Content re-verified against current live homepage and corrected (full descriptions, live feature order, "Drag" typo fixed). |
| 6 | `Tools` (1st) | Core Capabilities | ✅ Done — scroll-driven unfold, custom-built. |
| 7 | `CTA` (1st, "Ready to bring your brand to life on video?") | — | ✅ **Removed** (hidden) — no Demaze equivalent. |
| 8 | `Products` | Who We Are | ✅ Done — heading + injected paragraph (no body-text slot existed natively), image gallery hidden (no legitimate Demaze images). **Not reordered** — stays in MOVIQ's native position (after What Drives Us), not before it as originally proposed; reordering full sections via `insertBefore` across parents also crashes React fatally (same class of bug as lesson #6). See `demaze-aboutus-override.js`. |
| 9 | `Ai Powered` | What Drives Us | ✅ Done — 4 real items in the first 4 card slots, 5th slot hidden, MOVIQ's language-option decoration (Canadian/Chinese/English) inside one card hidden. See `demaze-whatdrivesus-override.js`. |
| 10 | `Tools` (2nd, tab bar + checklist panel) | Industries We Serve | ✅ Done — tab bar extended from 4 to 19 (Demaze's real industry count — not 18, corrected after miscounting earlier), custom click handler (capture-phase, stops MOVIQ's own tab logic) rebuilds the panel per industry with the exact real sub-item count. See `demaze-industries-override.js`. |
| 11 | `Moviq vs Traditional Video` | Why Demaze + Metrics | ✅ Done — 3 cards plus a stat row (45+/$10M+/35+/6+) appended within the same custom-built section. |
| 12 | `CTA` (2nd, same promo copy as #7) | — | ✅ **Removed** (hidden). |
| 13 | `Pricing` | — | ✅ **Removed entirely** (hidden) — no public Demaze pricing, nothing invented. |
| 14 | `CTA` (3rd, already linked `./contact`) | Final CTA | ✅ Done — real closing line, single "Let's Connect" button. |
| 15 | `Faq` | FAQ | ✅ Done — category tabs hidden, 6th slot hidden, all 5 real Q&As populated, accordion behavior untouched. |
| — | `<header><nav>` | Branding/nav | ✅ Done (logo only) — hotlinked the real Demaze logo from demazetech.com. **No real nav link menu found**: confirmed live the hamburger icon mounts no panel in this exported build; what looked like a nav dropdown in an earlier pass was actually the footer's own Quick Links column. `navLinks`/`ctaButton` are still in `demaze-content.js` for whenever a real nav menu slot is found. |
| — | `<footer>` | Footer | ✅ Done (logo, tagline, description, first column's links, copyright). **Known limitation**: the other 3 MOVIQ link columns (Company/Resources/Legal) and the social-icon row still show MOVIQ's own content — hiding them via `display:none` is confirmed to crash React fatally on mobile (see lesson #6), so that cleanup is deliberately not done. Revisit only with a genuinely different technique, not inline style toggling on that subtree. |

**Mapping decisions worth remembering:**
- Tools & Technologies and Industries do NOT compete for the same MOVIQ slot — Tools & Tech lives in `Badge`, which freed up the `Tools`(2nd) tab+checklist structure entirely for Industries.
- The originally-planned `Products`/`Ai Powered` reorder (so "Who We Are" leads into "What Drives Us") was abandoned — see row 8 above.
- Founder testimonial has no native homepage slot in MOVIQ and isn't a real top-level section — it's nested inside Hero's own container (see row 2) because inserting a new top-level sibling section crashed React (lesson #6).
- Demaze's real industry count is **19**, not 18 — corrected mid-session after an earlier miscount; check `demaze-content.js`'s `industries.items.length` if this number is ever cited again.

## Do not reintroduce

- Old Demaze visual identity/theme/layout/colors/animations (the pre-redesign site).
- The old Demaze "sphere" visual element.
- MOVIQ's own product content (RiveUp/video-creation copy, pricing like "$29/Lifetime", the `feature-detail-page` product screenshot, etc.) — several of these were found and removed/hidden already; watch for more as later sections are built (e.g. Pricing section will have MOVIQ's actual video-tool pricing plans baked in).

## Workflow reminder

Work one section at a time. After implementing: verify (desktop/mobile/hard-refresh/new-tab, and scroll-both-directions for any animated section), report what changed with file paths, then **stop and wait for explicit approval** before moving to the next section. Don't touch unrelated sections. If Demaze has no real content for a MOVIQ slot, don't invent — ask or hide, per precedent above.
