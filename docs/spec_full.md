<USER_REQUEST>
# Demaze Technologies — Website Design & Motion Spec

**For:** Antigravity · **Codebase:** Next.js app running at `localhost:3000`
**Goal:** a production-ready Demaze site that keeps MoviQ's section order, scroll behaviour and theme, filled with Demaze's existing data.
**Reference:** https://moviq.framer.website/

Tags used in this document:

- **[OBSERVED]** seen in a screen recording of the current build
- **[MOVIQ]** taken from MoviQ's live page structure
- **[DECISION]** a design call made in this spec
- **[VERIFY]** confirm on live MoviQ in Phase 0. If MoviQ differs from my default, MoviQ wins on behaviour, order and theme

---

## 0. Ground rules (read first)

1. **Data is already in place. Do not rewrite, shorten or invent copy, stats, logos, links, prices or testimonials.** This job is layout, styling, motion and bug fixing only. If a MoviQ section has no Demaze data (pricing, comparison table, legal pages, social links), omit it and log it in `docs/OPEN_ITEMS.md`. Never fill it with placeholder content.
2. **One design system.** The home page currently uses a different nav, footer, fonts and spacing than the inner pages. The inner pages (the `/projects` header and nav pill) are the cleaner baseline. The home page moves toward them.
3. **Inspect the repo before coding.** Follow its existing conventions (styling approach, component folders, image handling). Find out how the home page is rendered. It still shows a "Made in Framer" badge, so the Framer-generated markup may still be embedded. Rebuild it as native components and remove the badge.
4. **Work in phases** (section 1). Commit per phase. Show screenshots at the end of each phase before moving on.
5. **Animate only `transform` and `opacity`.** A small `blur()` on reveals is allowed. Never animate layout properties.
6. **Every animation has a `prefers-reduced-motion` fallback** (section 3.7).
7. Verify at **1920, 1440, 1024, 768 and 390 px** wide, in the browser, with screenshots.

---

## 1. Phase plan

**Phase 0: Audit (no code changes)**
- Open MoviQ in the browser at 1440×900 and 390×844. Scroll slowly through the whole page.
- For each of the 16 MoviQ sections in section 4.1, record: container width, section padding, grid columns and gaps, type sizes, scroll behaviour (sticky, pinned, parallax, reveal), hover and active states, durations and easings, and the mobile layout.
- Save the results to `docs/moviq-audit.md` with screenshots. Wherever it contradicts a **[VERIFY]** default below, MoviQ wins.
- Audit the repo: how the home page is rendered, where the "Made in Framer" badge comes from, existing colour, font and spacing values, and which shared components already exist.

**Phase 1: Foundation.** Tokens, type, layout shell, nav, footer, shared components (section header, buttons, cards, CTA banner, contact cards, marquee, accordion, reveal wrapper).

**Phase 2: Home page.** Sections in the order of section 4.2, one at a time.

**Phase 3: Inner pages.** `/projects`, `/services`, `/about-us`, `/contact` (section 5).

**Phase 4: QA.** Punch list (section 6), then performance, accessibility and SEO checks (section 7).

---

## 2. What exists today vs MoviQ

### 2.1 MoviQ section order [MOVIQ]

| # | MoviQ section | Pattern |
|---|---|---|
| 1 | Nav | Logo, Home / Features / Integration / Pricing / Pages, "Get Started" CTA |
| 2 | Hero | Announcement pill with badge, H1, two CTAs, large product mockup over a background image |
| 3 | "Trusted by 100,000+…" | Small heading and an infinite logo marquee |
| 4 | "Make pro videos in 3 simple steps" | H2 and sub line, 3 step cards (icon, title, text, "Step N") |
| 5 | "See your script turn into a video" | H2, sub line, two-image product demo showcase |
| 6 | "Tools to bring your ideas to life" | H2, sub line, 6 feature cards (icon, title, one-liner) |
| 7 | CTA banner | Background image, H2, sub line, two buttons |
| 8 | "AI Video Creation" | 4-tab section: title, description, 8-item checklist, large image per tab |
| 9 | "AI-Powered UGC. Better Ads." | Bento grid of 5 mixed-size cards |
| 10 | "AI-Powered Product Assets…" | 9-image gallery |
| 11 | "Moviq vs traditional video" | 2-column comparison table with check and cross icons |
| 12 | CTA banner | Same pattern as #7 |
| 13 | Pricing | Monthly / Annually toggle, 3 cards, middle one badged "Popular" |
| 14 | CTA banner | Same pattern as #7 |
| 15 | FAQ | H2, sub line, category tabs, accordion |
| 16 | Footer | Brand blurb, 4 link columns, socials, copyright and credit |

Every MoviQ section opens with a centred **H2 + one-line sub**. Repeat that pattern wherever Demaze already has a sub line. Do not write new sub lines.

### 2.2 Current Demaze home page [OBSERVED]

Order today: Hero → founder quote → Tools & Technologies → Our Process → Our Work → Services → Industries We Serve → What Drives Us → company chips + visual → Why Choose Us + stats → Contact → FAQ → Footer.

What works and must be kept:
- The hero as a rounded image card with the next panel sliding over it.
- Our Work: a sticky left title with project cards stacking on the right.
- The sequential card reveal in Services.
- The soft lavender palette, black pill buttons and indigo accents on the inner pages.

