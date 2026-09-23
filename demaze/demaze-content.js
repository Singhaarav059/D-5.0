/**
 * Demaze content source of truth.
 * MOVIQ (repo HTML/CSS/Framer runtime) controls design; this file controls content only.
 * Populated from https://www.demazetech.com/ - 100% verified against live site.
 */
window.DEMAZE_CONTENT = {
  hero: {
    badge: "Expertise · Innovation · Partnership",
    headline: "Your Strategic Partner in Building Scalable AI Products",
    description:
      "We combine AI, software engineering, and automation with deep industry expertise to build scalable, sustainable solutions, working alongside you as a trusted, long-term partner.",
    primaryCTA: { text: "Let's Connect", href: "./contact" },
    secondaryCTA: { text: "Explore Services", href: "./services" },
    heroImage: null,
  },
  testimonial: {
    // From demazetech.com homepage, right after the Hero.
    quote:
      "We harness your vision and data to build AI-driven solutions that help your brand stand out and grow revenue. When you thrive, we thrive - and we're with you, executing every step of the way.",
    name: "Krupal Chaudhary",
    title: "Founder & CEO",
    avatar: "https://framerusercontent.com/images/e57nypBBfPrAXfYYyYgNJBgJBo.jpeg?width=895&height=980",
  },
  technologyStack: {
    // Verified Demaze Engineering Stack powering production systems
    eyebrow: "Engineering Stack",
    heading: "Tools & Technologies",
    subtitle:
      "AI frameworks, vector databases, and real-time streaming infrastructure powering our systems.",
    items: [
      { name: "Langchain", role: "LLM Orchestration", icon: "https://framerusercontent.com/images/6yzPxfL2zbqicuK8rRc9eMVRIkM.png" },
      { name: "Python", role: "Core AI & APIs", icon: "https://framerusercontent.com/images/m9s52nA5urnyuoWxNt414Ghwo.png" },
      { name: "Tensorflow", role: "Machine Learning Models", icon: "https://framerusercontent.com/images/ZDKJY420KwTFElm5cbE51nd1uI.png" },
      { name: "OpenAI", role: "Large Language Models", icon: "https://framerusercontent.com/images/XkdawulL9cthX7AFF1LI4bXv0o.png" },
      { name: "Hugging Face", role: "Open-Source AI Models", icon: "https://framerusercontent.com/images/MtA8cVDkuxvUGdyeyvSKiGb7qA.png" },
      { name: "Pinecone Database", role: "Vector Database", icon: "https://framerusercontent.com/images/nlfwFe7bR5JQliZS9i8AghDDzBg.png" },
      { name: "Apache Kafka", role: "Real-Time Streaming", icon: "https://framerusercontent.com/images/E38BAlxLDaA0pVazXApaqDRmLA.png" },
      { name: "Elastic Search", role: "Search & Indexing", icon: "https://framerusercontent.com/images/CEWChIc50KX3RlDIkbgZZdxje4M.png" },
    ],
  },
  engineeringSystems: {
    // Conceptual flow of Demaze's connected technology ecosystem
    eyebrow: "Engineering stack",
    heading: "Connected intelligence, built for production",
    subtitle:
      "How Demaze connects foundation AI models, orchestration frameworks, and real-time data infrastructure into resilient production software.",
    conceptualFlow: [
      { step: "01", label: "AI Models" },
      { step: "02", label: "Orchestration" },
      { step: "03", label: "Data & ML" },
      { step: "04", label: "Streaming & Search" },
      { step: "05", label: "Production Systems" },
    ],
    technologies: [
      {
        id: "openai",
        name: "OpenAI",
        role: "Large Language Models",
        layer: "AI Models",
        orbit: "inner",
        angle: 0,
        icon: "https://framerusercontent.com/images/XkdawulL9cthX7AFF1LI4bXv0o.png",
      },
      {
        id: "langchain",
        name: "LangChain",
        role: "LLM Orchestration",
        layer: "Orchestration",
        orbit: "inner",
        angle: 90,
        icon: "https://framerusercontent.com/images/6yzPxfL2zbqicuK8rRc9eMVRIkM.png",
      },
      {
        id: "python",
        name: "Python",
        role: "Core AI & APIs",
        layer: "Orchestration",
        orbit: "inner",
        angle: 180,
        icon: "https://framerusercontent.com/images/m9s52nA5urnyuoWxNt414Ghwo.png",
      },
      {
        id: "tensorflow",
        name: "TensorFlow",
        role: "Machine Learning Models",
        layer: "Data & ML",
        orbit: "inner",
        angle: 270,
        icon: "https://framerusercontent.com/images/ZDKJY420KwTFElm5cbE51nd1uI.png",
      },
      {
        id: "huggingface",
        name: "Hugging Face",
        role: "Open-Source AI Models",
        layer: "AI Models",
        orbit: "outer",
        angle: 45,
        icon: "https://framerusercontent.com/images/MtA8cVDkuxvUGdyeyvSKiGb7qA.png",
      },
      {
        id: "pinecone",
        name: "Pinecone Database",
        role: "Vector Database",
        layer: "Data & ML",
        orbit: "outer",
        angle: 135,
        icon: "https://framerusercontent.com/images/nlfwFe7bR5JQliZS9i8AghDDzBg.png",
      },
      {
        id: "kafka",
        name: "Apache Kafka",
        role: "Real-Time Streaming",
        layer: "Streaming & Search",
        orbit: "outer",
        angle: 225,
        icon: "https://framerusercontent.com/images/E38BAlxLDaA0pVazXApaqDRmLA.png",
      },
      {
        id: "elasticsearch",
        name: "Elasticsearch",
        role: "Search & Indexing",
        layer: "Streaming & Search",
        orbit: "outer",
        angle: 315,
        icon: "https://framerusercontent.com/images/CEWChIc50KX3RlDIkbgZZdxje4M.png",
      },
    ],
  },
  process: {
    // From demazetech.com homepage "HOW WE WORK: Our Process" (4 verified steps)
    eyebrow: "How we work",
    heading: "From discovery to scale, in 2–3 week sprints",
    subtitle:
      "A sprint-driven workflow designed to deliver working software on schedule, with full architectural transparency.",
    steps: [
      {
        id: "01",
        title: "Discover & Define",
        description:
          "We analyze your requirements, audit existing systems, and define technical blueprints and data models before writing code.",
        deliverables: [
          "Workflow & system audits",
          "Technical blueprint & API contracts",
          "Security & governance review",
        ],
      },
      {
        id: "02",
        title: "Design & Prototype",
        description:
          "Interactive prototypes validate user flows and verify requirements with real feedback.",
        deliverables: [
          "Clickable wireframes & UX flows",
          "High-fidelity design system",
          "Stakeholder alignment & review",
        ],
      },
      {
        id: "03",
        title: "Build & Integrate",
        description:
          "Sprint-based engineering and continuous automated testing, in close collaboration with your team.",
        deliverables: [
          "2–3 week sprints & progress reviews",
          "Automated CI/CD & unit tests",
          "Staging validation & code reviews",
        ],
      },
      {
        id: "04",
        title: "Launch & Scale",
        description:
          "Production cutover, performance monitoring, team training, and continued scaling support.",
        deliverables: [
          "Production cutover & monitoring",
          "Full code ownership & documentation",
          "Post-launch support & iteration",
        ],
      },
    ],
  },
  visualShowcase: {
    // From demazetech.com homepage "OUR WORK: Featured Projects"
    heading: "Featured projects",
    eyebrow: "Our work",
    viewAllCTA: { text: "View all work", href: "./projects" },
    projects: [
      {
        title: "AI-based software for luxury car dealers",
        domainTag: "Automotive & Mobility",
        image: "https://framerusercontent.com/images/bVi4OWXFwyZEQNbjP5qntMAjM.png?width=3924&height=3500",
        description:
          "End-to-end dealership operations platform engineered for one of India's largest luxury automotive groups, streamlining used car appraisal algorithms, instant multi-bank EMI matrix calculations, and service bay refurbishment pipelines.",
        features: [
          "Accurate Valuation AI",
          "Instant Multi-Bank EMIs",
          "Refurbishment Workflow",
          "Sales CRM & Floor App",
        ],
        href: "./projects",
      },
      {
        title: "Investigative case management software",
        domainTag: "Legal Tech & Compliance",
        image: "https://framerusercontent.com/images/jHPfuoOX9UNd8Es5s5F3M8wzzo.png?width=4872&height=2740",
        description:
          "Secure, web-based operations workspace empowering private investigators with encrypted evidence indexing, automated forensic report generation, role-based document permissions, and subscription auto-deposit pricing.",
        features: [
          "Case File Indexing",
          "AI Evidence Analysis",
          "Document Automation",
          "Subscription Auto-Deposits",
        ],
        href: "./projects",
      },
      {
        title: "AI-powered luxury eCommerce platform",
        domainTag: "Intelligent E-Commerce",
        image: "https://framerusercontent.com/images/K9H6ej2APXMnI3TZXYvyYkXZtJQ.png?width=1962&height=1750",
        description:
          "High-performance lifestyle and luxury retail platform featuring virtual try-on models, interactive video live selling streams, a custom drag-and-drop CMS, and automated multi-channel inventory management.",
        features: [
          "AI Search & Virtual Try-Ons",
          "Custom Drag & Drop CMS",
          "Live Selling Video Engine",
          "Smart Inventory Automation",
        ],
        href: "./projects",
      },
      {
        title: "Global payment transfer platform",
        domainTag: "Financial AI & Banking",
        image: "https://framerusercontent.com/images/kyC8zhxd43towb5gNsnL6f6dFv8.png?width=3840&height=2160",
        description:
          "High-throughput cross-border remittance engine engineered with real-time foreign exchange rate feeds, automated AML/KYC identity screening, and bank-grade multi-tier settlement rails for global transfers.",
        features: [
          "Instant Cross-Border Transfers",
          "Real-Time FX Feed Engine",
          "Automated KYC/AML Screening",
          "Multi-Tier Bank Settlement",
        ],
        href: "./projects",
      },
    ],
  },
  coreCapabilities: {
    // Demaze Core Capabilities & Engineering Offerings
    eyebrow: "Core capabilities",
    heading: "Full-lifecycle AI and software engineering",
    subtitle: "From initial architecture to production deployment, built and maintained by senior engineers.",
    cardHref: "./services",
    items: [
      {
        id: "01",
        tag: "AI SYSTEMS",
        title: "AI & Machine Learning",
        image: "https://framerusercontent.com/images/Duf4IQUMIa6MIBdumJk5C3PYR5w.png",
        description:
          "Custom predictive algorithms, domain-tuned LLM agents, and computer vision pipelines engineered for complex enterprise operations.",
        grad: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)",
        shadow: "rgba(124, 58, 237, 0.35)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path><circle cx="12" cy="12" r="4"></circle></svg>',
        chips: [
          "Predictive Analytics & Forecasting",
          "NLP & Large Language Models",
          "Computer Vision & Image AI",
          "Generative AI & Model Tuning",
        ],
        subItems: [
          "Predictive Analytics & Forecasting",
          "NLP & Conversational AI",
          "Computer Vision & Image Processing",
          "Generative Models & Content Synthesis",
          "Recommendation Systems & Personalization",
          "AI Dashboards & Insights",
        ],
      },
      {
        id: "02",
        tag: "WEB & MOBILE",
        title: "Web, Mobile App & SaaS",
        image: "https://framerusercontent.com/images/YFL2wUsxGifdIbDr6qI69fyzZc.png",
        description:
          "Multi-tenant SaaS platforms, cross-platform mobile apps, and high-concurrency web systems with role-based access and API integrations.",
        grad: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
        shadow: "rgba(37, 99, 235, 0.35)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
        chips: [
          "Enterprise SaaS Platforms",
          "iOS & Android Mobile Apps",
          "Custom Web Applications",
          "Automated Workflow Engines",
        ],
        subItems: [
          "Web App Development",
          "Mobile App Development",
          "Custom SaaS Development",
          "Workflow Automation",
          "API Development & System Integration",
          "Progressive Web App (PWA)",
        ],
      },
      {
        id: "03",
        tag: "E-COMMERCE",
        title: "Intelligent E-Commerce",
        image: "https://framerusercontent.com/images/0K8yspLc6XlnFG9G9wxsXa7P1cQ.png",
        description:
          "Multi-vendor marketplace architectures, headless commerce engines, real-time inventory synchronization, and AI product recommendations.",
        grad: "linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #e11d48 100%)",
        shadow: "rgba(234, 88, 12, 0.35)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
        chips: [
          "Headless & D2C Marketplaces",
          "AI Personalization & Search",
          "Payment Gateway & Fraud Integration",
          "Subscription & Billing Engines",
        ],
        subItems: [
          "D2C / Multi-Vendor Marketplace",
          "AI-Powered Personalization & Recommendation",
          "Subscription / Rental & Recurring Billing Models",
          "Checkout, Payment & Fraud Protection",
          "Inventory, Fulfillment & Logistics Integration",
          "UI/UX for Storefront & Customer Experience",
        ],
      },
      {
        id: "04",
        tag: "CLOUD & DEVOPS",
        title: "Cloud Infrastructure",
        image: "https://framerusercontent.com/images/miuw5HMaBt8VhyOLvGTezxmbFhI.png",
        description:
          "Resilient AWS cloud architectures, containerized Kubernetes microservices, automated CI/CD pipelines, and encrypted data infrastructure.",
        grad: "linear-gradient(135deg, #0284c7 0%, #10b981 100%)",
        shadow: "rgba(2, 132, 199, 0.35)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>',
        chips: [
          "AWS & Cloud Architecture",
          "Kubernetes & Microservices",
          "Infrastructure Security & Monitoring",
          "Automated CI/CD Delivery",
        ],
        subItems: [
          "Cloud Migration & Modernization",
          "Cloud Native App Development",
          "Multi-Cloud & Hybrid Cloud Architecture",
          "Cloud Security, Compliance & Governance",
          "Observability, Monitoring & Performance Optimization",
          "Disaster Recovery, Backup & Business Continuity",
        ],
      },
    ],
  },
  aboutUs: {
    // From demazetech.com homepage "WHAT WE ARE: About us"
    whoWeAre: {
      eyebrow: "WHAT WE ARE",
      heading: "Who We Are",
      image: "https://framerusercontent.com/images/8dANM4w4wJIzmtS0xJgDEOS4rLc.png",
      paragraphs: [
        "Demaze Technologies is an engineering team of 35+ technologists and developers. We partner with growing companies to turn complex ideas into robust, production-ready digital products.",
        "We work directly alongside your internal team to design architecture, develop core features, and integrate scalable software into your daily operations.",
      ],
      badges: [],
    },
    whatDrivesUs: {
      heading: "What Drives Us",
      items: [
        {
          title: "Innovation at Our Core",
          image: "/assets/demaze/ai_execution_graphic_1789813451769.jpg",
          description:
            "We're driven by the challenge of turning ambitious ideas into reality. Every project is an opportunity to push boundaries and create something extraordinary that makes a meaningful impact.",
        },
        {
          title: "Client Success Obsession",
          image: "/assets/demaze/eng_ownership_graphic_1789813608834.jpg",
          description:
            "Your success is our success. We're motivated by seeing our clients achieve breakthrough results, streamline operations, and unlock new growth opportunities through the solutions we build together.",
        },
        {
          title: "Technology for Good",
          image: "/assets/demaze/cloud_scale_graphic_1789813631564.jpg",
          description:
            "We believe technology should empower, simplify, and enhance human potential. This drives us to create solutions that not only solve problems but also open new possibilities for businesses and their customers.",
        },
        {
          title: "Continuous Learning",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          description:
            "In a rapidly evolving tech landscape, we're driven by curiosity and the pursuit of excellence. We constantly evolve our skills and adopt emerging technologies to deliver the most advanced solutions.",
        },
      ],
    },
  },
  industries: {
    // Grounded Two-Tier Architecture: 6 Flagship Domains + 7 Supported Domains
    eyebrow: "Industries",
    heading: "Industries we know through the work",
    subtitle:
      "Our deepest expertise comes from building and shipping production software. Choose a domain to see the project behind it.",
    flagshipDomains: [
      {
        id: "01",
        name: "Automotive & Mobility",
        tagline: "Dealership & Workshop OS",
        caseProof: "AI-Based Software for Luxury Car Dealers",
        subItems: ["Automated Vehicle Valuation AI", "Instant Multi-Bank EMI Engines", "Dealership Operations OS", "Workshop Bay Scheduling", "Fleet Refurbishment Tracking"],
      },
      {
        id: "02",
        name: "Legal Tech & Compliance",
        tagline: "Investigative Case Management",
        caseProof: "Investigative Case Management Software",
        subItems: ["AI-Powered Evidence Tools", "Encrypted Document Vaults", "Automated Case Workflows", "Subscription Auto-Billing", "Audit Log Compliance"],
      },
      {
        id: "03",
        name: "Intelligent E-Commerce",
        tagline: "Marketplaces & Unified Commerce",
        caseProof: "AI-Powered Luxury eCommerce Platform",
        subItems: ["Multi-Vendor Marketplaces", "AI Personalization & Try-Ons", "Dynamic Auction Engines", "Custom Drag-and-Drop CMS", "Multi-Currency Checkout"],
      },
      {
        id: "04",
        name: "Logistics & Fleet Automation",
        tagline: "On-Demand Dispatch & Telematics",
        caseProof: "Multi-Shopper On-Demand Delivery & Dispatch",
        subItems: ["Dynamic Courier Dispatch", "Real-Time GPS Telematics", "Automated Route Optimization", "Multi-Store Batching", "Fulfillment Inventory Sync"],
      },
      {
        id: "05",
        name: "Financial AI & Banking",
        tagline: "Lending Analysis & Payment Rails",
        caseProof: "Global Payment Transfer Platform",
        subItems: ["AI Financial Statement Parsing", "Bank-Ready CMA Report Generation", "Cross-Border Payment Rails", "Automated KYC/AML Screening", "Balance Sheet Stress Testing"],
      },
      {
        id: "06",
        name: "Generative AI & Media",
        tagline: "Script-to-Visual Storyboarding",
        caseProof: "AI Storyboard Creation Engine for Films",
        subItems: ["Script-to-Image Generation", "Character Model Consistency", "Cinematic Framing Tools", "Director Production Packages", "Prompt-to-Scene Sequencing"],
      },
    ],
    secondaryDomains: [
      {
        id: "07",
        name: "Healthcare & Wellbeing",
        tagline: "Community & Senior Support",
        subItems: ["Senior Care Engagement Platforms", "Coaching & Counseling Portals", "Caregiver Dashboards", "Community Engagement Tools"],
      },
      {
        id: "08",
        name: "Education & EdTech",
        tagline: "Digital Learning & LMS",
        subItems: ["Learning Management Systems (LMS)", "Video Course Delivery", "Automated Grading Engines", "Certification Generation"],
      },
      {
        id: "09",
        name: "HR Tech & Talent",
        tagline: "Recruitment & Matching AI",
        subItems: ["Semantic Resume Parsing", "Candidate Matching Engines", "Interview Scheduling Automation", "Hiring Pipeline Analytics"],
      },
      {
        id: "10",
        name: "Enterprise SaaS & Workflows",
        tagline: "Operational Workspaces",
        subItems: ["Multi-Tenant SaaS Core", "Kanban Task Pipelines", "Geofenced Staff Verification", "Role-Based Document Permissions"],
      },
      {
        id: "11",
        name: "B2B Commerce & Procurement",
        tagline: "Corporate Gifting & Wholesale",
        subItems: ["Bulk Order Management", "Corporate Account Portals", "Procurement Workflows", "Multi-Company Invoicing"],
      },
      {
        id: "12",
        name: "Food & Delivery Operations",
        tagline: "Multi-Store Delivery Apps",
        subItems: ["Customer Mobile Ordering", "Multi-Store Catalog Sync", "Shopper Picking Workflows", "Courier Dispatch Integration"],
      },
      {
        id: "13",
        name: "Retail Storefronts & POS",
        tagline: "Omnichannel Operations",
        subItems: ["Omnichannel POS Sync", "Inventory Reconciliation", "Loyalty Program Engines", "Checkout Optimization"],
      },
    ],
    items: [
      { name: "Automotive & Mobility", subItems: ["Automated Vehicle Valuation AI", "Instant Multi-Bank EMI Engines", "Dealership Operations OS", "Workshop Bay Scheduling", "Fleet Refurbishment Tracking"] },
      { name: "Legal Tech & Compliance", subItems: ["AI-Powered Evidence Tools", "Encrypted Document Vaults", "Automated Case Workflows", "Subscription Auto-Billing", "Audit Log Compliance"] },
      { name: "Intelligent E-Commerce", subItems: ["Multi-Vendor Marketplaces", "AI Personalization & Try-Ons", "Dynamic Auction Engines", "Custom Drag-and-Drop CMS", "Multi-Currency Checkout"] },
      { name: "Logistics & Fleet Automation", subItems: ["Dynamic Courier Dispatch", "Real-Time GPS Telematics", "Automated Route Optimization", "Multi-Store Batching", "Fulfillment Inventory Sync"] },
      { name: "Financial AI & Banking", subItems: ["AI Financial Statement Parsing", "Bank-Ready CMA Report Generation", "Cross-Border Payment Rails", "Automated KYC/AML Screening", "Balance Sheet Stress Testing"] },
      { name: "Generative AI & Media", subItems: ["Script-to-Image Generation", "Character Model Consistency", "Cinematic Framing Tools", "Director Production Packages", "Prompt-to-Scene Sequencing"] },
      { name: "Healthcare & Wellbeing", subItems: ["Senior Care Engagement Platforms", "Coaching & Counseling Portals", "Caregiver Dashboards", "Community Engagement Tools"] },
      { name: "Education & EdTech", subItems: ["Learning Management Systems (LMS)", "Video Course Delivery", "Automated Grading Engines", "Certification Generation"] },
      { name: "HR Tech & Talent", subItems: ["Semantic Resume Parsing", "Candidate Matching Engines", "Interview Scheduling Automation", "Hiring Pipeline Analytics"] },
      { name: "Enterprise SaaS & Workflows", subItems: ["Multi-Tenant SaaS Core", "Kanban Task Pipelines", "Geofenced Staff Verification", "Role-Based Document Permissions"] },
      { name: "B2B Commerce & Procurement", subItems: ["Bulk Order Management", "Corporate Account Portals", "Procurement Workflows", "Multi-Company Invoicing"] },
      { name: "Food & Delivery Operations", subItems: ["Customer Mobile Ordering", "Multi-Store Catalog Sync", "Shopper Picking Workflows", "Courier Dispatch Integration"] },
      { name: "Retail Storefronts & POS", subItems: ["Omnichannel POS Sync", "Inventory Reconciliation", "Loyalty Program Engines", "Checkout Optimization"] },
    ],
  },
  whyDemaze: {
    // From demazetech.com homepage -> "BENEFITS: Why Choose Us"
    eyebrow: "BENEFITS",
    heading: "Why Choose Us",
    items: [
      {
        title: "AI-First Innovation",
        image: "https://framerusercontent.com/images/UoV40soWAuwc3apDIJ2CrWUKep0.png",
        description:
          "We don't just build software; we create intelligent solutions that learn, adapt, and evolve. Our deep expertise in AI, machine learning, and emerging technologies ensures your business stays ahead of the curve with future-ready solutions that drive automation and growth.",
      },
      {
        title: "End-to-End Partnership",
        image: "https://framerusercontent.com/images/ZuFdyAXcxKQErCF3yYmtowWit8Q.png",
        description:
          "From concept to deployment and beyond, we're your dedicated tech partner. We work as an extension of your team, providing comprehensive support across the entire development lifecycle while focusing on long-term success rather than just project delivery.",
      },
      {
        title: "Proven Track Record",
        image: "https://framerusercontent.com/images/jm0rrK5HlZW33kreUxCyYlYQzQ.png",
        description:
          "With 45+ successful projects across diverse industries and $10M+ generated for our clients, we bring measurable results. Our experienced team of 35+ professionals combines technical excellence with business acumen to deliver solutions that create real impact.",
      },
    ],
  },
  metrics: {
    // From demazetech.com homepage, directly under "BENEFITS: Why Choose Us".
    items: [
      { value: "45+", label: "Projects delivered" },
      { value: "$10M+", label: "Client value generated" },
      { value: "35+", label: "Technologists on the team" },
      { value: "6+", label: "Years in operation" },
    ],
  },
  faq: {
    // From demazetech.com homepage "FAQS: Questions? Answers!"
    eyebrow: "FAQ",
    heading: "Questions, answered",
    subheading: "Direct answers about our engineering process, timelines, code ownership, and engagement model.",
    items: [
      {
        question: "What makes Demaze different from other development companies?",
        answer:
          "We work as an embedded engineering partner rather than a transactional vendor. Every project is staffed by senior technologists who write clean, production-grade code, participate directly in technical reviews, and collaborate openly with your team. You retain 100% code ownership from day one.",
      },
      {
        question: "How long does it typically take to develop a custom solution?",
        answer:
          "Project timelines depend on the scope of the solution. Focused applications typically launch in 6 to 12 weeks, while most custom software takes 3 to 6 months. For large enterprise systems, development can span 6 to 12 months. During technical discovery, we establish a sprint roadmap with 2–3 week deliverables so your team always knows what is shipping next.",
      },
      {
        question: "Do you work with startups or only established enterprises?",
        answer:
          "We work with both early-stage startups and established companies. For startups, we build fast, modular MVPs designed to scale cleanly. For established businesses, we architect custom software, modernize legacy infrastructure, and automate internal workflows. In all cases, our engagement model adapts to your milestones and team structure.",
      },
      {
        question: "What ongoing support do you provide after project completion?",
        answer:
          "We provide dedicated post-launch support, including maintenance, system updates, performance monitoring, and technical assistance. We also provide training for your team, or continue working as your ongoing engineering partner for new feature rollouts.",
      },
      {
        question: "How do you ensure the security and confidentiality of our project?",
        answer:
          "We execute comprehensive non-disclosure agreements (NDAs) before discussing project specifics. All code is developed in secure environments and transmitted over encrypted communication channels. Our engineering team follows secure development practices, ensures regulatory compliance (including GDPR and CCPA), and enforces strict confidentiality across every project.",
      },
    ],
  },
  ctaBannerA: {
    heading: "Have a bold product vision in mind?",
    sub: "Let's discuss how Demaze Technologies can architect and engineer your next breakthrough digital product.",
    primaryCTA: { text: "Book A Strategy Session", href: "./contact" },
  },
  finalCTA: {
    // From demazetech.com homepage
    heading: "Discuss your product roadmap, technical architecture, or engineering requirements with our senior team.",
    primaryCTA: { text: "Book a call", href: "./contact" },
  },
  contact: {
    // From demazetech.com homepage "Contact: Reach Us At Anytime"
    eyebrow: "Contact",
    heading: "Talk to the engineers who will build it",
    cards: [
      {
        type: "email",
        label: "Email Us",
        title: "contact@demazetech.com",
        desc: "Send us your project brief or technical requirements directly.",
        link: "mailto:contact@demazetech.com",
      },
      {
        type: "call",
        label: "Book A Call",
        title: "Book with Calendly",
        desc: "Schedule an introductory architecture discussion.",
        link: "./contact",
      },
      {
        type: "location",
        label: "Office Location",
        title: "Ahmedabad, India",
        desc: "A 804, Ganesh Glory 11, Jagatpur road, Near S.G. Highway, Gota, Ahmedabad",
        link: "#",
      },
    ],
    form: {
      title: "Send Us a Message",
      fields: [
        { name: "name", label: "Name", type: "text", placeholder: "Your name" },
        { name: "email", label: "Email", type: "email", placeholder: "Your email address" },
        { name: "subject", label: "Subject Of Interest", type: "text", placeholder: "e.g. AI & ML, SaaS, Custom App" },
        { name: "message", label: "How may we assist you?", type: "textarea", placeholder: "Tell us about your project..." },
      ],
      submitText: "Submit",
    },
  },
  branding: {
    name: "Demaze Technologies",
    tagline: "Strategic AI & Software Engineering",
    navLinks: [
      { text: "Projects", href: "./projects" },
      { text: "Services", href: "./services" },
      { text: "About Us", href: "./about-us" },
      { text: "Contact Us", href: "./contact" },
    ],
    ctaButton: { text: "Book A Call", href: "./contact" },
    footerTagline:
      "Demaze Technologies partners with ambitious companies to build scalable digital products, AI systems, and cloud infrastructure with dedicated senior engineering teams.",
    footerLinks: [
      { text: "Projects", href: "./projects" },
      { text: "Services", href: "./services" },
      { text: "About Us", href: "./about-us" },
      { text: "Contact Us", href: "./contact" },
    ],
    footerNavLinks: [
      { text: "Projects", href: "./projects" },
      { text: "Services", href: "./services" },
      { text: "About Us", href: "./about-us" },
      { text: "Contact Us", href: "./contact" },
    ],
    footerServiceLinks: [
      { text: "AI & Machine Learning", href: "./services" },
      { text: "Web, Mobile App & SaaS", href: "./services" },
      { text: "Intelligent E-Commerce", href: "./services" },
      { text: "Cloud Infrastructure", href: "./services" },
    ],
    footerReachLinks: [
      { text: "contact@demazetech.com", href: "mailto:contact@demazetech.com" },
      { text: "Schedule Strategy Call", href: "./contact" },
      { text: "Ahmedabad, Gujarat, India", href: "./contact" },
    ],
    copyright: "Demaze Technologies © " + new Date().getFullYear() + ". All rights reserved.",
  },
};

