// Contact page: office map + directions. visit3d.js draws a Three.js diorama over the card; the code-drawn SVG
// (stylised, no third-party embed) is its fallback. The whole card opens Google Maps.
'use strict';

const C = require('../content');
const { esc, btn, eyebrow } = require('./helpers');

const visit = () => `<section class="section visit">
  <div class="wrap visit__grid">
    <a class="visit__map" href="${C.mapUrl}" target="_blank" rel="noopener" aria-label="Open the Demaze office location in Google Maps" data-reveal data-visit3d>
      <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="visit-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1"/></pattern>
          <radialGradient id="visit-glow" cx="0.54" cy="0.46" r="0.5"><stop offset="0" stop-color="#3d5afe" stop-opacity="0.34"/><stop offset="1" stop-color="#3d5afe" stop-opacity="0"/></radialGradient>
          <path id="visit-sg" d="M127 300C139 200 149 100 157 0"/>
          <path id="visit-jr" d="M141 149C220 146 300 160 490 176"/>
        </defs>
        <g class="visit__art">
          <rect class="visit__dots" width="480" height="300" fill="url(#visit-dots)"/>
          <g class="visit__blocks">
            <path d="M14 8h118l-4 50H10z"/><path d="M8 76h116l-3 60H4z"/><path d="M2 160h118l-4 64H-2z"/><path d="M-4 246h114l-4 60H-8z"/>
            <path d="M170 8h104l-2 46H166z"/><path d="M300 8h60l-4 44h-58z"/><path d="M166 72h100l-2 64-102-2z"/><path d="M294 72h56l-2 70-56-3z"/>
            <path d="M152 170l144 6-6 56-142-2z"/><path d="M146 250l136 4-4 50H140z"/><path d="M324 186l92 7-6 48-90-4z"/><path d="M318 260l90 4-2 40h-90z"/>
            <path d="M444 196l40 3v50h-44z"/>
          </g>
          <path class="visit__park" d="M378 18l84-6 12 58-48 24-44-20z"/><path class="visit__park" d="M384 116l62 6-4 34-60-4z"/>
          <path class="visit__water" d="M455 300C446 250 466 214 490 196V300z"/>
          <g class="visit__streets">
            <path d="M216 -10C212 90 206 200 200 310"/><path d="M290 -10L286 150"/><path d="M370 -10L362 160"/><path d="M318 172L308 310"/><path d="M430 186L440 310"/><path d="M66 -10L48 310"/>
            <path d="M-10 64L140 68"/><path d="M152 62C240 60 330 66 490 56"/><path d="M152 104L490 110"/><path d="M-10 148L136 150"/><path d="M-10 238L126 234"/><path d="M138 238C240 244 360 252 490 264"/>
          </g>
          <path class="visit__road is-casing" d="M141 149C220 146 300 160 490 176"/><path class="visit__road" d="M141 149C220 146 300 160 490 176"/>
          <path class="visit__hwy is-casing" d="M157 -10C149 90 139 200 126 310"/><path class="visit__hwy" d="M157 -10C149 90 139 200 126 310"/><path class="visit__hwy-line" d="M157 -10C149 90 139 200 126 310"/>
          <path class="visit__route" d="M154 12C150 70 145 115 141 149C185 147 225 147 258 151"/>
          <text class="visit__street-name"><textPath href="#visit-sg" startOffset="30%">S.G. HIGHWAY</textPath></text>
          <text class="visit__street-name"><textPath href="#visit-jr" startOffset="58%">JAGATPUR ROAD</textPath></text>
          <text class="visit__dir" x="166" y="22">↑ GANDHINAGAR</text>
          <g class="visit__compass" transform="translate(452 30)"><circle r="15"/><path d="M0-10l4 10H-4z"/><path class="is-s" d="M0 10l4-10H-4z"/><text y="-19">N</text></g>
          <rect class="visit__bldg" x="249" y="130" width="24" height="16" rx="3" transform="rotate(3 261 138)"/>
          <circle class="visit__glow" cx="261" cy="138" r="120" fill="url(#visit-glow)"/>
          <circle class="visit__ring" cx="261" cy="138" r="40"/><circle class="visit__ring is-2" cx="261" cy="138" r="40"/>
          <g transform="translate(21 -20)"><path class="visit__pin" d="M240 158c-11-13-17-22-17-30a17 17 0 0 1 34 0c0 8-6 17-17 30z"/><circle class="visit__pin-dot" cx="240" cy="128" r="6"/></g>
          <g class="visit__callout" transform="translate(286 70)"><rect width="132" height="42" rx="10"/><text class="is-title" x="12" y="18">Ganesh Glory 11</text><text x="12" y="32">A 804 · Demaze</text></g>
        </g>
      </svg>
      <div class="visit3d" aria-hidden="true"></div>
      <span class="visit__tag is-road" data-visit-tag="sg" aria-hidden="true">S.G. Highway</span>
      <span class="visit__tag is-road" data-visit-tag="jr" aria-hidden="true">Jagatpur Rd</span>
      <span class="visit__tag is-office" data-visit-tag="office" aria-hidden="true">Ganesh Glory 11<small>A 804 · Demaze</small></span>
      <span class="visit__label"><i></i>Gota, Ahmedabad · Open in Maps</span>
    </a>
    <div class="visit__copy">
      ${eyebrow('Office location')}
      <h2 class="h2" data-split>Visit us in Ahmedabad</h2>
      <p class="lead" data-reveal>${esc(C.address)}</p>
      <div class="hero__ctas visit__ctas" data-reveal>${btn('Get directions', C.mapUrl, 'btn--blue', 'target="_blank" rel="noopener"')}${btn('Book with Calendly', C.calendly, 'btn--white', 'target="_blank" rel="noopener"')}</div>
    </div>
  </div>
</section>`;

module.exports = { visit };
