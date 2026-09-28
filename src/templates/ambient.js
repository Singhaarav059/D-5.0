// The moving background: behind every page, doodles of the work keep appearing, drawing themselves on, drifting with
// the cursor and the scroll, and giving way to others (public/assets/ambient.js plays them), around the 3D crew
// (public/assets/crew3d.js, which the layer's data-src names). This file ships the set the doodles are drawn from, in
// a <template>: doodles (templates/doodles.js), task stickers (a doodle and two or three words on a marker-coloured
// tag, like the maze's pitfall labels) and, on wide screens, sketches of the work in the margins
// (templates/sketches.js). Decoration only: aria-hidden, and nothing on the page depends on it.
'use strict';

const { esc } = require('./helpers');
const { doodle } = require('./doodles');
const { sketchSvg } = require('./sketches');

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

const ambient = () => `<div class="amb" aria-hidden="true" data-amb data-src="./assets/crew3d.js"></div>
<template data-amb-set>${[
  ...DOODLES.map(([d, c]) => `<div class="amb__dd" data-kind="doodle">${doodle(d, { color: c })}</div>`),
  ...STICKERS.map(([d, c, t]) => `<div class="amb__tag" data-kind="tag" style="--dd:var(--${c})">${doodle(d, { color: c })}<span>${esc(t)}</span></div>`),
  ...SKETCHES.map(([s, c]) => `<div class="amb__sk" data-kind="sketch" style="--dd:var(--${c})">${sketchSvg(s)}</div>`),
].join('')}</template>`;

module.exports = { ambient };
