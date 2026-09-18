/**
 * Demaze content source of truth.
 * MOVIQ (repo HTML/CSS/Framer runtime) controls design; this file controls content only.
 * Populated from https://www.demazetech.com/ — do not invent values here.
 */
window.DEMAZE_CONTENT = {
  hero: {
    badge: "Expertise | Innovation | Partnership",
    headline: "Your Strategic Partner in Building Scalable AI Products",
    description:
      "We combine AI, software engineering, and automation with deep industry expertise to build scalable, sustainable solutions, working alongside you as a trusted, long-term partner.",
    primaryCTA: { text: "Let's Connect", href: "./contact" },
    secondaryCTA: { text: "Explore Services", href: "./services" },
  },
  technologyStack: {
    // From demazetech.com/services -> "Platforms & Partners: Tools & Technologies"
    // (AI & ML and Web tabs). A representative subset, not the full list.
    heading: "Tools & Technologies",
    items: [
      { name: "Python", icon: "https://api.iconify.design/simple-icons/python.svg?color=%233776AB" },
      { name: "TensorFlow", icon: "https://api.iconify.design/simple-icons/tensorflow.svg?color=%23FF6F00" },
      { name: "OpenAI", icon: "https://api.iconify.design/simple-icons/openai.svg?color=%23412991" },
      { name: "React.js", icon: "https://api.iconify.design/simple-icons/react.svg?color=%2361DAFB" },
      { name: "Node.js", icon: "https://api.iconify.design/simple-icons/nodedotjs.svg?color=%23339933" },
      { name: "MongoDB", icon: "https://api.iconify.design/simple-icons/mongodb.svg?color=%2347A248" },
    ],
  },
  visualShowcase: {
    // From demazetech.com homepage "OUR WORK: The Project we did!" — the 4
    // projects featured there. Descriptions from the homepage cards; feature
    // bullets from the matching cards on demazetech.com/projects.
    heading: "The Project we did!",
    eyebrow: "OUR WORK",
    projects: [
      {
        title: "AI-Based software for luxury car dealers",
        image: "https://framerusercontent.com/images/bVi4OWXFwyZEQNbjP5qntMAjM.png?width=3924&height=3500",
        description:
          "This comprehensive AI-based software solution was developed for one of India's largest luxury car dealerships to streamline various operations, including used car valuation, new car EMI calculations, car refurbishment management, and serving as a powerful backend system for the sales team. The tool enhances operational efficiency and significantly improves the customer experience, making it an indispensable asset for the dealership.",
        features: [
          "Accurate Used Car Valuations",
          "Instant New Car EMIs",
          "Seamless Car Refurbishment",
          "Efficient Sales Team Backend",
        ],
      },
      {
        title: "Investigative Case Management Software",
        image: "https://framerusercontent.com/images/jHPfuoOX9UNd8Es5s5F3M8wzzo.png?width=4872&height=2740",
        description:
          "It is an advanced web-based software designed to enhance the capabilities of private investigators with AI-powered tools and comprehensive case management features. It supports seamless organization of case information and media, secure data storage, and automated workflow management, accessible from anywhere.",
        features: [
          "Case Management",
          "AI-Powered Tools",
          "Document Automation, Subscription-based Auto deposit pricing model",
          "Web-Based Access & Data Security",
        ],
      },
      {
        title: "AI-Powered luxury eCommerce Platform",
        image: "https://framerusercontent.com/images/K9H6ej2APXMnI3TZXYvyYkXZtJQ.png?width=1962&height=1750",
        description:
          "Developed a modern e-commerce and lifestyle platform focused on sustainability and luxury retail. The project involved designing and implementing intuitive user journeys, personalization mechanisms, and secure data handling to ensure a premium digital experience. The result was a scalable, user-friendly solution aligned with the client's vision for innovation and environmental responsibility.",
        features: [
          "AI-Powered Search, Try-ons, Recommendations, Price models",
          "AI-Powered Dashboard & Analytics, Custom Drag & Drop CMS",
          "Live Selling, Workflow Automations, Product Authentication",
          "Smart Order & Inventory Management",
        ],
      },
      {
        title: "Senior Engagement & Support platform",
        image: "https://framerusercontent.com/images/VsL7mX1NiP3eW5xTBH6fPjjVFfw.png?width=3924&height=3500",
        description:
          "Sukoon Unlimited is an innovative platform designed to help seniors lead a connected, purposeful, and fulfilled life by providing access to support, meaningful conversations, and activities. The platform offers various services including personalized coaching, meetups, and a community of compassionate individuals, all aimed at reducing isolation and fostering connections. Sukoon Unlimited serves as a dedicated space for seniors to share experiences, seek guidance, and participate in enriching discussions that enhance mental and emotional well-being.",
        features: [
          "Speak with Sarathis, Club Sukoon",
          "Coaching and Counseling",
          "Meetups and Social Engagements",
          "Sukoon Corner Blog",
        ],
      },
    ],
  },
  coreCapabilities: {
    // From demazetech.com/services -> "Apps, websites, AI and more" and its
    // 4 service categories. Demaze has 4 real categories; MOVIQ's grid has
    // 6 card slots, so the 2 unused slots are hidden rather than invented.
    eyebrow: "SERVICES",
    heading: "Apps, websites, AI and more",
    items: [
      {
        title: "AI & ML",
        description:
          "We build AI-powered solutions that transform data into insights, automate complex tasks, and drive smarter decisions. From predictive analytics to computer vision and generative AI, our systems help businesses innovate and scale with confidence.",
      },
      {
        title: "Web / Mobile App / SaaS",
        description:
          "We create scalable software and applications that deliver seamless user experiences and business value. From enterprise SaaS platforms to web and mobile apps, our solutions are built to perform, adapt, and grow with your needs.",
      },
      {
        title: "Ecommerce",
        description:
          "We build intelligent eCommerce platforms that elevate shopping experiences, improve conversions, and drive growth. From multi-vendor marketplaces to subscription commerce and AI-powered personalization, our solutions help retailers thrive in the digital-first era.",
      },
      {
        title: "Cloud",
        description:
          "We design cloud architectures that ensure scalability, security, and resilience for modern businesses. From cloud migration to DevOps automation and disaster recovery, our services help you optimize performance and reduce costs.",
      },
    ],
    cardHref: "./services",
  },
  whyDemaze: {
    // From demazetech.com homepage -> "BENEFITS: Why Choose Us" (3 items,
    // just after Industries). MOVIQ's original section here is a 2-column
    // "us vs. traditional" comparison table; Demaze has no competitor
    // comparison, so it's rebuilt as 3 real cards instead.
    eyebrow: "BENEFITS",
    heading: "Why Choose Us",
    items: [
      {
        title: "AI-First Innovation",
        description:
          "We don't just build software; we create intelligent solutions that learn, adapt, and evolve. Our deep expertise in AI, machine learning, and emerging technologies ensures your business stays ahead of the curve with future-ready solutions that drive automation and growth.",
      },
      {
        title: "End-to-End Partnership",
        description:
          "From concept to deployment and beyond, we're your dedicated tech partner. We work as an extension of your team, providing comprehensive support across the entire development lifecycle while focusing on long-term success rather than just project delivery.",
      },
      {
        title: "Proven Track Record",
        description:
          "With 45+ successful projects across diverse industries and $10M+ generated for our clients, we bring measurable results. Our experienced team of 35+ professionals combines technical excellence with business acumen to deliver solutions that create real impact.",
      },
    ],
  },
  finalCTA: {
    // From demazetech.com homepage, just before the Contact section.
    heading: "Let's connect and build smarter, faster, and stronger - together.",
    primaryCTA: { text: "Let's Connect", href: "./contact" },
  },
};
