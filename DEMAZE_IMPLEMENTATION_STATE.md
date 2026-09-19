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
6. **A `"Fatal error... NotFoundError: removeChild/insertBefore: not a child of this node"` console message from Framer's own React bundle can appear on mobile-width loads after inserting new DOM nodes into a React-owned parent, or toggling `display:none` on multiple siblings within a section that has its own responsive-breakpoint restructuring logic — but confirmed live, repeatedly, that when it appears, the page keeps rendering and working completely normally** (screenshots, `get_page_text`, and live interaction with the FAQ accordion and Industries tabs all confirmed correct *after* the error had already fired). It is NOT deterministic — the exact same code, and even a totally unmodified section, can produce it on some fresh-tab loads and not others; disabling/enabling scripts to "isolate" it produces contradictory results run to run for this reason, so don't trust a single clean or single failing run as proof either way. Treat this specific message as a noisy internal Framer log, not a ship-blocker — verify actual page behavior (render + interactivity) after seeing it before assuming something is broken. It's still worth minimizing unnecessary DOM insertion/mass-hiding where a text-only alternative exists, since it's the trigger condition even though it isn't fatal in practice.

## Homepage structure — current state (all planned sections implemented)

| # | MOVIQ section (`data-framer-name`) | Demaze section | Status |
|---|---|---|---|
| 1 | `Hero` | Hero | ✅ Done — Real H1, subcopy, CTAs, Krupal Chaudhary Testimonial; floating 3D graphic removed. |
| 2 | `Badge` | Technology Stack | ✅ Done — Infinite marquee ticker populated with 8 official AI & ML platform partner logos from demazetech.com. |
| 3 | `Videos making Step` | Our Process | ✅ Done — Mounted in native section: 4-step card grid (`Discover & Define`, `Design & Prototype`, `Build & Integrate`, `Launch & Scale`). Zero overlap. |
| 4 | `Sricpt` | Featured Projects | ✅ Done — Compact 2-column project cards with 2-column features list, fitted perfectly to single-screen view without cutoff. |
| 5 | `Tools` (1st) | Core Capabilities (Services) | ✅ Done — 4 service pillars with immediate visibility and zero white space gap. |
| 6 | `CTA` (1st) | — | ✅ **Removed** (hidden). |
| 7 | `Tools` (2nd) | Industries We Serve | ✅ Done — 19 interactive domain tabs with sub-item checklists and zero section collisions. |
| 8 | `Ai Powered` | What Drives Us | ✅ Done — 4 real value cards with bespoke high-res AI & cloud engineering graphics. |
| 9 | `Products` | Who We Are | ✅ Done — Heading, narrative text, 9 capability keyword badges, and Demaze illustration card. |
| 10 | `Moviq vs Traditional Video` | Why Demaze + Metrics | ✅ Done — 3 benefit cards with Demaze's real hosted illustration assets + stat row. |
| 11 | `CTA` (2nd) | — | ✅ **Removed** (hidden). |
| 12 | `Pricing` | — | ✅ **Removed** (hidden). |
| 13 | `CTA` (3rd) | Final CTA + Reach Us At Anytime (Contact) | ✅ Done — Closing banner + sleek 3-card frosted glass contact bar (Email, Calendly, Ahmedabad office). |
| 14 | `Faq` | FAQ | ✅ Done — "FAQS: Questions? Answers!" with all 5 verified Q&As and working interactive accordion. |
| — | `<header><nav>` | Branding/nav | ✅ Done — Demaze logo, desktop nav links (`Projects`, `Services`, `About Us`, `Contact Us`), and `Book A Call` CTA button. Clean mobile dropdown drawer. |
| — | `<footer>` | Footer | ✅ Done — Logo, tagline, description, copyright, and 4 quick links. |

## Subpages Deployed & Cross-Linked

All 4 Demaze subpages have been created and styled in `assets/demaze/demaze-subpages.css`, matching MOVIQ's signature luxury dark glass theme, floating pill navbar, smooth gradients, and interactive mobile drawer navigation:
1. `/services` (`services.html`): 4 Core Service Pillars (AI & ML, Web/Mobile/SaaS, Ecommerce, Cloud), 8 Partner Logos, 19 Industries Explorer, Reach Us At Anytime contact grid.
2. `/projects` (`projects.html`): 14 verified Demaze client case studies with high-res assets (`scale-down-to=1024`), tags, and feature pills. 0 broken images.
3. `/about-us` (`about-us.html`): Digital Transformation Architects narrative, 4 Core Values, 4 Stats Counters ($10M+ value, 45+ projects, 6+ years), and interactive Demaze FAQ accordion.
4. `/contact` (`contact.html` & `contact/index.html`): Direct contact cards (Email, Calendly 30-min strategy call, Ahmedabad office), interactive inquiry form with validation, and responsive mobile layout.

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
