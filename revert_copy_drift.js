const fs = require('fs');

// 1. Update demaze-content.js service names and contact card wording
let contentJs = fs.readFileSync('demaze/demaze-content.js', 'utf8');
contentJs = contentJs.replace('title: "AI & ML",', 'title: "AI & Machine Learning",');
contentJs = contentJs.replace('title: "Web / Mobile App / SaaS",', 'title: "Web, Mobile App & SaaS",');
contentJs = contentJs.replace('title: "Ecommerce",', 'title: "Intelligent E-Commerce",');
contentJs = contentJs.replace('title: "Cloud",', 'title: "Cloud Infrastructure",');
fs.writeFileSync('demaze/demaze-content.js', contentJs, 'utf8');
console.log('Updated demaze-content.js service names');

// 2. Update about-us.html
let aboutHtml = fs.readFileSync('about-us.html', 'utf8');

// Remove WHAT WE ARE badge, keep clean hero
aboutHtml = aboutHtml.replace('<div class="demaze-badge-pill">WHAT WE ARE</div>', '<div class="demaze-badge-pill">ABOUT US</div>');

// Remove competing duplicate heading
aboutHtml = aboutHtml.replace(
  `        <h2 class="demaze-section-h2" style="text-align: left; margin-bottom: 20px;">
          Bridging Complex Technical Possibilities with <span class="demaze-gradient-text">Measurable Business Outcomes</span>
        </h2>`,
  `        <h2 class="demaze-section-h2" style="text-align: left; margin-bottom: 20px;">
          Who <span class="demaze-gradient-text">We Are</span>
        </h2>`
);

// Revert chips to match home (End-to-End Solutions)
aboutHtml = aboutHtml.replace('End-to-End Delivery', 'End-to-End Solutions');

// Revert Why Choose Us card descriptions
const origCard1 = "We don't just build software; we create intelligent solutions that learn, adapt, and evolve. Our deep expertise in AI, machine learning, and emerging technologies ensures your business stays ahead of the curve with future-ready solutions that drive automation and growth.";
const origCard2 = "From concept to deployment and beyond, we're your dedicated tech partner. We work as an extension of your team, providing comprehensive support across the entire development lifecycle while focusing on long-term success rather than just project delivery.";
const origCard3 = "With 45+ successful projects across diverse industries and $10M+ generated for our clients, we bring measurable results. Our experienced team of 35+ professionals combines technical excellence with business acumen to deliver solutions that create real impact.";

aboutHtml = aboutHtml.replace(
  /We integrate advanced AI, machine learning, and automation into your core systems to drive operational speed, intelligent decision making, and long-term moat\./g,
  origCard1
);
aboutHtml = aboutHtml.replace(
  /From architectural design to production launch and continuous scaling, our engineers function as an embedded, accountable extension of your executive leadership\./g,
  origCard2
);
aboutHtml = aboutHtml.replace(
  /With dozens of enterprise platforms deployed and over \$10M in measurable client value generated, our delivery framework is battle-tested and reliable\./g,
  origCard3
);

// Revert What Drives Us header & remove unapproved subtitle and PILLAR eyebrows
aboutHtml = aboutHtml.replace('<div class="demaze-badge-pill">OUR PHILOSOPHY</div>', '<div class="demaze-badge-pill">WHAT DRIVES US</div>');
aboutHtml = aboutHtml.replace('<p class="demaze-section-subtitle">The four foundational pillars guiding every architecture we design and line of code we ship.</p>', '');
aboutHtml = aboutHtml.replace(/<span class="about-bento-eyebrow">PILLAR \d+<\/span>\s*/g, '');

// Revert What Drives Us card texts to exact original
aboutHtml = aboutHtml.replace(
  "Every project is an opportunity to push boundaries and create something extraordinary that makes a meaningful, permanent impact.",
  "Every project is an opportunity to push boundaries and create something extraordinary that makes a meaningful impact."
);
aboutHtml = aboutHtml.replace(
  "Your success is our success. We're motivated by seeing our clients achieve breakthrough results, streamline operations, and unlock new growth opportunities.",
  "Your success is our success. We're motivated by seeing our clients achieve breakthrough results, streamline operations, and unlock new growth opportunities through the solutions we build together."
);
aboutHtml = aboutHtml.replace(
  "We believe technology should empower, simplify, and enhance human potential, solving complex challenges and creating lasting positive change.",
  "We believe technology should empower, simplify, and enhance human potential. This drives us to create solutions that not only solve problems but also open new possibilities for businesses and their customers."
);
aboutHtml = aboutHtml.replace(
  "In a rapidly evolving tech landscape, we're driven by curiosity and the pursuit of excellence. We constantly evolve our skills and adopt emerging AI models to deliver the most advanced solutions.",
  "In a rapidly evolving tech landscape, we're driven by curiosity and the pursuit of excellence. We constantly evolve our skills and adopt emerging technologies to deliver the most advanced solutions."
);

