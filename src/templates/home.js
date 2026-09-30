// Home: the promise and its maze, the industries tape, how we work (pinned: four stages on one route), the selected
// work (sliding sideways as you scroll), what we build (pinned: each service works in a live demo), who we are
// (the founder, the record, the studio in 3D) and the way to start.
'use strict';

const C = require('../content');
const { esc, pad, caseHref, pic, SVC_COLOR, SVC_ART, btn, kicker, words } = require('./helpers');
const { maze } = require('./maze');
const { stageScenes, demos } = require('./scenes');
const { media } = require('./projects');
const { metrics, print, quote } = require('./shared');
const { doodle } = require('./doodles');
const { techIcon } = require('./services');

// ---------- the hero ----------

const hero = () => `<section class="wrap hero" data-room="#3d5afe">
  <div class="hero__copy">
    <span class="tagpill" data-reveal><img src="${C.logoMark}" alt="" width="14" height="14">${esc(C.hero.label)}</span>
    <h1 class="display display--hero" data-words>${words(C.hero.headline)}</h1>
    <p class="lead" data-reveal data-delay="0.3">${esc(C.hero.lead)}</p>
    <div class="actions" data-reveal data-delay="0.4">${btn('Start a project', './contact', { tone: 'paper' })}${btn('See the work', './projects', { tone: 'ghost' })}</div>
    <div class="hero__record" data-reveal data-delay="0.5">${C.metrics.slice(0, 3).map((m) => `<div><b data-count="${m.value}" data-pre="${esc(m.prefix)}" data-suf="${esc(m.suffix)}">${esc(m.prefix + m.value + m.suffix)}</b><small>${esc(m.label)}</small></div>`).join('')}</div>
  </div>
  <div class="hero__maze" data-tilt="4">
    <div class="board" data-reveal data-delay="0.1">${maze({ cols: 11, rows: 8, seed: 1277, label: `A route worked out through a maze, from your idea to launch, ruling out ${C.journey.pitfalls.slice(0, 6).map((p) => p[1].toLowerCase()).join(', ')} on the way` })}</div>
  </div>
</section>`;

// ---------- the tape: what we build, each with its drawing, running sideways ----------

const BAND = [['AI & ML', 'chip', 'lilac'], ['Web apps', 'browser', 'sky'], ['Mobile apps', 'phone', 'sun'], ['SaaS', 'layers', 'mint'], ['E-commerce', 'bag', 'tomato'], ['Cloud', 'cloud', 'sky'], ['Automation', 'loop', 'pink'], ['UI/UX', 'pen', 'lilac']];
const tape = () => {
  const run = BAND.map(([t, d, c]) => `<span>${esc(t)}${doodle(d, { color: c })}</span>`).join('');
  return `<div class="tape" aria-hidden="true"><div class="tape__track" data-marquee="60">${run}${run}</div></div>`;
};

// ---------- how we work ----------

const STAGE = [['Idea', 'var(--sun)'], ['Design', 'var(--lilac)'], ['Build', 'var(--sky)'], ['Launch', 'var(--tomato)']];

