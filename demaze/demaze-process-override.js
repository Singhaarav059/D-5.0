/**
 * The Process section (MOVIQ's "Videos making Step" 3-step block) has no
 * Demaze equivalent content anywhere on demazetech.com — confirmed by
 * checking the homepage, /services, and /about-us. Per instruction, this
 * hides the section rather than inventing process-step content.
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  if (!window.DemazeOverride) return;

  function getSection() {
    return document.querySelector('section[data-framer-name="Videos making Step"]');
  }

  function isHydrated(section) {
    return !!section.querySelector('h2');
  }

  function applyOverride(section) {
    section.style.display = 'none';
  }

  function verifyStuck(section) {
    return section.style.display === 'none';
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