// Revert CTA banner in about-us.html
aboutHtml = aboutHtml.replace(
  `<div class="demaze-cta-eyebrow">READY TO TRANSFORM?</div>
        <h2 class="demaze-cta-heading">Let's connect and build <span class="demaze-gradient-word">smarter, faster, stronger</span> – together.</h2>
        <p class="demaze-cta-desc">
          Reach out to our leadership team to evaluate technical feasibility, explore system architecture, and launch your project.
        </p>
        <a href="/contact" class="demaze-btn-primary" style="padding: 12px 28px; font-size: 14px;">Let's Connect →</a>`,
  `<h2 class="demaze-cta-heading">Have a bold <span class="demaze-gradient-word">product vision</span> in mind?</h2>
        <p class="demaze-cta-desc">
          Let's discuss how Demaze Technologies can architect and engineer your next breakthrough digital product.
        </p>
        <a href="/contact" class="demaze-btn-primary" style="padding: 12px 28px; font-size: 14px;">Book A Strategy Session →</a>`
);

// Revert contact cards text
aboutHtml = aboutHtml.replace(
  '<p>Feel free to book a 30-minute strategy session at your convenience.</p>',
  '<p>Feel free to book a call if that’s more convenient and easier for you.</p>'
);
aboutHtml = aboutHtml.replace('<div class="demaze-contact-action">Global Delivery</div>', '<div class="demaze-contact-action">View Location &rarr;</div>');

fs.writeFileSync('about-us.html', aboutHtml, 'utf8');
console.log('Updated about-us.html copy');

// 3. Update projects.html
let projHtml = fs.readFileSync('projects.html', 'utf8');
projHtml = projHtml.replace(
  `<div class="demaze-cta-eyebrow">HAVE A VISION?</div>
        <h2 class="demaze-cta-heading">Let's build <span class="demaze-gradient-word">scalable products</span> that perform.</h2>
        <p class="demaze-cta-desc">
          Let's discuss how Demaze Technologies can architect and engineer your next breakthrough digital product.
        </p>
        <a href="/contact" class="demaze-btn-primary" style="padding: 12px 28px; font-size: 14px;">Book A Strategy Session →</a>`,
  `<h2 class="demaze-cta-heading">Have a bold <span class="demaze-gradient-word">product vision</span> in mind?</h2>
        <p class="demaze-cta-desc">
          Let's discuss how Demaze Technologies can architect and engineer your next breakthrough digital product.
        </p>
        <a href="/contact" class="demaze-btn-primary" style="padding: 12px 28px; font-size: 14px;">Book A Strategy Session →</a>`
);

projHtml = projHtml.replace(
  '<p>Feel free to book a 30-minute strategy session at your convenience.</p>',
  '<p>Feel free to book a call if that’s more convenient and easier for you.</p>'
);
projHtml = projHtml.replace('<div class="demaze-contact-action">Global Delivery</div>', '<div class="demaze-contact-action">View Location &rarr;</div>');

fs.writeFileSync('projects.html', projHtml, 'utf8');
console.log('Updated projects.html copy');

// 4. Update services.html
let servHtml = fs.readFileSync('services.html', 'utf8');
// Remove unapproved marquee subtitle
servHtml = servHtml.replace(
  '<p class="demaze-section-subtitle">Battle-tested enterprise frameworks and AI platforms we use to engineer production-ready systems.</p>',
  ''
);

// Revert DOMAIN EXPERTISE to INDUSTRIES
servHtml = servHtml.replace('<div class="demaze-badge-pill">DOMAIN EXPERTISE</div>', '<div class="demaze-badge-pill">INDUSTRIES</div>');