// On wide screens the section pins for a while: the route (drawn by site.js to the labels' columns) runs along as you scroll, each stage swaps in with its
// scene, and its steps tick off. On phones (and short screens) the stages simply stack, each with its scene.
const howWeWork = () => `<section class="journey" data-journey data-room="#a58bff">
  <div class="journey__pin">
    <div class="wrap journey__inner">
      <div class="journey__head">
        <div>${kicker('How we work', '', ['spiral', 'lilac'])}<h2 class="display display--m">${C.journey.title.replace('<em>', '<em class="quiet">')}</h2></div>
        <div class="journey__count"><span><b data-stage-num>01</b><em class="quiet"> / 04</em></span></div>
      </div>
      <div class="journey__route">
        <div class="journey__line"><svg data-jsvg aria-hidden="true"><path class="is-track" data-jtrack/><path class="is-drawn" data-jroute/>${STAGE.map(([, c], i) => `<circle class="journey__stop" data-jstop="${i}" r="6" style="--c:${c}"/>`).join('')}</svg><i class="journey__dot" data-jdot aria-hidden="true"></i></div>
        <div class="journey__labels">${STAGE.map(([t, c], i) => `<span data-jlabel="${i}"><i style="background:${c}"></i>${t}</span>`).join('')}</div>
      </div>
      <div class="journey__stages">${C.process.map((st, i) => `
        <div class="jstage${i === 0 ? ' is-on' : ''}" data-stage="${i}" style="--c:${STAGE[i][1]}">
          <div class="jstage__text">
            <span class="jstage__n">${pad(i + 1)}</span>
            <span class="jstage__short"><i></i>${pad(i + 1)} · ${STAGE[i][0]}</span>
            <h3>${esc(st.title)}</h3>
            <p>${esc(st.description)}</p>
            <ul>${st.steps.map((t, j) => `<li data-step="${j}" data-n="${st.steps.length}"><span class="tick"><i>✓</i></span>${esc(t)}</li>`).join('')}</ul>
          </div>
          <div class="jstage__scene"><div data-fit>${stageScenes[i]()}</div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>`;

// ---------- selected work ----------

// The first six projects slide sideways as you scroll (the one in the middle full size, the others leaning away),
// ending on a card to the rest (a wall of their screens, the same height as the others). On phones the row scrolls by swipe.
const SHOW = 6;
const work = () => `<section class="hwork" data-hscroll data-room="#ff6242">
  <div class="hwork__pin">
    <div class="wrap hwork__head">
      <div>${kicker('Selected work', '', ['star', 'tomato'])}<h2 class="display display--l" data-words>${words('From brief <em>to launch.</em>')}</h2></div>
      <div class="hwork__side">
        <div class="hwork__count" aria-hidden="true"><span><b data-work-num>01</b><em class="quiet"> / ${pad(SHOW)}</em></span><small data-work-name>${esc(C.projects[0].name)} · ${esc(C.projects[0].sector)}</small></div>
        ${btn(`All ${C.projects.length} →`, './projects', { tone: 'ghost' })}
      </div>
    </div>
    <div class="hwork__viewport">
      <div class="hwork__track" data-htrack>${C.projects.slice(0, SHOW).map((p, i) => `
        <a class="hcard" href="${caseHref(p)}" data-hcard data-name="${esc(p.name)} · ${esc(p.sector)}">
          <div data-tilt="4">${media(p, i, { size: 'wide', sizes: '(max-width: 860px) 84vw, 920px' })}</div>
          <div class="hcard__foot">
            <h3>${esc(p.name)} <span class="meta">${esc(p.sector)}</span></h3>
            <span class="round" aria-hidden="true">→</span>
          </div>
        </a>`).join('')}
        <a class="hcard hcard--more" href="./projects" data-hcard data-name="${C.projects.length - SHOW} more · ${C.sectors} sectors in all">
          <div class="hmore" data-tilt="4">
            <div class="hmore__wall" aria-hidden="true">${C.projects.slice(SHOW).map((p, i) => `<span class="hmore__tile" style="--tint:${p.tint};--i:${i}">${pic(p.image, '', { sizes: '180px' })}</span>`).join('')}</div>
            <div class="hmore__copy">
              <span class="kicker">${C.projects.length - SHOW} more products</span>
              <span class="hcard__big">Fintech, legal, commerce, senior care and more.</span>
            </div>
          </div>
          <div class="hcard__foot">
            <h3>See all ${C.projects.length} <span class="meta">${C.sectors} sectors</span></h3>
            <span class="round" aria-hidden="true">→</span>
          </div>
        </a>
      </div>
    </div>
    <div class="wrap"><span class="hwork__progress"><i data-hbar></i></span></div>
  </div>
