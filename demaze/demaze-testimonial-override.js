/**
 * Founder testimonial — a new section with no MOVIQ homepage equivalent.
 *
 * MOVIQ's homepage has no quote/testimonial component at all (checked every
 * section's data-framer-name children). A real author/quote card component
 * does exist elsewhere in this same MOVIQ export (reviews.html), but that
 * page ships its own separate compiled CSS bundle — its classes aren't
 * available on index.html — so its exact markup can't be reused directly.
 * This borrows its editorial *pattern* (large quote, avatar-less
 * name+title byline) using the same brand color/typography language the
 * other custom-built sections on this page already use (BRAND_BLUE, MUTED,
 * MOVIQ's own gradient-heading treatment), inserted as a new section right
 * after Hero — matching where the quote sits on the live Demaze homepage.
 *
 * This node is NOT part of React's compiled tree, so it can't be inserted
 * as a new top-level sibling section — confirmed live: doing that crashes
 * React's reconciler with a fatal "insertBefore/removeChild: not a child of
 * this node" the next time it reconciles the section list (same failure
 * class as moving a node between parents). Instead this is appended as the
 * last child *inside* Hero's own container, which keeps Hero's position in
 * the top-level section list untouched — only Hero's own internal child
 * count changes, which is safe. It's styled with its own opaque background
 * so it still reads as a distinct section, not part of Hero's image panel.
 *
 * See demaze-override-core.js for why this waits/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.testimonial;
  if (!content || !window.DemazeOverride) return;

  var STYLE_ID = 'demaze-testimonial-style';
  var SECTION_ID = 'demaze-testimonial-section';
  var BRAND_BLUE = '#5B5FEF';
  var MUTED = 'rgb(108, 119, 131)';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.demaze-testimonial-wrap{background:#fff;width:100%;position:relative;z-index:1;}' +
      '.demaze-testimonial{padding:96px 24px;text-align:center;max-width:860px;margin:0 auto;}' +
      '.demaze-testimonial-mark{font-size:64px;line-height:1;color:' + BRAND_BLUE + ';font-family:Georgia,serif;margin-bottom:8px;}' +
      '.demaze-testimonial-quote{font-size:clamp(20px,2.6vw,30px);line-height:1.5;font-weight:500;color:rgb(0,0,0);margin:0 0 28px;}' +
      '.demaze-testimonial-byline{display:inline-flex;align-items:center;gap:14px;background:#fff;padding:6px 20px 6px 8px;border-radius:100px;box-shadow:0 6px 20px rgba(0,0,0,0.06), inset 0 2px 2px #fff;border:1px solid rgba(0,0,0,0.06);}' +
      '.demaze-testimonial-avatar{width:46px;height:46px;border-radius:50%;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.12);flex-shrink:0;}' +
      '.demaze-testimonial-info{text-align:left;}' +
      '.demaze-testimonial-name{font-size:15px;font-weight:600;color:rgb(0,0,0);line-height:1.2;}' +
      '.demaze-testimonial-title{font-size:13px;color:' + MUTED + ';margin-top:3px;line-height:1.2;}';
    document.head.appendChild(style);
  }

  function getHero() {
    return document.querySelector('section[data-framer-name="Hero"]');
  }

  function isHydrated(hero) {
    return !!hero.querySelector('h1');
  }

  function buildBlock() {
    var wrap = document.createElement('div');
    wrap.id = SECTION_ID;
    wrap.className = 'demaze-testimonial-wrap';
    var avatarHTML = content.avatar
      ? '<img src="' + content.avatar + '" class="demaze-testimonial-avatar" alt="' + content.name + '">'
      : '';
    wrap.innerHTML =
      '<div class="demaze-testimonial">' +
      '<div class="demaze-testimonial-mark">&ldquo;</div>' +
      '<p class="demaze-testimonial-quote">' + content.quote + '</p>' +
      '<div class="demaze-testimonial-byline">' +
      avatarHTML +
      '<div class="demaze-testimonial-info">' +
      '<div class="demaze-testimonial-name">' + content.name + '</div>' +
      '<div class="demaze-testimonial-title">' + content.title + '</div>' +
      '</div>' +
      '</div>' +
      '</div>';
    return wrap;
  }

  function applyOverride(hero) {
    // The founder statement is now properly unified into Who We Are + Founder
    var old = document.getElementById(SECTION_ID);
    if (old && hero.contains(old)) {
      old.remove();
    }
  }

  function verifyStuck(hero) {
    return !hero.querySelector('#' + SECTION_ID);
  }

  window.DemazeOverride.run({
    getRoot: getHero,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
