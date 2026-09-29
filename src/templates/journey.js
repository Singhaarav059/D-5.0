// The home hero (its copy and the maze, templates/maze.js) and "How we work": the four stages as rows, a scene of the
// work beside its words, alternating sides, with the Demaze route running through them from the idea to the launch
// chevron (journey.js draws it from the rows' positions and on scroll). Without JS the rows read as plain content.
'use strict';

const C = require('../content');
const { esc, pad, btn, head, icon } = require('./helpers');
const { maze, chevron } = require('./maze');
const { doodle } = require('./doodles');
const { stageArt } = require('./stages');

const J = C.journey;

// The loop drawn around the headline's <mark>ed word.
const LOOP = '<svg class="scribble__loop" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M186 12C120 2 22 12 10 50c-10 34 88 44 170 40 72-3 118-18 110-44C282 18 206 6 118 12"/></svg>';
const headline = (h) => h.replace(/<mark>(.*?)<\/mark>/, `<span class="scribble">$1${LOOP}${doodle('star', { color: 'sun', cls: 'hero__star' })}${doodle('star', { color: 'pink', cls: 'hero__star hero__star--2' })}</span>`);

// The record, under the actions: the four figures (content.js `metrics`), each with a marker line in its colour.
const PROOF_MK = ['sun', 'pink', 'mint', 'sky'];
const proof = () => `<ul class="hero__proof" data-hero-fade>${C.metrics.map((m, i) => `<li style="--mk:var(--${PROOF_MK[i % 4]})"><b>${m.prefix}${m.value}${m.suffix}</b>${esc(m.label.toLowerCase())}</li>`).join('')}</ul>`;

// The maze on its board: the four pitfalls the lead names (vague specs, scope creep, deadlines, tech debt), the idea at
// the entrance, the launch at the exit. It draws itself in, is solved, tilts toward the pointer (site.js) and falls
// away as the hero scrolls off (journey.js).
const LEAD_PITS = [4, 0, 2, 3].map((i) => J.pitfalls[i]);
const board = () => `<div class="hero__board" data-hero-fade data-tilt>
          ${maze({ cols: 10, rows: 6, seed: 1900, entry: 2, exit: 3, cls: 'maze--board', pits: LEAD_PITS, start: J.start, finish: J.finish, tagSize: 13 })}
        </div>`;

// The home page opens with the promise beside the maze it gets you out of.
const hero = () => `<section class="journey journey--home">
  <div class="wrap hero" data-hero>
    <p class="hero__label" data-hero-fade>${esc(C.hero.label)}</p>
    <div class="hero__layout">
      <div class="hero__copy">
        <h1 class="hero__title" data-split="hero">${headline(C.hero.headline)}</h1>
        <p class="hero__lead" data-hero-fade>${esc(C.hero.lead)}</p>
        <div class="hero__ctas" data-hero-fade>${btn('Start a project', './contact#form-brief')}${btn('See how we work', '#how', 'btn--ghost')}</div>
        ${proof()}
      </div>
      ${board()}
    </div>
  </div>
</section>`;

// Each stage has its own marker colour and doodle (its stop on the route lights up in the same colour) and a scene of
// the work itself (templates/stages.js) that plays while it is on screen.
const STAGE_ART = [['bulb', 'sun'], ['pencil', 'lilac'], ['gear', 'sky'], ['rocket', 'tomato']];
const row = (s, i) => `<li class="process__row${i % 2 ? ' is-flip' : ''}" style="--mk:var(--${STAGE_ART[i][1]})" data-stage>
          <div class="process__art" data-reveal><i class="process__stop" aria-hidden="true"></i>${stageArt(i)}</div>
          <div class="process__copy" data-reveal>
            <p class="process__meta">${doodle(STAGE_ART[i][0], { color: STAGE_ART[i][1], cls: 'process__dd' })}<span class="process__num">${pad(i + 1)}</span></p>
            <h3>${esc(s.title)}</h3>
            <p class="process__text">${esc(s.description)}</p>
            <ul class="process__steps">${s.steps.map((t) => `<li>${icon.check}${esc(t)}</li>`).join('')}</ul>
          </div>
        </li>`;

// "How we work": a violet room of four rows, the route from "Your idea" through every stage to the launch chevron.
const howWeWork = () => `<section class="section sheet sheet--day sheet--lilac process" id="how" data-process>
  <div class="wrap">
    ${head({ label: 'How we work', title: J.title, lead: esc(J.lead), mark: ['bulb', 'sun'] })}
    <div class="process__body">
      <svg class="process__route" aria-hidden="true" focusable="false"><path class="process__line"/><path class="process__ink"/></svg>
      <p class="process__start" aria-hidden="true">${doodle('bulb', { color: 'sun', cls: 'process__bulb' })}<span class="process__tag">${esc(J.start)}</span></p>
      <ol class="process__rows">${C.process.map(row).join('')}
      </ol>
      <p class="process__end" aria-hidden="true"><svg class="process__chevron" viewBox="0 0 40 40"><path d="${chevron(20, 20, 30)}"/></svg><span class="process__tag">${esc(J.finish)}</span></p>
    </div>
  </div>
</section>`;

module.exports = { hero, howWeWork };
