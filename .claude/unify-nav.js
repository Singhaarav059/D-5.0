// One-off: replace nav + mobile drawer markup on every page with one canonical version.
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/singh/Claude/Projects/Framer';
const PAGES = { 'index.html': '/', 'services.html': '/services', 'projects.html': '/projects', 'about-us.html': '/about-us', 'contact.html': '/contact' };
const LINKS = [['/projects', 'Projects'], ['/services', 'Services'], ['/about-us', 'About us']];
const LOGO = 'https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?scale-down-to=512';

function nav(current) {
  const items = LINKS.map(([h, t]) => `<li class="demaze-nav-item"><a href="${h}"${h === current ? ' aria-current="page"' : ''}>${t}</a></li>`).join('');
  const drawer = LINKS.map(([h, t]) => `<li><a href="${h}"${h === current ? ' aria-current="page"' : ''}>${t}</a></li>`).join('');
  return `<div class="demaze-nav-wrapper">
    <nav class="demaze-nav-bar" aria-label="Primary">
      <a href="/" class="demaze-nav-logo" aria-label="Demaze Technologies home"><img src="${LOGO}" alt="" width="84" height="26"></a>
      <ul class="demaze-nav-menu">${items}</ul>
      <div class="demaze-nav-cta"><a href="/contact" class="demaze-nav-btn"${current === '/contact' ? ' aria-current="page"' : ''}>Book a call</a></div>
      <button type="button" class="demaze-mobile-toggle" id="demaze-mobile-btn" aria-label="Menu" aria-expanded="false" aria-controls="demaze-subpage-drawer"><span></span><span></span><span></span></button>
    </nav>
  </div>
  <div class="demaze-subpage-drawer" id="demaze-subpage-drawer">
    <ul class="drawer-menu">${drawer}</ul>
    <a href="/contact" class="demaze-drawer-cta">Book a call</a>
  </div>`;
}

// Returns index just past the </div> that closes the <div> starting at `start`.
function closeDiv(s, start) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(s))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return re.lastIndex;
  }
  throw new Error('unbalanced');
}

for (const [file, current] of Object.entries(PAGES)) {
  const p = path.join(ROOT, file);
  let s = fs.readFileSync(p, 'utf8');
  const a = s.indexOf('<div class="demaze-nav-wrapper">');
  const navEnd = closeDiv(s, a);
  const d = s.indexOf('<div class="demaze-subpage-drawer"', navEnd);
  if (a < 0 || d < 0 || d - navEnd > 200) throw new Error(file + ': markers');
  const drawerEnd = closeDiv(s, d);
  s = s.slice(0, a) + nav(current) + s.slice(drawerEnd);
  fs.writeFileSync(p, s);
  console.log(file, 'ok');
}
