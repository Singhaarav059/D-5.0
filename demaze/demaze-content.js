/**
 * Demaze content source of truth.
 * MOVIQ (repo HTML/CSS/Framer runtime) controls design; this file controls content only.
 * Populated from https://www.demazetech.com/ — 100% verified against live site.
 */
window.DEMAZE_CONTENT = {
  hero: {
    badge: "Expertise | Innovation | Partnership",
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
    // From demazetech.com homepage -> "Platforms & Partners: Tools & Technologies" (AI & ML)
    eyebrow: "Platforms & Partners",
    heading: "Tools & Technologies",
    items: [
      { name: "Langchain", icon: "https://framerusercontent.com/images/6yzPxfL2zbqicuK8rRc9eMVRIkM.png" },
      { name: "Python", icon: "https://framerusercontent.com/images/m9s52nA5urnyuoWxNt414Ghwo.png" },
      { name: "Tensorflow", icon: "https://framerusercontent.com/images/ZDKJY420KwTFElm5cbE51nd1uI.png" },
      { name: "OpenAI", icon: "https://framerusercontent.com/images/XkdawulL9cthX7AFF1LI4bXv0o.png" },
      { name: "Hugging Face", icon: "https://framerusercontent.com/images/MtA8cVDkuxvUGdyeyvSKiGb7qA.png" },
      { name: "Pinecone Database", icon: "https://framerusercontent.com/images/nlfwFe7bR5JQliZS9i8AghDDzBg.png" },
      { name: "Apache Kafka", icon: "https://framerusercontent.com/images/E38BAlxLDaA0pVazXApaqDRmLA.png" },
      { name: "Elastic Search", icon: "https://framerusercontent.com/images/CEWChIc50KX3RlDIkbgZZdxje4M.png" },
    ],
  },
  process: {
    // From demazetech.com homepage "HOW WE WORK: Our Process" (4 real steps)
    eyebrow: "HOW WE WORK",
    heading: "Our Process",
    steps: [
      {
        title: "Discover & Define",
        description:
          "We start by understanding your vision, challenges, and goals. Through deep discovery workshops and research, we define clear requirements and success metrics.",
      },
      {
        title: "Design & Prototype",
        description:
          "Ideas take shape with user-focused designs and interactive prototypes. This ensures alignment, clarity, and a shared vision before development begins.",
      },
      {
        title: "Build & Integrate",
        description:
          "Our engineering team develops scalable, secure, and high-performance solutions. We follow agile methods, ensuring continuous feedback and seamless system integration.",
      },
      {
        title: "Launch & Scale",
        description:
          "Once tested and refined, we launch with confidence. Beyond delivery, we support you in scaling, optimizing, and evolving the product for long-term growth.",
      },
    ],
  },
  visualShowcase: {
    // From demazetech.com homepage "OUR WORK: The Project we did!"
    heading: "The Project we did!",
    eyebrow: "OUR WORK",
    viewAllCTA: { text: "View all work", href: "./projects" },
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
    // From demazetech.com homepage -> "SERVICES: Apps, websites, AI and more"
    eyebrow: "SERVICES",
    heading: "Apps, websites, AI and more",
    cardHref: "./services",
    items: [
      {
        title: "AI & ML",
        image: "https://framerusercontent.com/images/Duf4IQUMIa6MIBdumJk5C3PYR5w.png",
        description:
          "We build AI-powered solutions that transform data into insights, automate complex tasks, and drive smarter decisions. From predictive analytics to computer vision and generative AI, our systems help businesses innovate and scale with confidence.",
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
        title: "Web / Mobile App / SaaS",
        image: "https://framerusercontent.com/images/YFL2wUsxGifdIbDr6qI69fyzZc.png",
        description:
          "We create scalable software and applications that deliver seamless user experiences and business value. From enterprise SaaS platforms to web and mobile apps, our solutions are built to perform, adapt, and grow with your needs.",
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
        title: "Ecommerce",
        image: "https://framerusercontent.com/images/0K8yspLc6XlnFG9G9wxsXa7P1cQ.png",
        description:
          "We build intelligent eCommerce platforms that elevate shopping experiences, improve conversions, and drive growth. From multi-vendor marketplaces to subscription commerce and AI-powered personalization, our solutions help retailers thrive in the digital-first era.",
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
        title: "Cloud",
        image: "https://framerusercontent.com/images/miuw5HMaBt8VhyOLvGTezxmbFhI.png",
        description:
          "We design cloud architectures that ensure scalability, security, and resilience for modern businesses. From cloud migration to DevOps automation and disaster recovery, our services help you optimize performance and reduce costs.",
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
        "At Demaze Technologies, we're more than just developers; we're digital transformation architects. We're a passionate team of 35+ technologists, innovators, and strategic thinkers who believe in the power of AI and cutting-edge technology to reshape businesses.",
        "Founded with a vision to democratize advanced technology, we bridge the gap between complex technical possibilities and real business outcomes.",
      ],
      badges: [
        "Scalable Solutions",
        "Digital Transformation",
        "Future-Ready Architecture",
        "Automation Excellence",
        "Strategic Partnership",
        "Cutting-Edge Technology",
        "Business Intelligence",
        "Agile Development",
        "End-to-End Solutions",
      ],
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
    // From demazetech.com homepage "INDUSTRIES: Industries We Serve" (19 real categories)
    eyebrow: "INDUSTRIES",
    heading: "Industries We Serve",
    items: [
      { name: "Healthcare", subItems: ["Telemedicine Platforms", "Electronic Health Records (EHR)", "Patient Management Systems", "Appointment Scheduling Software", "Healthcare Analytics Platforms", "Wellness Tracking Applications", "Medical Device Integration", "Hospital Management Systems"] },
      { name: "Fintech", subItems: ["Digital Payment Platforms", "Mobile Banking Applications", "Cryptocurrency Wallets", "Peer-to-Peer Payment Systems", "Lending Management Software", "Credit Scoring Systems", "Financial Analytics Tools", "Blockchain Payment Solutions", "Trading Platform Development"] },
      { name: "Logistics", subItems: ["Delivery Management Systems", "Shipping Logistics Management", "Fleet Management Software", "Inventory Management Software", "Telematics Software Development", "Warehouse Management Systems", "Route Optimization Platforms", "Supply Chain Visibility Tools", "Last-Mile Delivery Solutions"] },
      { name: "Retail", subItems: ["Point-of-Sale (POS) Systems", "Inventory Management Platforms", "Customer Loyalty Programs", "Staff Management Software", "Omnichannel Retail Solutions", "Price Management Systems", "Retail Analytics Dashboards", "Store Operations Management", "Customer Relationship Management"] },
      { name: "Ecommerce", subItems: ["Multi-Vendor Marketplaces", "B2B Ecommerce Platforms", "B2C Online Stores", "Shopping Cart Development", "Payment Gateway Integration", "Product Recommendation Engines", "Order Management Systems", "Customer Review Platforms", "Auction & Bidding Systems"] },
      { name: "Education", subItems: ["Learning Management Systems (LMS)", "Online Course Platforms", "Virtual Classroom Software", "Student Information Systems", "Assessment & Testing Platforms", "Educational Content Management", "VR Learning Applications", "AI-Powered Tutoring Systems", "Certification Management"] },
      { name: "BFSI Solutions", subItems: ["Core Banking Systems", "Insurance Management Platforms", "Loan Origination Systems", "Credit Monitoring Software", "Regulatory Compliance Tools", "Risk Management Systems", "Customer Onboarding Solutions", "Anti-Money Laundering (AML) Tools", "Investment Portfolio Management"] },
      { name: "Sports & Gaming", subItems: ["Fantasy Sports Platforms", "Gaming Applications", "Tournament Management Systems", "Live Streaming Applications", "Sports Analytics Platforms", "Community Gaming Solutions", "Leaderboard Systems", "In-Game Payment Solutions", "Sports Betting Platforms"] },
      { name: "Energy & Utility", subItems: ["Smart Grid Management", "Energy Monitoring Systems", "Utility Billing Platforms", "Renewable Energy Management", "Consumption Analytics Tools", "IoT Sensor Integration", "Energy Trading Platforms", "Grid Optimization Software", "Meter Data Management"] },
      { name: "Real Estate", subItems: ["Property Management Systems", "Virtual Tour Platforms", "Real Estate CRM Solutions", "Rental Management Applications", "Property Listing Websites", "Automated Valuation Models", "Property Investment Platforms", "Facility Management Software", "Real Estate Analytics Tools"] },
      { name: "Media & Entertainment", subItems: ["Content Management Systems", "Streaming Platforms", "Digital Asset Management", "Social Media Applications", "Video Processing Tools", "AI Content Creation Platforms", "Live Broadcasting Solutions", "Creative Collaboration Tools", "Subscription Management Systems"] },
      { name: "SaaS Products", subItems: ["Multi-Tenant Applications", "Subscription Management Systems", "Cloud-Native Platforms", "API Development & Integration", "Analytics Dashboard Solutions", "Customer Success Platforms", "Workflow Automation Tools", "Data Management Systems", "Enterprise Software Solutions"] },
      { name: "Automotive", subItems: ["Dealership Management Systems", "Vehicle Valuation Tools", "Service Scheduling Platforms", "Car Rental Management", "Fleet Tracking Systems", "Automotive CRM Solutions", "Parts Inventory Management", "Customer Engagement Platforms", "Vehicle Financing Calculators"] },
      { name: "Food & Beverage", subItems: ["Food Delivery Platforms", "Restaurant Management Systems", "Kitchen Display Systems", "Menu Management Software", "Food Safety Compliance Tools", "Inventory Tracking Systems", "Customer Ordering Apps", "Multi-Vendor Food Marketplaces", "Recipe Management Systems"] },
      { name: "Legal & Professional Services", subItems: ["Case Management Systems", "Document Automation Tools", "Legal Practice Management", "Time & Billing Software", "Client Portal Systems", "Contract Management Solutions", "Compliance Tracking Tools", "Legal Research Platforms", "Court Filing Systems"] },
      { name: "Human Resources", subItems: ["Applicant Tracking Systems", "Employee Onboarding Platforms", "Performance Management Tools", "Payroll Management Systems", "Workforce Analytics Solutions", "Employee Self-Service Portals", "Talent Acquisition Platforms", "HR Compliance Software", "Learning & Development Systems"] },
      { name: "Insurance", subItems: ["Policy Management Systems", "Claims Processing Automation", "Insurance CRM Solutions", "Premium Calculation Tools", "Underwriting Software", "Customer Self-Service Portals", "Insurance Mobile Applications", "Risk Assessment Tools", "Regulatory Reporting Systems"] },
      { name: "Social Commerce", subItems: ["Social Media Platforms", "Peer-to-Peer Marketplaces", "Community Management Systems", "Social Shopping Applications", "Influencer Marketing Platforms", "User-Generated Content Systems", "Social Analytics Tools", "Crypto Wallet Integration", "Social Gaming Features"] },
      { name: "Manufacturing & B2B", subItems: ["Supply Chain Management", "Vendor Management Platforms", "Procurement Automation Systems", "Manufacturing Execution Systems", "Quality Management Software", "Business Intelligence Dashboards", "B2B Marketplace Development", "Production Planning Tools", "Equipment Maintenance Systems"] },
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
      { value: "45+", label: "Projects Delivered" },
      { value: "$10M+", label: "Client Value Generated" },
      { value: "35+", label: "Expert Team Members" },
      { value: "6+", label: "Years of Excellence" },
    ],
  },
  faq: {
    // From demazetech.com homepage "FAQS: Questions? Answers!"
    eyebrow: "FAQS",
    heading: "Questions? Answers!",
    subheading: "Helpful answers for a smoother experience",
    items: [
      {
        question: "What makes Demaze different from other development companies?",
        answer:
          "We're an AI-first technology partner, not just a development service provider. Unlike traditional companies that focus on coding, we specialize in intelligent solutions that leverage cutting-edge AI, machine learning, and automation. We work as an extension of your team, focusing on long-term partnerships and measurable business outcomes rather than just project delivery.",
      },
      {
        question: "How long does it typically take to develop a custom solution?",
        answer:
          "Project timelines vary based on complexity and requirements, but most custom solutions take 3-6 months from concept to deployment. Simple applications may take 6-12 weeks, while complex AI-powered platforms or enterprise solutions can take 6-12 months. We provide detailed project timelines during our initial consultation and maintain transparent communication throughout the development process.",
      },
      {
        question: "Do you work with startups or only established enterprises?",
        answer:
          "We work with both startups and established enterprises across various industries. Our scalable approach allows us to support early-stage companies with MVP development and growth-stage businesses with comprehensive digital transformation. We tailor our solutions and engagement models to match your business size, budget, and growth objectives.",
      },
      {
        question: "What ongoing support do you provide after project completion?",
        answer:
          "We offer comprehensive post-launch support including maintenance, updates, performance monitoring, and technical assistance. Our support packages range from basic maintenance to full managed services with dedicated support teams. We also provide training for your team and can scale our support based on your evolving needs as your business grows.",
      },
      {
        question: "How do you ensure the security and confidentiality of our project?",
        answer:
          "Security and confidentiality are paramount in everything we do. We implement industry-standard security protocols, sign comprehensive NDAs before any project discussion, follow secure development practices, and ensure data protection compliance (GDPR, CCPA, etc.). All our team members are bound by strict confidentiality agreements, and we use secure development environments and encrypted communication channels.",
      },
    ],
  },
  finalCTA: {
    // From demazetech.com homepage
    heading: "Let's connect and build smarter, faster, and stronger - together.",
    primaryCTA: { text: "Let's Connect", href: "./contact" },
  },
  contact: {
    // From demazetech.com homepage "Contact: Reach Us At Anytime"
    eyebrow: "Contact",
    heading: "Reach Us At Anytime",
    cards: [
      {
        type: "email",
        label: "Email Us",
        title: "contact@demazetech.com",
        desc: "Feel free to email us if you have any questions or need more details!",
        link: "mailto:contact@demazetech.com",
      },
      {
        type: "call",
        label: "Book A Call",
        title: "Book with Calendly",
        desc: "Feel free to book a call if that’s more convenient and easier for you.",
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
    navLinks: [
      { text: "Projects", href: "./projects" },
      { text: "Services", href: "./services" },
      { text: "About Us", href: "./about-us" },
      { text: "Contact Us", href: "./contact" },
    ],
    ctaButton: { text: "Book A Call", href: "./contact" },
    footerTagline:
      "We combine AI, software engineering, and automation with deep industry expertise to build scalable, sustainable solutions, working alongside you as a trusted, long-term partner.",
    footerLinks: [
      { text: "Projects", href: "./projects" },
      { text: "Service", href: "./services" },
      { text: "About us", href: "./about-us" },
      { text: "Contact us", href: "./contact" },
    ],
    copyright: "Demaze Technologies © 2025. All rights reserved.",
  },
};