What is broken is listed in section 6. The worst ones:
- The "Continuous Learning" card collapses to about 10px wide and prints one character per line for roughly 8 seconds of scrolling.
- The same collapse hits the contact banner's tagline.
- There are large blank stretches.
- The nav and footer differ between home and inner pages.
- Three type systems are in use.
- Body content spans about 1790px on a 1920px screen with no max-width.

---

## 3. Design system

Values marked "measured" were sampled from pixels in the recording. Prefer any existing token in the repo that already matches. Only introduce new tokens for the gaps.

### 3.1 Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Default surface |
| `--bg-soft` | `#F8F6FE` (measured) | Alternating section bg, inner page bg |
| `--ink` | `#0B0E17` (measured) | Headings, primary buttons |
| `--ink-2` | `#3F4454` | Body text |
| `--ink-3` | `#6B7080` | Muted text and captions (contrast ≥ 4.5:1 on white and on `--bg-soft`) |
| `--line` | `#E7E7F3` (measured) | 1px borders and dividers |
| `--brand` | `#5B4FE9` (measured on step badges, stats, eyebrows) | Accent |
| `--brand-deep` | `#212251` (measured, end of the "did!" gradient) | Deep end of accent gradients |
| `--brand-tint` | `#F0EEFF` | Icon tiles, chips, selected states |
| `--brand-glow` | `#A89EEF` (measured, project card gradient) | Card art gradients |
| `--gradient-accent` | Reuse the blue → violet → magenta gradient already in the repo (roughly `#2A66DE → #7A4FE6 → #C23BD0`) | Accent words in headings only |

**Gradient text rule [DECISION].** Today every H2 on the home page is fully gradient. That is too loud. Headings are solid `--ink`, and only the **accent word or phrase** gets the gradient. This matches how `/projects` ("The Project we **did!**") and `/contact` already do it.

- The Project we **did!**
- Apps, websites, **AI and more**
- Industries **We Serve**
- What **Drives Us**
- Why **Choose Us**
- Questions? **Answers!**
- Reach Us At **Anytime**

### 3.2 Typography [DECISION]

One family: **Inter** (variable, via `next/font`, `display: swap`). The current build mixes Inter, a geometric display face and Arial. Remove the other two. If the Phase 0 audit shows MoviQ uses a specific free Google font, use that instead for headings only.

| Role | Size | Line height | Weight | Tracking |
|---|---|---|---|---|
| H1 | `clamp(38px, 4.8vw, 68px)` | 1.05 | 700 | -0.03em |
| H2 | `clamp(30px, 3.8vw, 48px)` | 1.1 | 700 | -0.025em |
| H3 | 22–24px | 1.25 | 600 | -0.01em |
| Body large (sub lines, hero text) | 18–20px | 1.6 | 400 | 0 |
| Body | 16px | 1.65 | 400 | 0 |
| Small | 14px | 1.55 | 400–500 | 0 |
| Eyebrow | 12px, uppercase | 1 | 600 | 0.12em |

- Headings: `text-wrap: balance`, max 20ch.
- Paragraphs: max 62ch.
- Eyebrow: pill with 1px `--line` border, bg `#F0F4F8` (measured), text `--brand`, padding 6px 14px, radius 999.

### 3.3 Layout

- **Container:** `max-width: 1280px`, inline padding `clamp(20px, 4vw, 40px)`, centred. **This replaces the current full-bleed layout** (content is about 1790px wide at 1920px today).
- **Grid:** 12 columns, gap 24px desktop and 16px mobile.
- **Section padding (block):** 120px ≥1024, 88px 768–1023, 64px below 768.
- **Section header block** (eyebrow → H2 → sub): centred, max-width 720px, 56px space below on desktop, 40px on mobile. Eyebrow-to-H2 gap 16px, H2-to-sub gap 16px.
- **Radii:** 10 / 16 / 24 / 32 / 40 (hero and CTA panels) / 999 (pills).
- **Breakpoints:** 1280, 1024, 768, 480.

### 3.4 Surfaces and elevation

- **Card:** bg white, 1px `--line` border, radius 24, padding 28–32.
- **Shadow rest:** `0 1px 2px rgba(11,14,23,.04), 0 12px 32px -8px rgba(60,50,140,.12)`
- **Shadow hover:** `0 24px 48px -12px rgba(60,50,140,.22)` with `translateY(-4px)`.
- **Alternating section bg:** white, `--bg-soft`, white… Never two soft sections in a row.
- **Inner page bg:** `--bg-soft` with two soft radial glows (`--brand-glow` at 18% opacity) top-centre and top-right. This is the look `/projects` already has.

### 3.5 Buttons

- **Primary:** bg `--ink`, text white, height 48px (44px in compact contexts), padding 0 24px, radius 999, 15px / 600. Arrow icon slides +3px on hover. Active `scale(.98)`. Focus ring `0 0 0 3px` `--brand` at 40% with 2px offset.
- **Secondary:** white bg, 1px `--line` border, `--ink` text. Same size and hover.
- **Hero variants:** primary is `--ink` with a white circular arrow chip; secondary is white. Do not clip the label. It currently renders "Let's Conne" [OBSERVED].
- All CTAs across the site use the same black. The Services page currently uses a navy button [OBSERVED].

