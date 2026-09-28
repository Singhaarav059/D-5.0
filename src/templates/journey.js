// "How we work" as one scene: the maze (templates/maze.js), the four stages under it, and on the home page the
// hero copy above it. journey.js plays it on scroll: the walls fall away, the route straightens into a line, the
// stops appear and a signal walks the stages. Without motion it reads top to bottom as plain content:
// (hero copy) → the solved maze → the heading → the four stages.
'use strict';

const C = require('../content');
const { esc, pad, btn, head } = require('./helpers');
const { maze } = require('./maze');
const { doodle } = require('./doodles');
const { stageArt } = require('./stages');

const J = C.journey;

// The loop drawn around the headline's <mark>ed word.
const LOOP = '<svg class="scribble__loop" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M186 12C120 2 22 12 10 50c-10 34 88 44 170 40 72-3 118-18 110-44C282 18 206 6 118 12"/></svg>';
const headline = (h) => h.replace(/<mark>(.*?)<\/mark>/, `<span class="scribble">$1${LOOP}${doodle('star', { color: 'sun', cls: 'hero__star' })}${doodle('star', { color: 'pink', cls: 'hero__star hero__star--2' })}</span>`);

// The record, right under the promise: the four figures (content.js `metrics`), each with a marker line in its colour.
// It sits under the headline only, leaving the cell under the actions free for the arrow down to the maze.
const PROOF_MK = ['sun', 'pink', 'mint', 'sky'];
const proof = () => `<ul class="hero__proof" data-hero-fade>${C.metrics.map((m, i) => `<li style="--mk:var(--${PROOF_MK[i % 4]})"><b>${m.prefix}${m.value}${m.suffix}</b>${esc(m.label.toLowerCase())}</li>`).join('')}</ul>`;

const heroCopy = () => `<div class="journey__intro" data-hero>
          <p class="hero__label" data-hero-fade>${esc(C.hero.label)}</p>
          <div class="hero__grid">
            <h1 class="hero__title" data-split="hero">${headline(C.hero.headline)}</h1>
            <div class="hero__aside">${doodle('arrow', { color: 'tomato', cls: 'hero__arrow' })}
              <p class="hero__lead" data-hero-fade>${esc(C.hero.lead)}</p>
              <div class="hero__ctas" data-hero-fade>${btn('Start a project', './contact')}${btn('See how we work', '#how', 'btn--ghost')}</div>
            </div>
            ${proof()}
          </div>
        </div>`;

const caption = () => `<div class="journey__caption" id="how">${head({ label: 'How we work', title: C.journey.title, lead: esc(C.journey.lead), mark: ['bulb', 'sun'] })}</div>`;

const drawing = () => `<div class="journey__map">
          ${maze({ cols: 22, rows: 5, seed: 1892, entry: 2, exit: 2, cls: 'maze--wide', pits: J.pitfalls, start: J.start, finish: J.finish })}
          ${maze({ cols: 10, rows: 6, seed: 1900, entry: 2, exit: 3, cls: 'maze--narrow', pits: J.pitfalls.slice(0, 4), start: J.start, finish: J.finish, tagSize: 14 })}
        </div>`;

// Each stage has its own marker colour and doodle (its stop on the line lights up in the same colour, site.css), and
// a small scene of the work itself (templates/stages.js) that plays while it is the current stage.
const STAGE_ART = [['bulb', 'sun'], ['pencil', 'lilac'], ['gear', 'sky'], ['rocket', 'tomato']];
const steps = () => `<ol class="journey__steps">${C.process.map((s, i) => `
          <li class="journey__step" data-step style="--mk:var(--${STAGE_ART[i % 4][1]})"><div class="journey__art">${stageArt(i)}</div><div class="journey__head">${doodle(STAGE_ART[i % 4][0], { color: STAGE_ART[i % 4][1], cls: 'journey__dd' })}<span class="journey__num">${pad(i + 1)}</span><h3>${esc(s.title)}</h3></div><p>${esc(s.description)}</p></li>`).join('')}
        </ol>`;

// `intro`: the home page, where the scene starts as the hero.
const journey = ({ intro = false } = {}) => `<section class="journey${intro ? ' journey--home' : ''}" data-journey>
  <div class="journey__track">
    <div class="journey__sticky">
      <div class="wrap journey__stage">
        ${intro ? heroCopy() + drawing() + caption() : caption() + drawing()}
        ${steps()}
      </div>
    </div>
  </div>
</section>`;

module.exports = { journey };
