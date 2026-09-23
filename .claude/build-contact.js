// One-off: rebuild contact.html main content and form behaviour.
const fs = require('fs');
const ROOT = 'C:/Users/singh/Claude/Projects/Framer/';
let s = fs.readFileSync(ROOT + 'contact.html', 'utf8');

const html = `<header class="dz-page-hero">
    <div class="dz-container">
      <span class="dz-eyebrow">Contact</span>
      <h1 class="dz-h1">Talk to the engineers who will build it</h1>
      <p class="dz-lead">Whether you need an end-to-end AI product built, custom software architecture, or a dedicated engineering team, tell us what you are working on.</p>
    </div>
  </header>

  <main id="main-content">
    <section class="dz-section dz-section--top0">
      <div class="dz-container dz-contact-page">
        <div class="dz-contact-methods">
          <div>
            <div class="dz-label">Email</div>
            <a class="dz-contact-big" href="mailto:contact@demazetech.com">contact@demazetech.com</a>
            <p>Send us your RFP, project brief, or technical questions.</p>
          </div>
          <div>
            <div class="dz-label">Book a call</div>
            <a class="dz-contact-big" href="mailto:contact@demazetech.com?subject=Call%20request">Request a 30-minute call</a>
            <p>Schedule an introductory architecture discussion.</p>
          </div>
          <div>
            <div class="dz-label">Office</div>
            <address>A 804, Ganesh Glory 11, Jagatpur Road, Near S.G. Highway, Gota, Ahmedabad, Gujarat 382481, India</address>
          </div>
        </div>

        <form class="dz-form" id="dzContactForm" novalidate>
          <h2 class="dz-h3">Send us a message</h2>
          <p class="dz-form-note">This opens your email app with the message ready to send to contact@demazetech.com.</p>
          <div class="dz-field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
          <div class="dz-field"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
          <div class="dz-field"><label for="f-subject">What do you need help with?</label><input id="f-subject" name="subject" type="text" placeholder="e.g. AI & ML, SaaS, custom app" required></div>
          <div class="dz-field"><label for="f-message">Project details</label><textarea id="f-message" name="message" rows="6" placeholder="Goals, existing stack, key features, timeline" required></textarea></div>
          <p class="dz-form-error" id="dzFormError" role="alert" hidden>Please fill in every field with a valid email address.</p>
          <button type="submit" class="dz-btn">Compose email</button>
        </form>
      </div>
    </section>
  </main>`;

const a = s.indexOf('<header class="demaze-subpage-hero');
const b = s.indexOf('</main>') + '</main>'.length;
if (a < 0 || b < a) throw new Error('markers');
s = s.slice(0, a) + html + s.slice(b);

// Replace the old simulated-submit script (first inline <script> after demaze-shared.js).
const shared = s.indexOf('<script src="/assets/demaze/demaze-shared.js"></script>');
const sa = s.indexOf('<script>', shared);
const se = s.indexOf('</script>', sa) + '</script>'.length;
s = s.slice(0, sa) + `<script>
    (function () {
      var form = document.getElementById('dzContactForm');
      var err = document.getElementById('dzFormError');
      if (!form) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { err.hidden = false; form.querySelector(':invalid').focus(); return; }
        err.hidden = true;
        var f = form.elements;
        var body = f.message.value + '\\n\\n' + f.name.value + '\\n' + f.email.value;
        window.location.href = 'mailto:contact@demazetech.com?subject=' + encodeURIComponent(f.subject.value) + '&body=' + encodeURIComponent(body);
      });
    })();
  </script>` + s.slice(se);
fs.writeFileSync(ROOT + 'contact.html', s);
console.log('contact rebuilt');