### 3.6 Icons

Use one icon set (lucide) at 1.75 stroke. 20–24px inline, 24px in 48px tiles (radius 14, bg `--brand-tint`, stroke `--brand`). Never leave placeholder squares or near-invisible outline icons [OBSERVED in Services and Why Choose Us].

### 3.7 Motion tokens

```
--ease-out: cubic-bezier(.22, 1, .36, 1);
--dur-fast: 150ms;  --dur-base: 300ms;  --dur-slow: 700ms;
```

| Pattern | Spec |
|---|---|
| Scroll reveal (default) | `opacity 0→1, y 24px→0, blur 6px→0`, 700ms `--ease-out`, trigger at 15% in view, once. Children stagger 70ms. |
| Card hover | `translateY(-4px)` + hover shadow, 300ms. Icon tile bg goes to `--brand`, glyph to white. |
| Link and button arrow | +3px on hover, 200ms. |
| Marquee | 40s linear infinite, pauses on hover, edge fade masks. |
| Accordion | Height auto 300ms `--ease-out` + opacity, plus icon rotate 45°. |
| Tab or panel swap | Crossfade 200ms plus 8px y-shift, `AnimatePresence mode="wait"`. |
| Count-up | 1600ms ease-out-expo, once at 40% in view, `font-variant-numeric: tabular-nums`. |

**Reduced motion** (`prefers-reduced-motion: reduce`):
- Reveal becomes a plain 200ms fade.
- Marquee stops and logos wrap into a static grid.
- Sticky-stack, parallax and curtain effects fall back to normal flow.
- Count-up shows the final number.

Suggested implementation: Framer Motion (`motion`) for reveals, tabs and accordion. Pure CSS `position: sticky` for the hero curtain and project stack. Add Lenis only if the Phase 0 audit shows MoviQ uses smooth scroll **[VERIFY]**. Lenis can fight `sticky`, so test the stacked sections if you add it.

---

## 4. Home page

### 4.1 Global shell

#### Navigation

- **Structure:** floating pill, `position: fixed; top: 16px`, centred, `max-width: 1160px`, height 64px, radius 999, padding `0 12px 0 24px`. Logo left, links centred (Projects, Services, About Us, Contact Us), "Book A Call" right. Copy comes from the existing nav data.
- **Two states, one component [DECISION]:**
  - **Over the hero (scrollY < 40):** glass. bg `rgba(255,255,255,.14)`, `backdrop-filter: blur(16px) saturate(140%)`, border `1px rgba(255,255,255,.35)`. **White** wordmark, white links, white "Book A Call" pill with ink text. The current wordmark is black on dark glass and the links are white [OBSERVED]. Use a white logo variant.
  - **Scrolled:** bg `rgba(255,255,255,.92)`, blur 16px, `--line` border, soft shadow, ink text, black "Book A Call" pill. The current scrolled state is a muddy grey pill with white text at about 2.8:1 contrast, which fails AA [OBSERVED].
  - Transition between states: 250ms.
- **Active link:** 2px underline in `--ink`, 6px offset (as on the inner pages today).
- **Mobile (<768):** logo plus hamburger. Opens a full-height sheet with large links and a full-width "Book A Call". Lock body scroll while open, trap focus, Esc closes.

#### Footer

- **Bg:** `--bg-soft`, 1px `--line` top border, padding 80px 0 32px.
- **Grid (12 col):** Brand (span 5): logo plus the existing blurb ("We combine AI, software engineering, and automation…"). Navigation (span 2): Projects, Services, About us, Contact us. Services (span 2): the four service pillar names, anchored to `/services`. Get in touch (span 3): email, Calendly link, office address, all from existing data.
- **Bottom bar:** `© {new Date().getFullYear()} Demaze Technologies. All rights reserved.` on the left. The footer currently says "© 2025" [OBSERVED]. Use the dynamic year.
- **Tagline:** one tagline site-wide. `/projects` says "Engineered for Reliability & Scale" while Services, About and Contact say "Empowering AI Innovation Worldwide" [OBSERVED]. Use the majority one ("Empowering AI Innovation Worldwide").
- **Do not** add social icons or legal links unless real URLs and pages exist. MoviQ's are generic placeholders. Do not copy that.
- Home currently shows a different, unstyled footer (tiny default-font text, mismatched link column) [OBSERVED]. Delete it.

### 4.2 Home section order (final)

| # | Demaze section | Replaces / maps to MoviQ | Change from today |
|---|---|---|---|
| 1 | Hero | #2 Hero | Legibility fixes, product peek added |
| 2 | Tools & Technologies marquee | #3 Trusted-by marquee | **Moved up** (was after the quote) |
| 3 | Our Process | #4 3 steps | Now 4 steps, same card pattern |
| 4 | Our Work | #5 Demo showcase | Keep sticky stack, fix dead space |
| 5 | Services | #6 Tools grid | Icons and card system |
| 6 | CTA banner A: "Have a bold product vision in mind?" | #7 CTA banner | **New placement**. Copy already exists on `/projects`. |
| 7 | Industries We Serve | #8 Tabbed section | Hover panel becomes a tabbed panel |
| 8 | What Drives Us | #9 Bento | Broken horizontal scroll becomes a bento grid |
| 9 | About Demaze (chips + visual) | #10 Gallery slot | 2-column layout |
| 10 | Why Choose Us + stats | #11 Comparison slot | Cards and stat strip |
| 11 | Founder quote | #13 Pricing slot | **Moved down** (was after hero) |
| 12 | Contact banner: "Reach Us At Anytime" | #14 CTA banner | Fix height, cards |
| 13 | FAQ | #15 FAQ | Remove faded rows, centre sub line |
| 14 | Footer | #16 Footer | Unified |

