# Handoff: performance and production-readiness pass

Branch `design/paper-and-ink`, pushed at `8fc987e` (29 Sep 2026). `npm run test:all` passes (15/15).
Nothing is on `main` yet: merging deploys the live site.

## What was asked

Make the 3D animations cheap enough that the site never lags, then audit every page for production readiness
(alignment, overlap, visibility, colour) and fix what turns up.

## Done (8 commits, oldest first)

| Commit | What changed |
| --- | --- |
| `b9a4b2f` Draw the studio with half the draw calls | `office3d.js`: 346 static meshes merged per look (colour kept per vertex); draws per frame 822 to 351 (phones 668 to 317); main thread per frame about 10.8ms to 5.5ms on the test CPU. Shadow maps redrawn every other frame. Shaders compiled in the background before the first frame. Capped at 60fps on 120Hz screens; resolution drops automatically if frames keep running under 40fps. Whiteboard re-uploads in steps of about a screen pixel. No longer requests the discrete GPU. Renders are pixel-identical at 390, 768 and 1440 (seeded comparison), and no merged mesh moves over 20 simulated minutes. |
| `bf15747` Crew band, reel heroes, contact map | Same shader treatment in `crew3d.js`, `reel3d.js`, `visit3d.js`. Crew band no longer reads its canvas position every frame (forced layout). 60fps cap and automatic resolution on the band. Reels' renderer drops `preserveDrawingBuffer` and the discrete-GPU request; a reel keeps its illustration until its hero has compiled. |
| `0da8950` Build reels as they come near | `reel.js`: reels are built within 600px of the screen instead of all 16 at load (/projects built 16 on load, now 4). |
| `b7af1b9` Doodles without whole-page layout | `ambient.js`: each new doodle read `offsetWidth`, forcing a full-page layout every second or so; it's now measured with a ResizeObserver. |
| `bc7a017` Filter button blur | Removed a nested backdrop blur on the project filter buttons. |
| `f689c7a` HTTPS header | `Strict-Transport-Security: max-age=31536000` added; the duplicate `Content-Security-Policy-Report-Only` header removed (test updated). |
| `b7d0aa8` Project names | All 16 project names in Title Case (they mixed three styles); three ", It" slips fixed. URLs unchanged. |
| `8fc987e` Layout slips | Services demo panel no longer rises above its section's rule. Background doodles fade out while the full-width industry and tool rows pass their slot (they showed through the chips). Hero loop no longer touches "the" before "maze." Touch targets raised to 44px (project filters, tool categories, contact email button, case study service links). |

Background compiling only happens where the browser supports `KHR_parallel_shader_compile` (Chrome and Edge on real GPUs).
Elsewhere, shaders compile on the first draw as before, with no console warning. On `localhost` the shader error check
stays on for development.

## Audit results

Every page in the sitemap plus the 404 page, at 1440, 768 and 390px (390 as a touch phone). Checked for sideways
overflow, text off screen, overlapping or clipped text, tap targets, image problems, unnamed controls and console
errors, plus a visual review of every main page at all three widths.
- No console errors, failed requests or sideways scroll on any page.
- The remaining automated flags were checked and are false positives:
  - clamped descriptions (their hidden lines still report positions)
  - hidden dropdown links (no visible text while closed)
  - intentional sideways scrollers and marquees
  - lazy images a full-page capture never loaded

## Not finished

- **Contrast check**: the automated colour-contrast pass was interrupted before its results were reviewed. Re-run
  `audit.mjs` (see below) and look at the `contrast` entries; approximate ones (marked `~`) sit on glass or gradients
  and need a visual check.
- **Silk background** (`silk.js`): repaints a full-screen canvas about 30 times a second on every page, and the glass
  above it re-blurs. The test machine has no GPU, so its cost couldn't be measured. Check with DevTools
  (Performance, GPU track) on a real laptop; if it's heavy, lower its frame rate or resolution.
- **Real-device check**: all numbers above come from headless Chromium with a software renderer. Look at the studio
  on home, the crew band and the /projects reels on a mid-range phone and a laptop on battery.

## Blocked on the owner

- **Contact form delivery**: `CONTACT_WEBHOOK_URL` must be set on Railway, or every submission shows "We couldn't
  send that" (with an email fallback).
- **Custom domain**: canonical URLs, the sitemap and share images point at `https://demazetech.com`, which doesn't
  point at the Railway service yet.
- **Office address**: content says *A 804*; the Maps link points to *D-814*.
- **LMS case study**: still has no description (`TODO` in `src/content.js`).
- **Company figures** (45+ projects, $10M+ and so on): can't be verified from the repo.
- **Long page titles**: 17 of 23 pages have titles over 60 characters, for example home (77) and services (81), so
  Google cuts off the "Demaze Technologies" end. It's a wording decision, so they were left as they are.

## How to re-run the checks

The scripts live in the session scratchpad, which is not kept, so recreate them if needed. Serve with
`PORT=4173 node server.js`, then drive Chromium via `playwright-core`. The launch path (`/opt/pw-browsers/chromium-1194`)
is specific to the cloud container, so change it for another machine.
- `audit.mjs`: every sitemap page at 3 widths, reduced motion.
- `cpu3d.mjs`: office main-thread milliseconds and draw calls per frame, through the element's `officeStep(dt)` hook.
- `same.mjs`: seeded pixel comparison of the office between two versions of `office3d.js`.
