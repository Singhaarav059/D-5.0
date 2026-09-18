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

## Section status (in the order actually built — some were reordered/merged live)

| # | MOVIQ section (`data-framer-name`) | Demaze section | Status |
|---|---|---|---|
| 1 | `Hero` | Hero | ✅ Approved |
| 2 | `Badge` | Technology Stack | ✅ Approved |
| 3 | `Videos making Step` | Process | ✅ Approved — **hidden entirely**, no Demaze process content exists anywhere on their site (checked homepage/services/about-us) |
| 4 | `Sricpt` | Featured Projects | ✅ Approved — rebuilt as a two-column sticky "peek-stack": left column (eyebrow+heading) pinned via `position:sticky`, right column is 4 project cards that stack/take-over on scroll. This is **custom-built logic**, not extracted from MOVIQ — confirmed via inspecting MOVIQ's actual appear-animation JSON and the live `moviq.framer.website` that no such scroll-scrubbed mechanism exists anywhere in MOVIQ. Covers the "Projects" homepage section too — don't redo it. |
| 5 | `Tools` (first one) | Core Capabilities | ✅ Approved — 4 real service categories (AI & ML / Web-Mobile-SaaS / Ecommerce / Cloud) shown as a scroll-driven "unfold" (tall sticky stage, blocks ease into a single horizontal row as you scroll, staggered, reversible). Also custom-built — same investigation applies. |
| 6 | *(none — merged into #4)* | Projects | ✅ Already covered by Featured Projects (#4). The full `/projects` listing (more projects than the homepage's 4) would be a **separate page-level task**, not part of this homepage plan. |
| 7 | `Moviq vs Traditional Video` | Why Demaze | ✅ Approved — MOVIQ's 3-column competitor-comparison table replaced with 3 real cards (icon+title+paragraph): AI-First Innovation, End-to-End Partnership, Proven Track Record. **This content lives on the Demaze homepage** (right after Industries), not `/about-us` — got this wrong once, re-verify before reusing. |
| 8 | *(TBD — likely near `Pricing`/`CTA`, or a new stat-row block)* | Metrics | ⏭️ **Next up.** Real stats already found and verified, sitting right after the Why Demaze content on the homepage: **45+ Projects Delivered, $10M+ Client Value Generated, 35+ Expert Team Members, 6+ Years of Excellence.** Haven't yet located/built the matching MOVIQ slot for this — do that first. |
| 9 | — | Industries | Not started. Real content exists: demazetech.com homepage/services has a long "Industries We Serve" list (Healthcare, Fintech, Logistics, Retail, Ecommerce, Education, BFSI, Sports & Gaming, Energy & Utility, Real Estate, Media & Entertainment, SaaS, Automotive, Food & Beverage, Legal, HR, Insurance, Social Commerce, Manufacturing — each with ~8-9 sub-items). MOVIQ likely has no matching section — will need the same "does this exist in MOVIQ" investigation before building anything custom. |
| 10 | — | About / Who We Are | Not started. Real content: "Who We Are" paragraph + "What Drives Us" (4 items: Innovation at Our Core, Client Success Obsession, Technology for Good, Continuous Learning) on `/about-us`. |
| 11 | `Pricing` | Pricing replacement | Not started. Demaze doesn't appear to publish public pricing — will likely need user direction on how to handle (hide vs. CTA-to-contact vs. other), same as Process was handled. |
| 12 | — | Testimonials replacement | Not started. Haven't checked if Demaze has any real testimonials/quotes beyond the founder quote already used in Featured Projects context. |
| 13 | `Faq` | FAQ | Not started. Demaze's `/about-us` has an FAQ section ("Questions? Answers!") — saw at least "What services do you offer?" and a repeated "How long does it take to develop an AI solution?" placeholder-looking entry; re-verify exact real Q&A content before building. |
| 14 | `CTA` (appears 3x) | CTA | Not started. |
| 15 | — | Footer | Not started. Haven't located/inspected MOVIQ's footer yet. |

## Do not reintroduce

- Old Demaze visual identity/theme/layout/colors/animations (the pre-redesign site).
- The old Demaze "sphere" visual element.
- MOVIQ's own product content (RiveUp/video-creation copy, pricing like "$29/Lifetime", the `feature-detail-page` product screenshot, etc.) — several of these were found and removed/hidden already; watch for more as later sections are built (e.g. Pricing section will have MOVIQ's actual video-tool pricing plans baked in).

## Workflow reminder

Work one section at a time. After implementing: verify (desktop/mobile/hard-refresh/new-tab, and scroll-both-directions for any animated section), report what changed with file paths, then **stop and wait for explicit approval** before moving to the next section. Don't touch unrelated sections. If Demaze has no real content for a MOVIQ slot, don't invent — ask or hide, per precedent above.
