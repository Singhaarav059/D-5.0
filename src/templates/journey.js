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

const drawing = () => `<div class="journey__map">
          ${maze({ cols: 22, rows: 5, seed: 1892, entry: 2, exit: 2, cls: 'maze--wide', pits: J.pitfalls, start: J.start, finish: J.finish })}
          ${maze({ cols: 10, rows: 6, seed: 1900, entry: 2, exit: 3, cls: 'maze--narrow', pits: J.pitfalls.slice(0, 4), start: J.start, finish: J.finish, tagSize: 14 })}
        </div>`;

// The home page opens with the promise and the maze it gets you out of.
const hero = () => `<section class="journey journey--home">
  <div class="wrap journey__stage">
    ${heroCopy()}
    ${drawing()}
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