</section>`;

// ---------- what we build ----------

// Each service's capabilities as short tags (the first words of its first four items), and the projects it shows in.
const chipsOf = (s) => s.items.slice(0, 4).map((t) => t.split(/ & | \/ |, /)[0]);
const workOf = (s) => s.work.slice(0, 2).map((k) => C.projects.find((p) => p.image === k));
// The deep room each service turns the sheet into (light ink over it), in the service's marker colour.
const ROOM = { ai: '#2a1163', web: '#0b3350', ecom: '#6b0f26', cloud: '#063d2f' };

// Pinned on wide screens: scrolling moves through the four services; the sheet turns to each one's colour, its demo
// plays, and two of the projects it built sit under the demo. A click on a service scrolls to it; on phones they
// switch on tap.
const services = () => `<section class="svc-wrap" data-room="#2fd0a0">
  <div class="svc sheet" data-svcpin style="--room:${ROOM[C.services[0].id]}">
    <div class="svc__pin">
      <div class="svc__head">
        <div>${kicker('Services', '', ['pencil', 'lilac'])}<h2 class="display display--l" data-words>${words('What we <em>build.</em>')}</h2></div>
        <a class="ulink" href="./services">All services →</a>
      </div>
      <div class="svc__grid">
        <div class="svc__list">${C.services.map((s, i) => `
          <button type="button" class="svc__item${i === 0 ? ' is-on' : ''}" data-svc="${i}" data-room="${ROOM[s.id]}" aria-pressed="${i === 0}" style="--c:${SVC_COLOR[s.id]}">
            <span class="svc__icon">${doodle(SVC_ART[s.id][0], { color: SVC_ART[s.id][1] })}</span>
            <span class="svc__text">
              <span class="svc__title">${esc(s.title)}</span>
              <span class="svc__sum"><span><span>${esc(s.summary)}.</span><span class="svc__tags">${chipsOf(s).map((c) => `<em>${esc(c)}</em>`).join('')}</span></span></span>
            </span>
            <span class="svc__count">${pad(i + 1)}<small>${s.work.length} projects</small></span>
            <i class="svc__rule"><i data-sbar></i></i>
          </button>`).join('')}
          <div class="svc__help"><span class="svc__help-art">${doodle('question', { color: 'sky' })}</span><p><b>Not sure which you need?</b> Most products use two or three. Tell us the problem and we’ll map the route.</p>${btn('Book a call', C.calendly, { tone: 'paper', size: 'sm', extra: 'target="_blank" rel="noopener"' })}</div>
        </div>
        <div class="svc__show">
          <div class="svc__screen">
            ${C.services.map((s, i) => `<div class="svc__demo${i === 0 ? ' is-on' : ''}" data-svc-panel="${i}"><div data-fit>${demos[s.id]()}</div></div>`).join('')}
            <span class="svc__illus">Illustrative · sample data</span>
          </div>
          ${C.services.map((s, i) => `<div class="svc__proof${i === 0 ? ' is-on' : ''}" data-svc-panel="${i}">
            <span class="svc__seen">Built for</span>
            ${workOf(s).map((p) => `<a class="svc__case" href="${caseHref(p)}"><span class="svc__thumb" style="--tint:${p.tint}">${pic(p.image, '', { sizes: '120px' })}</span><span><b>${esc(p.name)}</b><small>${esc(p.sector)}</small></span></a>`).join('')}
            <a class="ulink" href="./services#${s.id}">Explore ${esc(s.title)} →</a>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`;

// ---------- where we build, and with what ----------

// Two rows running opposite ways: the industries (each with its drawing) and the tools we build with (their logos).
// The first run of each row is the readable list; the copy that makes the loop seamless is hidden from readers.
const reach = () => {
  const seen = new Set();
  const tools = C.tools.flatMap((t) => t.items).filter(([n, slug]) => techIcon(slug) && !seen.has(n) && seen.add(n));
  const row = (cls, label, items, speed) => `<div class="reach__row ${cls}"><div class="reach__track" data-marquee="${speed}"${cls.endsWith('tools') ? ' data-marquee-dir="-1"' : ''}>${[0, 1].map((k) => `<ul class="reach__run"${k ? ' aria-hidden="true"' : ` aria-label="${label}"`}>${items}</ul>`).join('')}</div></div>`;
  const inds = C.industries.map(([n, , a]) => `<li class="reach__chip">${doodle(a.doodle, { color: a.color })}${esc(n)}</li>`).join('');
  const marks = tools.map(([n, slug]) => `<li class="reach__chip reach__chip--tool"><img src="${techIcon(slug)}" alt="" width="22" height="22" loading="lazy">${esc(n)}</li>`).join('');
  return `<section class="reach" data-room="#62c1ff">
  <div class="wrap sec-head">
    <div>${kicker('Industries & stack', '', ['gear', 'mint'])}<h2 class="display display--l" data-words>${words('Industries we serve, <em>one production stack.</em>')}</h2></div>
    <p class="sec-head__lead">Where the products we build run, and what we build them with. <a class="ulink" href="./services#tools">The full stack →</a></p>
  </div>
  ${row('reach__row--ind', 'Industries we serve', inds, 90)}
  ${row('reach__row--tools', 'What we build with', marks, 80)}
</section>`;
};

// ---------- who we are ----------

const team = C.metrics.find((m) => /team/i.test(m.label));
const studio = () => `<section class="wrap studio" data-room="#ff85b8">
  <div class="studio__grid">
    ${print()}
    <div class="studio__words">
      ${kicker('Who we are', '', ['heart', 'pink'])}
      ${quote('var(--pink)')}
      <p class="studio__team" data-reveal>${esc(C.founder.name.split(' ')[0])} leads a team of ${team.value}${team.suffix} technologists, designers and strategists in Ahmedabad who build your product with you, as one long-term team.</p>
      <a class="ulink" href="./about-us">More about us →</a>
    </div>
  </div>
  ${metrics('metrics--big')}
  <figure class="office" data-office data-src="./assets/office3d.js" data-reveal>
    <div class="office__stage" role="img" aria-label="The Demaze crew at work in a small studio: two at their laptops, one getting coffee from the machine, two planning at the whiteboard"></div>
    <figcaption>Inside the studio: coding, coffee, and the plan on the board.</figcaption>
  </figure>
</section>`;

// ---------- start a project ----------

// A thin yellow route runs down from the studio and lands on the card's top edge right above its label, so the yellow is reached
// along the route rather than cut to.
const start = () => `<section class="start-wrap" data-room="#ffcb45">
  <div class="start__lead" aria-hidden="true"><svg viewBox="0 0 120 100" preserveAspectRatio="none"><path data-drawin data-dur="900" pathLength="1" d="M116 0V44H4V100"/></svg><i></i></div>
  <div class="start">
    <div class="start__copy">
      ${kicker('Start a project', '', ['rocket', 'tomato'])}
      <h2 class="display display--xl" data-words>${words('Got a maze? <em>We’ll map the route.</em>')}</h2>
      <p class="lead" data-reveal>Tell us the problem. We’ll map the route: what to build first, what to skip, and what comes next.</p>
      <div class="actions" data-reveal>${btn('Book a 30-min call', C.calendly, { tone: 'ink', size: 'lg', extra: 'target="_blank" rel="noopener"' })}${btn('Send a brief', './contact', { tone: 'line', size: 'lg', magnet: false })}</div>
      <p class="start__note" data-reveal>No sales deck. Just the problem, the context, and what you’re trying to build.</p>
      <div class="crew-band" data-crew aria-hidden="true"></div>
    </div>
    <div class="start__maze" data-tilt="4">${maze({ cols: 9, rows: 6, seed: 309, tone: 'day', pits: 4, start: 'Your problem', label: 'A route mapped through a maze, from your problem to launch' })}</div>
  </div>
</section>`;

module.exports = { hero, tape, howWeWork, work, services, reach, studio, start };
