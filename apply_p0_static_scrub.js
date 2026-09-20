const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Pre-paint gate in <head>
const prepaintGate = `
	<style id="demaze-prepaint-gate">
		html:not(.demaze-ready) {
			opacity: 0 !important;
			visibility: hidden !important;
			pointer-events: none !important;
		}
		html.demaze-ready {
			opacity: 1 !important;
			visibility: visible !important;
			transition: opacity 0.15s ease-out !important;
		}
	</style>
	<script>
		window.__demazeReadyTimer = setTimeout(function() {
			document.documentElement.classList.add('demaze-ready');
		}, 1500);
	</script>
`;

if (!html.includes('demaze-prepaint-gate')) {
  html = html.replace('<head>', '<head>' + prepaintGate);
  console.log('Added pre-paint gate to <head>');
}

// 2. Hide Pricing section in static HTML
html = html.replace(
  'data-framer-name="Pricing"',
  'data-framer-name="Pricing" style="display:none!important"'
);

// 3. Hide Promo CTA sections in static HTML (the first two CTAs)
html = html.replace(
  'class="framer-glfp2y" data-framer-name="CTA"',
  'class="framer-glfp2y" data-framer-name="CTA" style="display:none!important"'
);
html = html.replace(
  'class="framer-yc1mky" data-framer-name="CTA"',
  'class="framer-yc1mky" data-framer-name="CTA" style="display:none!important"'
);

// 4. Scrub static Hero text
html = html.replace('Transform Text Into Stunning Videos Instantly', 'Your Strategic Partner in Building Scalable AI Products');
html = html.replace(/Effortless Video Creation get it/g, 'Expertise | Innovation | Partnership');
html = html.replace('<div class="framer-zeccam" data-framer-name="tag"', '<div class="framer-zeccam" data-framer-name="tag" style="display:none!important"');

// 5. Replace Hero buttons
html = html.replace(/Try It Free/g, "Let's Connect");
html = html.replace(/Watch Demo/g, 'Explore Services');

// 6. Replace Nav button & Moviq text where visible
html = html.replace(/Get Started<\/p>/g, 'Book A Call</p>');
html = html.replace(/alt="Moviq"/g, 'alt="Demaze"');
html = html.replace(/title="Moviq"/g, 'title="Demaze"');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html with pre-paint gate and scrubbed static template text.');
