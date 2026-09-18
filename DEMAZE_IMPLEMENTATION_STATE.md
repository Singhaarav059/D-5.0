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
- All are wired into `index.html` via `<script>` tags inside the existing `<!-- Start of bodyEnd -->` HTML comment placeholder, in this order: content.js → override-core.js → each section's override.js (hero, techstack, process, showcase, capabilities, whydemaze — process has no content dependency since it's a hide-only).

**Hard-won lessons — read before writing a new override script:**
1. **MOVIQ's own CSS often wins the specificity battle.** Its rules combine an ancestor class + the element's own class (e.g. `.framer-ScIth .framer-1a3dchp{...}`), which beats a plain single-class override (`.my-class{...}`) even though it looks like it should apply. Every new CSS class this project adds that needs to actually change a MOVIQ element's layout uses `!important` on the specific conflicting properties (confirmed the conflict first via computed-style inspection, not just adding it defensively everywhere).
2. **Framer's hydrated DOM shape varies by breakpoint/timing**, sometimes with an extra `.ssr-variant` wrapper, sometimes without. Never assume a fixed child index (`columns[1]`) — this caused a real bug in Why Demaze (grabbed the competitor column instead of "us" at a narrower viewport). Select by stable identifying content (e.g. header text) instead of position.
3. **This site uses Lenis smooth-scroll** (`window.lenis` exists). `window.scrollTo()` desyncs from what Lenis actually paints — always test scroll-driven effects with real wheel-scroll input (`computer{action:"scroll"}`), never `scrollTo`/`scrollY` assertions alone.
4. Gradient headings use `<h2><span data-text-fill>text</span></h2>` — always update the inner `span`'s text, never `h2.textContent` directly (that deletes the span and kills the gradient).
5. Always test after every change: hard refresh, brand-new tab, ~577px width, mobile (375×812), and for scroll effects, desktop-wide (1400px) with real scrolling in both directions.

## Final approved homepage structure (mapping locked in; implementing one row at a time)

| # | MOVIQ section (`data-framer-name`) | Demaze section | Status |
|---|---|---|---|
| 1 | `Hero` | Hero | ✅ Approved |
| 2 | *(new)* — borrows the quote/author card pattern from `reviews.html` | Founder testimonial (Krupal Chaudhary) | Not started. Position: right after Hero. |
| 3 | `Badge` | Technology Stack | ✅ Approved |
| 4 | `Videos making Step` | Our Process | ✅ Done — un-hidden; MOVIQ's 3-card flex row (`flex:1 0 0px` each, confirmed via computed style, no CSS rewrite needed) extended to 4 by cloning the last unhighlighted card. The 2 outer cards' 3-card-tuned `translateX(...) scale(0.9)` offset was cleared on all 4 (would misalign at the new narrower width) — even 4-card row instead, verified at desktop (1600px) and mobile (375px). See `demaze-process-override.js`. |
| 5 | `Sricpt` | Featured Projects | ✅ Approved — sticky peek-stack, custom-built. Content re-verified against current live homepage and corrected (full descriptions, live feature order, "Drag" typo fixed) — see `demaze-content.js`. |
| 6 | `Tools` (1st) | Core Capabilities | ✅ Approved — scroll-driven unfold, custom-built. |
| 7 | `CTA` (1st, "Ready to bring your brand to life on video?") | — | ✅ **Removed** (hidden) — no Demaze equivalent, redundant once the final CTA is real. |
| 8 | `Products` | Who We Are | Not started. Plan: keep heading+text editorial structure, drop the image gallery (no legitimate Demaze images), reorder to sit right before "What Drives Us" so the two read as one About moment. |
| 9 | `Ai Powered` | What Drives Us | Not started. Plan: adapt the 5-card, 2-row structure to the 4 real items (Innovation at Our Core / Client Success Obsession / Technology for Good / Continuous Learning), hide the 5th card slot, no invented images. |
| 10 | `Tools` (2nd, tab bar + checklist panel) | Industries We Serve | Not started. Plan: adapt the existing tab-select → panel-swap interaction from 3 tabs to 18 (one per industry), each panel showing that industry's real sub-item checklist. |
| 11 | `Moviq vs Traditional Video` | Why Demaze + Metrics | ✅ Approved for Why Demaze (3 cards). Metrics (45+ Projects / $10M+ Client Value / 35+ Team Members / 6+ Years) still needs to be added as a stat row within this same custom-built section — not started. |
| 12 | `CTA` (2nd, same promo copy as #7) | — | ✅ **Removed** (hidden) — duplicate promo band. |
| 13 | `Pricing` | — | ✅ **Removed entirely** (hidden) — Demaze publishes no public pricing, nothing invented. |
| 14 | `CTA` (3rd, already linked `./contact`) | Final CTA | ✅ Done — copy replaced with "Let's connect and build smarter, faster, and stronger - together." / single "Let's Connect" button to `./contact`; second button hidden. See `demaze-cta-pricing-override.js`. |
| 15 | `Faq` | FAQ | ✅ Done — category tab bar (`Basic ALl`) hidden, 6th card slot hidden, all 5 real Demaze Q&As populated (question `h6` gradient span + answer `p`), accordion click/expand behavior untouched. See `demaze-faq-override.js`. |
| — | `<header><nav>` | Branding/nav | Not started. Demaze logo + Projects/Services/About Us/Contact Us/Book A Call. |
| — | `<footer>` | Footer | Not started. Demaze tagline + Projects/Service/About us/Contact us + `contact@demazetech.com` + copyright; MOVIQ's extra columns and social icons get hidden (no Demaze equivalents confirmed). |

**Mapping decisions worth remembering:**
- Tools & Technologies and Industries do NOT compete for the same MOVIQ slot — Tools & Tech already lives in `Badge` (done), which freed up the `Tools`(2nd) tab+checklist structure entirely for Industries.
- `Products`/`Ai Powered` order is being swapped from MOVIQ's native document order so "Who We Are" leads into "What Drives Us" as one coherent About block — the only case of reordering full sections rather than just their content.
- Founder testimonial has no native homepage slot in MOVIQ; the *reviews.html* page (not the homepage) has a real author/quote card component being borrowed for this new section, rather than inventing new CSS from scratch.

## Do not reintroduce

- Old Demaze visual identity/theme/layout/colors/animations (the pre-redesign site).
- The old Demaze "sphere" visual element.
- MOVIQ's own product content (RiveUp/video-creation copy, pricing like "$29/Lifetime", the `feature-detail-page` product screenshot, etc.) — several of these were found and removed/hidden already; watch for more as later sections are built (e.g. Pricing section will have MOVIQ's actual video-tool pricing plans baked in).

## Workflow reminder

Work one section at a time. After implementing: verify (desktop/mobile/hard-refresh/new-tab, and scroll-both-directions for any animated section), report what changed with file paths, then **stop and wait for explicit approval** before moving to the next section. Don't touch unrelated sections. If Demaze has no real content for a MOVIQ slot, don't invent — ask or hide, per precedent above.
