// The moving background: behind every page, the Demaze crew (templates/characters.js) and doodles of the work keep
// appearing, drawing themselves on, drifting with the cursor and the scroll, and giving way to others
// (public/assets/ambient.js plays them). This file ships the set they are drawn from, in a <template>: the crew, doodles (templates/doodles.js), task stickers (a doodle and two or three
// words on a marker-coloured tag, like the maze's pitfall labels) and, on wide screens, sketches of the work in the
// margins (templates/sketches.js). Decoration only: aria-hidden, and nothing on the page depends on it.
'use strict';

const { esc } = require('./helpers');
const { doodle } = require('./doodles');
const { sketchSvg } = require('./sketches');
const { crew } = require('./characters');

// [doodle, marker colour]
const DOODLES = [['bulb', 'sun'], ['pencil', 'lilac'], ['gear', 'sky'], ['rocket', 'tomato'], ['chip', 'lilac'], ['browser', 'sky'],
  ['phone', 'sun'], ['layers', 'mint'], ['bag', 'tomato'], ['cloud', 'mint'], ['loop', 'sky'], ['pen', 'pink'], ['star', 'sun'],
  ['chat', 'pink'], ['plane', 'sky'], ['cup', 'tomato'], ['card', 'mint'], ['bolt', 'sun'], ['spiral', 'lilac'], ['heart', 'pink']];

// [doodle, marker colour, words]: small moments of the work, not claims about anyone's project
const STICKERS = [['gear', 'mint', 'Tests passing'], ['rocket', 'tomato', 'Shipped'], ['pencil', 'lilac', 'Wireframes ready'],
  ['bulb', 'sun', 'New idea'], ['cloud', 'sky', 'Deployed'], ['chat', 'pink', 'Feedback in'], ['layers', 'mint', 'Sprint review'],
  ['pen', 'pink', 'Design QA'], ['browser', 'sky', 'Staging live'], ['loop', 'sun', 'Automated']];

// [sketch, marker colour]
const SKETCHES = [['wireframe', 'sky'], ['pen', 'lilac'], ['code', 'mint'], ['git', 'sun'], ['chart', 'tomato'], ['sticky', 'sun'],
  ['kanban', 'sun'], ['chat', 'sky'], ['flow', 'sun'], ['db', 'sky'], ['phone', 'mint'], ['map', 'tomato']];

// the plush characters' fuzzy edge: a little noise displaces the outline of their bodies
const FUR = '<svg class="amb__defs" width="0" height="0" aria-hidden="true" focusable="false"><filter id="crew-fur" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G"/></filter></svg>';

const ambient = () => `${FUR}<div class="amb" aria-hidden="true" data-amb></div>
<template data-amb-set>${[
  ...crew().map((svg) => `<div class="amb__crew" data-kind="crew">${svg}</div>`),
  ...DOODLES.map(([d, c]) => `<div class="amb__dd" data-kind="doodle">${doodle(d, { color: c })}</div>`),
  ...STICKERS.map(([d, c, t]) => `<div class="amb__tag" data-kind="tag" style="--dd:var(--${c})">${doodle(d, { color: c })}<span>${esc(t)}</span></div>`),
  ...SKETCHES.map(([s, c]) => `<div class="amb__sk" data-kind="sketch" style="--dd:var(--${c})">${sketchSvg(s)}</div>`),
].join('')}</template>`;

module.exports = { ambient };