Two MoviQ sections are deliberately not mirrored:
- **Pricing (#13).** Demaze has no pricing data. Do not invent tiers.
- **Comparison table (#11).** Demaze has no data comparing itself to alternatives. Do not invent claims.

Ship two CTA banners instead of MoviQ's three, because the third slot is used by the founder quote.

---

### 4.3 Section specs

#### 1. Hero

- **Layout [OBSERVED, kept]:** rounded image card (radius 32) inset 12px from the viewport edges, `min-height: min(100svh, 940px)`. Content centred, top padding 160px to clear the nav.
- **Background:** keep the existing tulip-sky photo. It is the only unmistakably Demaze brand asset in the build. Add a legibility scrim: `linear-gradient(180deg, rgba(6,20,60,.35) 0%, rgba(6,20,60,.10) 40%, rgba(6,20,60,.55) 100%)`. Serve as AVIF/WebP via `next/image` with `priority`.
- **Content stack (order and copy unchanged):** eyebrow glass pill ("Expertise | Innovation | Partnership") → H1 → paragraph → two CTAs ("Let's Connect ↗", "Explore Services").
- **H1:** white, 2 lines at ≥1280px (`max-width: 1240px`, `text-wrap: balance`), 3–4 lines on mobile.
- **Paragraph:** **centred** (it is left-aligned and ghosted over the flowers today [OBSERVED]), white at 90%, 18–20px, max-width 640px, `text-shadow: 0 1px 12px rgba(0,0,0,.25)`.
- **Product peek [MOVIQ, DECISION]:** MoviQ overlaps a large product mockup on the hero's lower edge. Do the same with an **existing** project image (the luxury-car app phones mockup from `/projects`). Centred, `max-width: 880px`, overlapping the bottom of the hero by about 120px. Gentle float: `translateY` ±6px over 6s, ease-in-out infinite. Skip this if the asset is not usable. Do not create fake UI.
- **Load animation:** eyebrow first (0ms), then H1 by line mask reveal (each line `y: 100%→0`, 700ms, stagger 90ms), then paragraph (fade up, 200ms delay), then buttons (350ms delay). Background image scale 1.08→1 over 1.6s.
- **Scroll [OBSERVED behaviour, kept]:** curtain effect, described in section 4.4. The hero content fades to 40% and scales to 0.98 as the next panel rises.

#### 2. Tools & Technologies (marquee)

- **Role:** MoviQ's "Trusted by" strip. It is the panel that slides over the hero (radius `32px 32px 0 0`, white, overlapping the hero by 32px).
- **Heading [MOVIQ]:** small centred label, 18–20px, weight 500, `--ink-3` ("Tools & Technologies"). Currently an oversized H2 in a different font [OBSERVED].
- **Items:** each logo plus name inline as one chip (icon 28px, name 15px / 500), all on one shared baseline. Labels are misaligned today (TensorFlow sits higher than its label) and "Pinecone" is clipped at the edge [OBSERVED].
- **Logos:** grayscale at 60% opacity, full colour at 100% on hover.
- **Marquee:** track contains the list twice, `translateX(-50%)` loop, 40s linear infinite, `gap: 64px`. Edge fade: `mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)`. Pause on hover.
- **Fix:** the same component renders as a giant vertical stack of 100px logos on `/services` [OBSERVED]. Fix the shared component (fixed 28px icon height, `width: auto`, `flex-shrink: 0`).

#### 3. Our Process

- **Header:** centred H2 "Our Process". Add a sub line only if one exists in data.
- **Grid:** 4 columns ≥1024, 2 columns 768–1023, 1 column below. Equal heights (`align-items: stretch`).
- **Card:** standard card. Number badge 36px circle, bg `--brand`, white number. Title 20/600. Description 15/1.6 `--ink-3`. Add a small "Step 0N" eyebrow only if it matches the data.
- **Connector [DECISION]:** on desktop, a 1px dashed `--line` line runs behind the four badges. It draws from left to right (`scaleX 0→1`, 900ms) when the section enters view.
- **Motion:** default reveal with 80ms stagger. Standard card hover.
- **Fix:** titles and descriptions are Arial-like today. Use Inter.

#### 4. Our Work

- **Layout [OBSERVED, kept]:** 12 columns. Left (span 4) is sticky at `top: 120px` with: eyebrow "OUR WORK" (centred above the H2, not floating loose), H2 "The Project we **did!**", and a primary button "View all work →" (to `/projects`). Right (span 8) holds the stack of project cards.
- **Cards:** show the 4 currently featured projects (luxury car dealers, case management, luxury eCommerce, senior engagement). The other four stay on `/projects`.
- **Card layout:** white, radius 28, padding 32, two columns (text 55% / image 45%). Image sits on a tinted gradient panel (`--brand-tint` → `--brand-glow`), radius 20, `object-fit: contain`. Title 28/600. Description clamped to 4 lines with an ellipsis. Text is cut mid-sentence today [OBSERVED]. Checklist in 2 columns with 16px `--brand` check-circle icons.
- **Stack behaviour:** each card is `position: sticky; top: calc(112px + var(--i) * 20px)`. As the next card covers it, the previous card scales to `1 - 0.03 × depth` and dims slightly (`brightness(.97)`). Use motion `useScroll`, or CSS `animation-timeline: view()` as progressive enhancement. Desktop only (≥1024px).
- **Fix dead space:** roughly one viewport of blank white sits between the last card and "SERVICES" [OBSERVED]. The section must end when the last card releases. Bottom padding 120px max.
- **Mobile / tablet:** no sticky-left, no stacking. Heading and button on top, cards in normal flow, image above text.

#### 5. Services

- **Header:** eyebrow "SERVICES" centred above the H2, H2 "Apps, websites, **AI and more**".
- **Grid:** 4 columns ≥1200, 2×2 at 768–1199, 1 column below. The 4th card ("Cloud") is clipped at the right edge today [OBSERVED].
- **Card:** icon tile (section 3.6): AI & ML → Brain, Web / Mobile App / SaaS → Layers, Ecommerce → ShoppingBag, Cloud → Cloud. Title 22/600. Description 15/1.6. 1px `--line` divider. First **4** bullets with 14px `--brand` check icons, then an "Explore →" link to `/services`. The full lists stay in the data and appear on `/services`.
- **Motion:** reveal stagger 100ms. Card hover per section 3.4. Text must be full contrast at rest. It is ghosted grey during the reveal today [OBSERVED]. Fade the whole card, not the text colour.

#### 6. CTA banner A

- **Copy:** "Have a bold product vision in mind?" / "Let's discuss how Demaze Technologies can architect and engineer your next breakthrough digital product." / button "Book A Strategy Session →". All already exist on `/projects`.
- **Layout [MOVIQ]:** container-width panel, radius 40, `min-height: 360px`, background image with dark overlay, content centred. Use a different crop of the existing tulip-sky asset than the hero and contact banner (for example the flower field at the bottom).
- **Button:** white pill, ink text. Background moves up to 10% (parallax) on scroll. Content uses the default reveal.
- This is a **shared component** (`<CtaBanner heading sub cta />`). It replaces the unstyled "Have a bold product vision…" / "Let's connect and build smarter, faster, and stronger - together." blocks on `/projects`, `/about-us`, `/services` and `/contact` [OBSERVED], where heading and sub line are misaligned and the button is stranded left. Copy stays per page.

#### 7. Industries We Serve

- **Header:** eyebrow "INDUSTRIES" and H2 "Industries **We Serve**".
- **Chips:** the 19 industry names (Healthcare, Fintech, Logistics, Retail, Ecommerce, Education, BFSI Solutions, Sports & Gaming, Energy & Utility, Real Estate, Media & Entertainment, SaaS Products, Automotive, Food & Beverage, Legal & Professional Services, Human Resources, Insurance, Social Commerce, Manufacturing & B2B) become a centred, wrapped chip cloud (max 3 rows). Chip: height 40, padding 0 18px, radius 999, 1px `--line`, 15/500. Selected: bg `--brand-tint`, border `--brand`, text `--brand`. Remove the inconsistent gradient underlines, which appear under only some names today [OBSERVED].
- **Interaction:** click or keyboard selects (`role="tablist"` / `role="tab"`, arrow-key navigation). Desktop hover selects after a 120ms intent delay. The current hover-only behaviour fails on touch [OBSERVED]. Default selection: Healthcare.
- **Panel (below the chips, fixed `min-height: 380px` to avoid layout shift):** standard card with a `--brand` 1px border at 20%, radius 28, padding 40. Two columns. Left: industry name in accent gradient (H3 size up to 32px) and a 2-column checklist (for Healthcare: Telemedicine Platforms, Electronic Health Records (EHR), Patient Management Systems, Appointment Scheduling Software, Healthcare Analytics Platforms, Wellness Tracking Applications). Right: visual.
- **Visual [DECISION]:** the current image is a cartoon flower meadow [OBSERVED], which has nothing to do with Healthcare. Map industries to **existing project images** where one exists (Automotive → car-dealer app, Legal → case management, Fintech → payment platform, Education → LMS, Media → AI storyboard, Retail and Ecommerce → luxury eCommerce). For the rest, use a soft brand-gradient tile with the industry's icon. No stock people.
- **Missing data:** confirm every industry has a data object. For any that lacks one, show the industry name and a "Talk to us about {industry}" link to `/contact`. Do not invent use-cases.
- **Motion:** panel content crossfades (200ms plus 8px y-shift).

#### 8. What Drives Us (bento)

- **Header:** H2 "What **Drives Us**". Add an eyebrow only if one exists.
- **Replaces** the broken pinned horizontal scroll [OBSERVED] with a bento grid, 12 columns, `grid-auto-rows: minmax(320px, auto)`, gap 24:

| Card | Columns | Visual |
|---|---|---|
| Innovation at Our Core | 7 | Two overlapping rounded image tiles with the existing gradient swap-icon between them |
| Client Success Obsession | 5 | Image |
| Technology for Good | 5 | Image |
| Continuous Learning | 7 | CSS-only visual: concentric brand-gradient rings or orb, since there is no image today |

- **Card:** radius 28, padding 32, 1px `--line`. Card 1 uses a `--brand-tint` → white gradient bg. Title 24/600, text 15/1.65 max 44ch, visual anchored to the bottom.
- **Use the existing copy strings.** Do not retype them. The "Continuous Learning" text is currently wrapped into a ~10px column, one character per line [OBSERVED at about 0:27–0:35]. Find the width/flex rule causing that collapse and delete it.
- **Images:** the current ones (a woman with a RØDE microphone, a teal VR figure, a neon circuit) look like generic template imagery and do not communicate Demaze's work [OBSERVED]. Replace them with abstract brand-gradient or vector graphics, or existing project screenshots. Do not ship template or stock imagery that may not be licensed for this site.
- **Motion:** stagger reveal, hover lift, inner image scales 1.03 over 600ms.
- **Mobile:** single column.

#### 9. About Demaze

- **Layout:** two columns (copy left span 6, visual right span 6), stacked below 1024.
- **Copy:** H2 and paragraph from the existing about content ("Founded with a vision to democratize advanced technology…"). Below it, the chip cloud: Scalable Solutions, Digital Transformation, Future-Ready Architecture, Automation Excellence, Strategic Partnership, Cutting-Edge Technology, Business Intelligence, Agile Development, End-to-End Solutions. Chips are 13/600, bg `--brand-tint`, 1px border `--brand` at 20%, padding 8px 14px, radius 999, max 3 rows.
- **Visual (soft-UI / neumorphic, kept as a brand motif):** the two scalloped emboss shapes plus the white rounded card carrying the Demaze chevron, with floating icon tiles around it (chart, cubes, trend line, target, people). The white card is a blank square today [OBSERVED]. Give it intent: the chevron centred with a subtle brand-gradient ring.
- **Motion:** icon tiles float ±6px over 6s with staggered delays. Scallop shapes rotate 30s linear infinite (very subtle).

#### 10. Why Choose Us + stats

- **Header:** eyebrow "BENEFITS", H2 "Why **Choose Us**".
- **Cards (3):** AI-First Innovation, End-to-End Partnership, Proven Track Record. Standard card, icon tile per section 3.6 (the current outline icons are near-invisible light grey [OBSERVED]), title 22/600, text 15/1.65. Grid 3 columns ≥1024, 1 column below.
- **Stat strip:** hairline `--line` above, 4 stats: 45+ Projects Delivered, $10M+ Client Value Generated, 35+ Expert Team Members, 6+ Years of Excellence. Number 56px/700 in `--brand` (gradient optional), label 14px `--ink-3`. Vertical dividers between stats on desktop, 2×2 on mobile.
- **Motion:** count-up per section 3.7. Cards use the default reveal. Make sure nothing overlaps the stats. The Framer badge overlapped them in the recording [OBSERVED].

#### 11. Founder quote

- **Layout:** centred, max-width 880px, on `--bg-soft` with a faint radial `--brand-glow` behind. Large quote glyph in `--brand` above.
- **Type:** 32–40px / 1.3, weight 500, `--ink`, tracking -0.02em. It is Arial at about 30px today [OBSERVED].
- **Author chip:** avatar 40px, name and role from the existing data ("Founder & CEO"), in a pill with a soft shadow.
- **Motion [DECISION]:** scroll-linked word reveal. Each word goes from 25% to 100% opacity as the section passes through the viewport. Static under reduced motion.

#### 12. Contact banner ("Reach Us At Anytime")

- **Layout:** container-width panel, radius 40, **fixed height** (about 640px desktop). It currently runs more than a full viewport of blurry butterfly imagery with nothing on it [OBSERVED at about 0:40–0:41]. Background: the existing tulip-sky/butterfly image with a light overlay, parallax up to 10%.
- **Content:** eyebrow pill "Contact", H2 white "Reach Us At **Anytime**", three cards in a row (stacked on mobile):
  - Email: contact@demazetech.com, "Feel free to email us if you have any questions or need more details!", "Send Email →" (`mailto:`)
  - Meeting: Book with Calendly, "Feel free to book a call if that's more convenient and easier for you.", "Schedule Call →"
  - Location: Ahmedabad, India, the existing address, "View Location →"
- **Contact card:** white, radius 20, padding 24. Icon chip top-left (40px, radius 12, `--brand-tint`), tag pill top-right (EMAIL / MEETING / LOCATION), title 18/600, text 14/1.55, brand-coloured link with arrow. Hover lift.
- **Fix:** the tagline "Let's build smarter, faster, and stronger - together" prints vertically at the left edge [OBSERVED at about 0:40]. Same width-collapse bug as What Drives Us.
- **This card row is a shared component.** It replaces the raw purple-underlined links ("Email Us contact@demazetech.com Feel free to email us…", "Office Location Ahmedabad, India A 804…") visible at the bottom of `/projects`, `/services`, `/about-us` and on `/contact` [OBSERVED].

#### 13. FAQ

- **Header:** H2 "Questions? **Answers!**" and the existing sub line "Helpful answers for a smoother experience", both **centred**. The sub line is tiny and left-shifted today [OBSERVED].
- **Accordion:** max-width 820px, centred. Each item is a card: white, 1px `--line`, radius 20, padding 22px 28px, gap 12px. Question 18/600 with a `+` icon that rotates 45° to `×` when open. Open state: border `--brand` at 30%, question text in accent gradient. Single-open behaviour, first item open by default. Animation per section 3.7. Use `<button aria-expanded aria-controls>`.
- **Remove** the scroll-linked opacity fade on the rows [OBSERVED]. It makes questions unreadable.
- **No category tabs.** MoviQ has them, but the Demaze FAQ has no categories and I won't invent any.
- **SEO:** add `FAQPage` JSON-LD generated from the same data.

#### 14. Footer

See section 4.1.

---

### 4.4 Key behaviours: reference implementations

**Hero curtain** (the hero and first panel share a wrapper so sticky releases at the end):

```css
.hero-scene { position: relative; }
.hero { position: sticky; top: 0; height: min(100svh, 940px); }
.curtain {
  position: relative; z-index: 2;
  margin-top: -32px;
  border-radius: 32px 32px 0 0;
  background: #fff;
}
```

**Project stack:**

```css
.stack-card { position: sticky; top: calc(112px + var(--i) * 20px); }
.stack { padding-bottom: 20vh; }   /* keeps the last card pinned briefly, then releases */
```

**Marquee:**

```css
.marquee { overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.marquee-track { display: flex; gap: 64px; width: max-content;
  animation: marquee 40s linear infinite; }
.marquee:hover .marquee-track { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }  /* track holds the list twice */
```

---

## 5. Inner pages

Shared page-header pattern (as on `/projects` today): eyebrow pill → H1 with an accent word → sub line (existing copy) → optional primary CTA. Clear the nav with 140px top padding. Bg per section 3.4.

### /projects
- Keep the header and the 2-column card grid. This is the design baseline.
- **Cards:** image area on a **tinted gradient** with a consistent 16:11 aspect ratio. The second card's flat grey background is dull [OBSERVED]. Category chip (AUTOMOTIVE & AI, LEGAL TECH & AUTOMATION, FINTECH, FINANCIAL AI, EDTECH, GENERATIVE AI & MEDIA…), title 24/600, description 15/1.6, tag chips.
- **Hover:** card lifts, image scales 1.04. Make cards links only if case-study pages exist.
- **Optional polish:** filter chips by category (data already exists).
- Bottom: shared `<CtaBanner />`, shared contact cards, footer.

### /services
- **Pillars** ("PILLAR 01… AI & Machine Learning, PILLAR 02… Web, Mobile App & SaaS", and the rest) are unstyled today: default bullets, cramped 12px text [OBSERVED]. Rebuild as alternating 2-column feature rows following MoviQ's tabbed-section pattern: eyebrow "PILLAR 0N", H3, description, 2-column checklist with check icons, visual tile on the alternating side. Full bullet lists live here.
- **Tools & Technologies:** shared marquee component (fixes the giant vertical logo stack).
- The "Discuss Your Architecture →" button becomes standard primary black (currently navy).
- Bottom: shared `<CtaBanner />`, contact cards, footer.

### /about-us
- **Hero bug:** the H1 ("…Complex Te[chnical] Possibilities with Measurable Business Outcomes") is squeezed into a ~250px column and overlapped by the nav [OBSERVED]. Use a centred H1, max-width 900px, or a 2-column header with the H1 in at least 6 columns.
- Compose from the shared home components: About Demaze (full version), What Drives Us bento, Why Choose Us + stats, FAQ, `<CtaBanner />`, contact cards, footer. Do not duplicate content blocks with different styling. One component, one look.

### /contact
- Header: eyebrow "GET IN TOUCH", H1 "Reach Us At **Anytime**", existing sub line.
- **Two columns:** left = the three shared contact cards stacked, plus "We guarantee a response within 24 hours." Right = the "Send Us A Message" form card.
- **Form (keep the existing fields and submit handler; do not rewire the endpoint):** label 14/600, input height 48, radius 14, 1px `#E4E2F2` border, focus ring `0 0 0 3px` `--brand` at 20%. Inline validation errors, submit button loading state, success state, honeypot field, disabled-while-submitting.
- Bottom: `<CtaBanner />` (existing "Let's connect and build smarter, faster, and stronger - together." copy with its "Email Us Directly" button), footer.

---

## 6. Bug punch list from the recording

Approximate times in the screen recording. All must be fixed.

| Time | Where | Issue |
|---|---|---|
| 0:00–0:10 | Home hero | Paragraph is left-aligned, ghosted and low contrast over the flowers. "Let's Connect" label clipped. Nav wordmark dark on dark glass. "Made in Framer" badge visible on every home frame. |
| 0:10–0:12 | Founder quote | Arial instead of Inter, small for a pull-quote. Sits in the wrong slot (should follow Why Choose Us). |
| 0:12–0:14 | Tools | Oversized H2 in a different font. Logo/label baselines misaligned, "Pinecone" clipped at the edge. |
| 0:16–0:19 | Our Work | Description text cut mid-sentence. Eyebrow floats loose. |
| 0:19 | After Our Work | Roughly a screen of blank white before Services. |
| 0:20–0:21 | Services | Icons are washed-out placeholders. Text ghosted. 4th card clipped at right. |
| 0:22–0:24 | Industries | Inconsistent underlines. Hover-only. Panel image is an unrelated flower meadow. |
| 0:24–0:26 | What Drives Us | Card 2 overlaps card 1's edge. Irrelevant template imagery. |
| 0:27–0:35 | What Drives Us | "Continuous Learning" collapses to a ~10px column, one character per line, ~8 seconds of dead scroll. |
| 0:36 | About visual | Blank white square where content should be. |
| 0:37–0:39 | Why Choose Us | Icons near-invisible. Stats overlapped by the Framer badge. |
| 0:39–0:41 | Contact banner | Tagline collapses to vertical text at the left edge. Background image runs more than a full screen. |
| 0:41–0:43 | FAQ | Scroll-linked fade makes rows unreadable. Sub line tiny and left-shifted. |
| 0:43–0:45 | Home footer | Unstyled default-font text, mismatched link column, "© 2025". |
| 0:45+ | Nav (inner pages) | Different from the home nav (white pill vs muddy grey glass). |
| ~0:52 | `/projects` bottom | CTA block unstyled: heading and sub misaligned, button stranded left. |
| ~0:56–0:58 | `/services` | Pillar cards unstyled with default bullets. Tools logos render as a giant vertical stack. Navy button. |
| ~1:02 | `/about-us` | H1 squeezed into a ~250px column and overlapped by the nav. |
| ~1:04–1:10 | About, Contact | Raw purple-underlined default-style contact links. CTA heading and sub misaligned. |
| All | Footer | Two different taglines. Copyright year hard-coded to 2025. |
| All | Layout | No max-width: content spans about 1790px at 1920px. |

---

## 7. QA and acceptance

**Layout and behaviour**
- No "Made in Framer" badge anywhere.
- No text wrapping one character per line at any width.
- No section has more than about 20% of a viewport of empty space above or below its content.
- Single nav, single footer, identical on all pages.
- Sticky and stack effects release cleanly. There is no scroll-trap on mobile.
- Tabs, accordion and marquee work with keyboard only.

**Performance (Lighthouse, desktop, production build)**
- Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- CLS < 0.05, LCP < 2.5s.
- Hero image: AVIF/WebP, `priority`, correct `sizes`. All others lazy. Every image has width and height.
- `backdrop-filter` limited to the nav. No `will-change` except during active animation.

**Accessibility**
- All text meets WCAG AA contrast. Check nav states, hero paragraph over the image, and `--ink-3` on `--bg-soft`.
- Visible `:focus-visible` on everything interactive. Skip-to-content link.
- One `<h1>` per page, correct heading order. Descriptive alt text.
- `prefers-reduced-motion` verified.

**SEO**
- Unique `<title>` and meta description per page. OG image (hero) and Twitter card. Canonical URLs.
- JSON-LD: `Organization` on all pages, `FAQPage` on pages with the FAQ.
- `sitemap.xml`, `robots.txt`.

**Responsive:** screenshots at 1920, 1440, 1024, 768, 390 for every page, attached to the final report.

---

## 8. Open items for the owner (log in `docs/OPEN_ITEMS.md`, do not guess)

1. **Brand imagery:** keep the tulip and butterfly sky photography as the Demaze look, or move to a more technical visual language? This spec keeps it.
2. **Replacement visuals** for the bento and industry panels: abstract graphics, or commission real ones?
3. **Legal pages** (Privacy Policy, Terms) and cookie consent. The contact form collects personal data, so these are normally expected before launch. Text must come from the client.
4. **Social links:** provide real URLs or leave the icons out.
5. **Pricing / comparison sections:** intentionally omitted (no data).
6. **Hero product peek:** confirm the car-dealer app mockup is approved for public use.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-19T17:43:06+05:30.

The user's current state is as follows:
Active Document: c:\Users\singh\Claude\Projects\Framer\DEMAZE_IMPLEMENTATION_STATE.md (LANGUAGE_MARKDOWN)
Cursor is on line: 1
Other open documents:
- c:\Users\singh\Claude\Projects\Framer\debug_test_mobile_menus.js (LANGUAGE_JAVASCRIPT)
- c:\Users\singh\Claude\Projects\Framer\DEMAZE_IMPLEMENTATION_STATE.md (LANGUAGE_MARKDOWN)
- c:\Users\singh\Claude\Projects\Framer\assets\demaze\demaze-subpages.css (LANGUAGE_CSS)
- c:\Users\singh\Claude\Projects\Framer\services.html (LANGUAGE_HTML)
- c:\Users\singh\Claude\Projects\Framer\projects.html (LANGUAGE_HTML)
Browser State:
  Page 018010AEB6C98CD15193EF6C9355EFCB (Contact Us - Demaze Technologies | Reach Us At Anytime) - http://localhost:3000/contact [ACTIVE]
    Viewport: 1280x585, Page Height: 2124
  Page 4D94818A8F195396C753F0EE03D479D6 (MOVIQ) - https://moviq.framer.website/
    Viewport: 1280x585, Page Height: 13746
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from Gemini 3.8 Flash (Medium) to Gemini 3.8 Flash (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>