// Revert CTA banner
servHtml = servHtml.replace(
  `<div class="demaze-cta-eyebrow">READY TO SCALE?</div>
        <h2 class="demaze-cta-heading">Let's connect and build <span class="demaze-gradient-word">smarter, faster, stronger</span> – together.</h2>
        <p class="demaze-cta-desc">
          Partner with our engineering team to accelerate your product roadmap and bring your AI vision to life.
        </p>
        <a href="/contact" class="demaze-btn-primary" style="padding: 12px 28px; font-size: 14px;">Schedule A Consultation →</a>`,
  `<h2 class="demaze-cta-heading">Have a bold <span class="demaze-gradient-word">product vision</span> in mind?</h2>
        <p class="demaze-cta-desc">
          Let's discuss how Demaze Technologies can architect and engineer your next breakthrough digital product.
        </p>
        <a href="/contact" class="demaze-btn-primary" style="padding: 12px 28px; font-size: 14px;">Book A Strategy Session →</a>`
);

servHtml = servHtml.replace(
  '<p>Feel free to book a 30-minute strategy session at your convenience.</p>',
  '<p>Feel free to book a call if that’s more convenient and easier for you.</p>'
);
servHtml = servHtml.replace('<div class="demaze-contact-action">Global Delivery</div>', '<div class="demaze-contact-action">View Location &rarr;</div>');

fs.writeFileSync('services.html', servHtml, 'utf8');
console.log('Updated services.html copy');

// 5. Update contact.html
let contactHtml = fs.readFileSync('contact.html', 'utf8');

// Revert form fields and placeholders
contactHtml = contactHtml.replace('placeholder="e.g. Alex Mercer"', 'placeholder="Your name"');
contactHtml = contactHtml.replace(
  `<div class="form-group-row">
            <div class="form-group">
              <label for="subject">Subject of Interest *</label>
              <select id="subject" required class="form-select">
                <option value="" disabled selected>Select Primary Need</option>
                <option value="AI & ML">AI & Machine Learning</option>
                <option value="Custom SaaS">Custom SaaS / Web Platform</option>
                <option value="Mobile App">Mobile App Development</option>
                <option value="Ecommerce">Intelligent E-Commerce</option>
                <option value="Cloud Architecture">Cloud Architecture & DevOps</option>
              </select>
            </div>
            <div class="form-group">
              <label for="timeline">Target Timeline</label>
              <select id="timeline" class="form-select">
                <option value="immediate">Immediate (Next 2-4 weeks)</option>
                <option value="1-3months" selected>1 to 3 months</option>
                <option value="3-6months">3 to 6 months</option>
                <option value="exploratory">Exploratory / Discovery</option>
              </select>
            </div>
          </div>`,
  `<div class="form-group">
            <label for="subject">Subject Of Interest *</label>
            <input type="text" id="subject" required class="form-input" placeholder="e.g. AI & ML, SaaS, Custom App">
          </div>`
);

// Revert card text
contactHtml = contactHtml.replace('<h4>Fast-Track Discovery Call</h4>', '<h4>Book with Calendly</h4>');
contactHtml = contactHtml.replace(
  '<p>Lock in a 30-minute strategy session with our technical leads.</p>',
  '<p>Feel free to book a call if that’s more convenient and easier for you.</p>'
);
contactHtml = contactHtml.replace('Global Delivery', 'View Location &rarr;');

// Revert CTA banner in contact.html
contactHtml = contactHtml.replace(
  `<div class="demaze-cta-eyebrow">READY TO COLLABORATE?</div>
        <h2 class="demaze-cta-heading">Let's connect and build <span class="demaze-gradient-word">smarter, faster, stronger</span> – together.</h2>
        <p class="demaze-cta-desc">
          Demaze Technologies partners with startups, scale-ups, and established enterprises to deliver high-performance digital products.
        </p>
        <a href="mailto:contact@demazetech.com" class="demaze-btn-primary" style="padding: 12px 28px; font-size: 14px;">Email Us Directly →</a>`,
  `<h2 class="demaze-cta-heading">Have a bold <span class="demaze-gradient-word">product vision</span> in mind?</h2>
        <p class="demaze-cta-desc">
          Let's discuss how Demaze Technologies can architect and engineer your next breakthrough digital product.
        </p>
        <a href="mailto:contact@demazetech.com" class="demaze-btn-primary" style="padding: 12px 28px; font-size: 14px;">Book A Strategy Session →</a>`
);

fs.writeFileSync('contact.html', contactHtml, 'utf8');
console.log('Updated contact.html copy');
