# Handoff: the D-5.0 redesign (from the Claude Design prototype)

Branch `design/d5-redesign`, off `design/paper-and-ink`. `npm run test:all` passes (17/17). Nothing is on `main`:
merging deploys the live site.

## What was asked

Build the "Demaze Site" prototype from Claude Design into the real site: a bolder composition with the same brand
and motion ideas, on every page (home, projects, services, about, contact, the case studies and the 404). Decisions
agreed before building: port it into this repo; keep the 3D pieces (the studio, the crew, the contact map); keep the
demo scenes but make them clearly illustrative (generic labels, an "Illustrative" tag, no business figures).

## What changed

- **Every page** is rebuilt from `src/templates/` to the prototype's layout and type (night ground, paper objects,
  marker colours, much larger Bricolage headlines rising word by word).
- **Motion** is now plain Web Animations (`public/assets/site.js`); GSAP, ScrollTrigger and Lenis are gone.
  - The maze is solved on a loop, with the pitfalls dropping away as the route passes them.
  - "How we work" is pinned: the route draws along as you scroll, each stage swaps in with its own scene, and its
    steps tick off.
  - The selected work slides sideways as you scroll.
  - The services section is pinned too: scrolling moves through the four services, each shown in its live demo.
  - Every project card plays a short story with one chapter per feature.
  - A blue curtain sweeps between pages. The background aura follows each section's colour, buttons lean toward
    the cursor and cards tilt.
  - On phones and short screens the pinned sections lay out flat; with reduced motion everything rests on its
    finished frame.
- **Kept**: `crew3d.js` (in the crew band: home's "start a project" and the contact page), `office3d.js` (home, "who
  we are") and `visit3d.js` (the contact map, restyled). `site.js` loads the crew and the studio, as `ambient.js` did.
- **Retired** (deleted): `ambient.js`, `silk.js`, `journey.js`, `reel.js`, `reel-kit.js`, `reel3d.js`, the vendor
  GSAP/ScrollTrigger/Lenis files, `img/reel/` and `img/tech/`, the doodle, sketch, stage and demo templates, and the
  `reels`, `stack`, `band` and `closing` content.
- **The brief** (contact form) asks what they need, where they are now, name, email, company and the problem.
  `lib/contact-api.js` now also accepts `stage` (one of `content.brief.stages`) and `company` (up to 160 characters),
  and passes both on to the webhook. What they need is sent as `subject`.
- **Copy edits from the design**: the web service is titled "Web, Mobile & SaaS"; the footer's "next up" lines; the
  founder quote reads "When you thrive, we thrive, and …".
- **Tests**: `html.test.js` checks for `site.js` (not GSAP) and that every project plays its reel. The old `--shot`
  backdrop check was removed along with the backdrops. `contact-api.test.js` covers `stage` and `company`.

## Checked

Every page at 1440, 768 and 390px in headless Chromium: no horizontal overflow and no page errors. The only console
lines are the software renderer's WebGL notices, and the 503 from `/api/contact` locally, where no webhook is set.
Also checked:
- the curtain in both directions;
- the phone menu;
- the projects filter, the tools tabs, the industries and the FAQ;
- the brief's validation, its sending and its thank-you (with a mocked 202);
- clicking a service while its section is pinned;
- reduced motion.

## Not finished

- **Real-device check**: the pinned sections and the three 3D scenes have only been seen in headless Chromium with a
  software renderer. Check the scroll on a mid-range phone and in Safari.
- **Old reel content**: each project's hand-picked reel (in the old `reels` block) was replaced by the design's
  story card, which is built from `features`. The old block is in git history if any of it should come back.

## Blocked on the owner

- **Contact form delivery**: `CONTACT_WEBHOOK_URL` must be set on Railway, or every brief shows "We couldn't send
  that" (with an email fallback).
- **Custom domain**: canonical URLs, the sitemap and share images point at `https://demazetech.com`.
- **Office address**: content says *A 804*; the Maps link points to *D-814*.
- **LMS case study**: still has no description (`src/content.js`).
- **Company figures** (45+ projects, $10M+ and so on): can't be verified from the repo.
