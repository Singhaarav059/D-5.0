# Copy Review & Drift Audit Log

This document records the exact audit and reversion of all copy across Demaze Technologies pages against the ground truth data (`demaze/demaze-content.js` and original scraped content from Demaze).

## 1. Ground Truth Standardizations

### Service Names
All service references across homepage cards, subpages, and footer navigation are standardized to:
1. `AI & Machine Learning`
2. `Web, Mobile App & SaaS`
3. `Intelligent E-Commerce`
4. `Cloud Infrastructure`

*Previously drifted*: Home cards used abbreviated `AI & ML`, `Web / Mobile App / SaaS`, `Ecommerce`, `Cloud`. Now 100% consistent across all pages.

---

## 2. Reverted Strings by Section & Page

### A. CTA Banner (All Subpages & Home)
- **Drifted**:
  - `HAVE A VISION?` / `Let's build scalable products that perform.`
  - `READY TO COLLABORATE?` / `Demaze Technologies partners with startups, scale-ups, and established enterprises...`
  - `READY TO SCALE?` / `Partner with our engineering team to accelerate your product roadmap...` / `Schedule A Consultation`
  - `READY TO TRANSFORM?` / `Let's connect and build smarter, faster, stronger – together.`
- **Reverted to Original**:
  - **Heading**: `Have a bold product vision in mind?`
  - **Description**: `Let's discuss how Demaze Technologies can architect and engineer your next breakthrough digital product.`
  - **Button**: `Book A Strategy Session →` (linking to `/contact`)

### B. Contact Cards (Home & Subpages)
- **Location Card Action**:
  - *Drifted*: `Global Delivery`
  - *Reverted to Original*: `View Location →`
- **Calendly Card Body**:
  - *Drifted*: `Feel free to book a 30-minute strategy session at your convenience.` / `Lock in a 30-minute strategy session with our technical leads.`
  - *Reverted to Original*: `Feel free to book a call if that’s more convenient and easier for you.`

### C. Services Subpage (`services.html`)
- **Marquee Section**:
  - *Drifted*: Eyebrow `PLATFORMS & PARTNERS` and subtitle `Battle-tested enterprise frameworks and AI platforms we use to engineer production-ready systems.`
  - *Reverted to Original*: Removed invented subtitle; kept clean verified badge `TOOLS & TECHNOLOGIES`.
- **Industries Eyebrow**:
  - *Drifted*: `DOMAIN EXPERTISE`
  - *Reverted to Original*: `INDUSTRIES`

### D. About Us Subpage (`about-us.html`)
- **Page Hero**:
  - *Drifted*: Competing secondary heading `Bridging Complex Technical Possibilities with Measurable Business Outcomes` under `Digital Transformation Architects`, with eyebrow `WHAT WE ARE`.
  - *Reverted to Original*: Single clear hero with badge `ABOUT US` and `Who We Are`.
- **Chips**:
  - *Drifted*: `End-to-End Delivery`
  - *Reverted to Original*: `End-to-End Solutions` (matching Home page).
- **Values / Philosophy Section**:
  - *Drifted*: Eyebrow `OUR PHILOSOPHY`, subtitle `The four foundational pillars guiding every architecture we design and line of code we ship.`, and card eyebrows `PILLAR 01`, `PILLAR 02`, `PILLAR 03`, `PILLAR 04`.
  - *Reverted to Original*: Badge `WHAT DRIVES US`, removed invented subtitle, removed `PILLAR` tags, and restored exact original 4 values copy.
- **Why Choose Us Cards**:
  - *Drifted*: Unapproved marketing claims:
    - `"We integrate advanced AI, machine learning, and automation into your core systems..."`
    - `"With dozens of enterprise platforms deployed and over $10M..."`
  - *Reverted to Original*:
    - Card 1: `"We don't just build software; we create intelligent solutions that learn, adapt, and evolve. Our deep expertise in AI, machine learning, and emerging technologies ensures your business stays ahead of the curve with future-ready solutions that drive automation and growth."`
    - Card 2: `"From concept to deployment and beyond, we're your dedicated tech partner. We work as an extension of your team, providing comprehensive support across the entire development lifecycle while focusing on long-term success rather than just project delivery."`
    - Card 3: `"With 45+ successful projects across diverse industries and $10M+ generated for our clients, we bring measurable results. Our experienced team of 35+ professionals combines technical excellence with business acumen to deliver solutions that create real impact."`

### E. Contact Subpage (`contact.html`)
- **Form Fields**:
  - *Drifted*: Invented form fields `Subject of Interest` dropdown, `Target Timeline` dropdown, and placeholder `e.g. Alex Mercer`.
  - *Reverted to Original*: Restored original clean inputs (`Your name`, single subject text field `e.g. AI & ML, SaaS, Custom App`).
- **Cards**:
  - *Drifted*: Heading `Fast-Track Discovery Call`.
  - *Reverted to Original*: `Book with Calendly`.
