// All site copy and data in one place. Edit here, then run `npm run build` to regenerate public/*.html.
// Everything below is published as-is, so keep it accurate: no placeholder numbers or invented claims.

module.exports = {
  calendly: 'https://calendly.com/krupal-demazetech/30min',
  email: 'contact@demazetech.com',
  address: 'A 804, Ganesh Glory 11, Jagatpur road, Near S.G. Highway, Gota, Ahmedabad',
  mapUrl: 'https://www.google.com/maps/dir//D-814,+Ganesh+Glory+11,+Jagatpur+Road,+Sarkhej+-+Gandhinagar+Hwy,+Gota,+Ahmedabad,+Gujarat+382470/@23.1141548,72.4578552,12z',
  socials: [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/krupalchaudhary', icon: 'linkedin' },
    { name: 'X', href: 'https://x.com/growwithkrupal', icon: 'x' },
    { name: 'Instagram', href: 'https://www.instagram.com/demaze_technologies', icon: 'instagram' },
  ],
  logoMark: './assets/img/logo.png',
  tagline: 'We combine AI, software engineering, and automation with deep industry expertise to build scalable, sustainable solutions, working alongside you as a trusted, long-term partner.',

  hero: {
    eyebrow: ['Expertise', 'Innovation', 'Partnership'],
    headline: 'Your Strategic Partner in Building Scalable AI Products',
  },

  founder: {
    quote: 'We harness your vision and data to build AI-driven solutions that help your brand stand out and grow revenue. When you thrive, we thrive - and we’re with you, executing every step of the way.',
    name: 'Krupal Chaudhary',
    title: 'Founder & CEO',
    photo: 'krupal-chaudhary',
    href: 'https://www.linkedin.com/in/krupalchaudhary',
  },

  metrics: [
    { value: 45, prefix: '', suffix: '+', label: 'Projects Delivered' },
    { value: 10, prefix: '$', suffix: 'M+', label: 'Client Value Generated' },
    { value: 35, prefix: '', suffix: '+', label: 'Expert Team Members' },
    { value: 6, prefix: '', suffix: '+', label: 'Years of Excellence' },
  ],

  // Order matches the live /projects page; the first four are the homepage selection.
  projects: [
    { title: 'AI-Based software for luxury car dealers', image: 'ai-based-software-for-luxury-car-dealers', tint: '#dfe6ff',
      description: "This comprehensive AI-based software solution was developed for one of India's largest luxury car dealerships to streamline various operations, including used car valuation, new car EMI calculations, car refurbishment management, and serving as a powerful backend system for the sales team. The tool enhances operational efficiency and significantly improves the customer experience, making it an indispensable asset for the dealership.",
      features: ['Accurate Used Car Valuations', 'Instant New Car EMIs', 'Seamless Car Refurbishment', 'Efficient Sales Team Backend'] },
    { title: 'Investigative Case Management Software', image: 'investigative-case-management-software', tint: '#e9e2ff',
      description: 'It is an advanced web-based software designed to enhance the capabilities of private investigators with AI-powered tools and comprehensive case management features. It supports seamless organization of case information and media, secure data storage, and automated workflow management, accessible from anywhere.',
      features: ['Case Management', 'AI-Powered Tools', 'Document Automation, Subscription-based Auto deposit pricing model', 'Web-Based Access & Data Security'] },
    { title: 'AI-Powered luxury eCommerce Platform', image: 'ai-powered-luxury-ecommerce-platform', tint: '#dcf3e6',
      description: 'Developed a modern e-commerce and lifestyle platform focused on sustainability and luxury retail. The project involved designing and implementing intuitive user journeys, personalization mechanisms, and secure data handling to ensure a premium digital experience. The result was a scalable, user-friendly solution aligned with the client’s vision for innovation and environmental responsibility.',
      features: ['AI-Powered Search, Try-ons, Recommendations, Price models', 'AI-Powered Dashboard & Analytics, Custom Drag & Drop CMS', 'Live Selling, Workflow Automations, Product Authentication', 'Smart Order & Inventory Management'] },
    { title: 'Senior Engagement & Support platform', image: 'senior-engagement-and-support-platform', tint: '#fff1cf',
      description: 'Sukoon Unlimited is an innovative platform designed to help seniors lead a connected, purposeful, and fulfilled life by providing access to support, meaningful conversations, and activities. The platform offers various services including personalized coaching, meetups, and a community of compassionate individuals, all aimed at reducing isolation and fostering connections. Sukoon Unlimited serves as a dedicated space for seniors to share experiences, seek guidance, and participate in enriching discussions that enhance mental and emotional well-being.',
      features: ['Speak with Sarathis, Club Sukoon', 'Coaching and Counseling', 'Meetups and Social Engagements', 'Sukoon Corner Blog'] },
    { title: 'Multi-vendor eCommerce Marketplace', image: 'multi-vendor-ecommerce-marketplace', tint: '#ffe0e6',
      description: 'It is Australian and New Zealand’s leading online marketplace where shoppers, good causes and retailers can do better shopping to get the latest trends, shoes, dresses, accessories and more. This app contains many features like category-wise products, easy searching, wishlist, brands, drop auction, currency converter, add to cart and buy with many payment options.',
      features: ['Enhanced Shopping Experience', 'Increased Reach for Retailers', 'Multi-vendor features, Live Auction', 'Achieved 99% Lighthouse Score'] },
    { title: 'Multi-shoppers Food & Grocery Delivery App', image: 'multi-shoppers-food-and-grocery-delivery-app', tint: '#e2f6d5',
      description: 'It is a cross-platform application developed using Flutter for user-facing apps and ReactJS for the admin panel. The platform is designed to empower local shop vendors by enabling them to sell their products online and manage their digital stores efficiently. It provides a seamless experience for both customers and shop owners, offering features that facilitate easy product listing, inventory management, and customer interaction.',
      features: ['Buy Grocery, Household Items, & Restaurant’s food', 'User App, Seller App, Rider (Delivery Person) App', 'Customer & Delivery Management, Account Management', 'Complete Control of Digital Store, Delivery Areas Setting'] },
    { title: 'Car service & customer engagement platform', image: 'car-service-and-customer-engagement-platform', tint: '#dfe6ff',
      description: 'The platform is a web and mobile-based application designed to enhance the efficiency of the service department of an authorized car dealership in India. The platform streamlines customer data management, service tracking, automated communication, and role-based access to improve operational efficiency and enhance customer experience. The application automates service reminders, tracks customer interactions, and provides real-time analytics to optimize the dealership’s Preventive Maintenance (PM), General Repairs (GR), and Body & Paint (BP) services.',
      features: ['Data Management & Integration', 'Admin Dashboard & Reporting', 'Automated Communication & Customer Engagement', 'Role-Based User Access, Customer Data Management'] },
    { title: 'B2B Gift Marketplace', image: 'b2b-gift-marketplace', tint: '#ffe8d6',
      description: 'It is a comprehensive multi-vendor e-commerce platform developed to streamline the gifting business by connecting resellers and manufacturers in a seamless ecosystem. Designed with scalability, automation, and efficiency in mind, it enables resellers to grow their business, manufacturers to scale production, and administrators to oversee the entire system effortlessly.',
      features: ['Reseller Application', 'Manufacturer Portal', 'AI-Powered Product Discovery', 'Admin Dashboard & Analytics'] },
    { title: 'Global Payment transfer platform', image: 'global-payment-transfer-platform', tint: '#e9e2ff',
      description: 'It is an advanced digital payment platform that utilizes blockchain technology to simplify global money transfers. With a focus on efficiency and security, it enables fast, low-cost, and seamless cross-border transactions using stablecoins. By removing traditional banking intermediaries, it reduces transaction costs and processing times. Whether for personal or business transactions, It ensures funds are transferred quickly, safely, and affordably, offering a more accessible financial solution for individuals and businesses worldwide.',
      features: ['Global Payments', 'Blockchain Technology', 'Stablecoin Integration', 'User Empowerment'] },
    { title: 'CMA Report Generation Software', image: 'cma-report-generation-software', tint: '#dcf3e6',
      description: 'The Credit Monitoring Arrangement (CMA) Report Generation Software is a cloud-based platform designed to streamline and automate the preparation of CMA reports. Developed using ReactJS and NodeJS, this platform includes comprehensive features that enable users to create detailed reports with all necessary data tables and charts. The software allows users to prepare, edit, and finalize CMA reports efficiently and provides options to download the reports in PDF and Excel formats.',
      features: ['Comprehensive Data Tables and Charts', 'Cloud-Based Platform', 'PDF and Excel Downloads', 'Efficient Report Preparation'] },
    { title: 'Recruitment platform', image: 'recruitment-platform', tint: '#fff1cf',
      description: 'This is a recruitment consultancy platform that streamlines the hiring process for businesses of all types. With its user-friendly interface and powerful features, It makes it easy for employers to find, manage, and track the progress of job candidates. The platform allows employers to create job listings. It also provides a real-time chat feature for communication between employers & employees. The platform also allows businesses to track the progress of candidates throughout the hiring process, from application to offer letter. With it, businesses can save time and resources while finding the best candidates for their open positions and candidates can find their best employers to join in the new organisation.',
      features: ['Job Listing Creation', 'Real-Time Chat Functionality', 'Candidate Progress Tracking', 'Analytics & Reporting Tools'] },
    { title: 'Task, Staff & Document management platform', image: 'task-staff-and-document-management-platform', tint: '#ffe0e6',
      description: 'It is a cross-platform application designed to digitally transform insurance and investment agencies by streamlining tasks, staff, and document management. Built for admins, heads, and field & office staff, the platform enables seamless task assignment, real-time communication, and document handling. With real-time messaging (powered by WebSockets), team members can collaborate efficiently, while heads can track progress and follow up on tasks. The system ensures secure document storage, categorizing files under respective policy or investment holders, making retrieval quick and organized.',
      features: ['Cross-Platform Task Management', 'Task Status Updates & Follow-Ups', 'Family Wise Document Upload & Search', 'Enhanced Workflow Efficiency'] },
    // TODO(content): this project still needs its own description; an empty string hides the paragraph.
    { title: 'Educational courses & LMS platform', image: 'educational-courses-and-lms-platform', tint: '#e2f6d5', description: '',
      features: ['Website & Learning Management System', 'User Dashboard for Learners', 'Search & AI-Powered Recommendations', 'VR Content Access for Immersive Learning'] },
    { title: 'Storyboard creation for films with AI', image: 'storyboard-creation-for-films-with-ai', tint: '#e9e2ff',
      description: 'It is a cutting-edge platform designed to transform the storyboard creation process using generative AI and advanced algorithms. This innovative tool allows filmmakers, advertisers, and content creators to convert scripts into stunning visual storyboards within minutes. It analyzes scripts, breaks them down scene by scene, and provides powerful editing tools to ensure narrative coherence and creative control.',
      features: ['Script to Storyboard Conversion', 'Effortless Iteration', 'Context Consistency & Creative Control', 'Intuitive Editing Tools'] },
    { title: 'Insurance management platform', image: 'insurance-management-platform', tint: '#dfe6ff',
      description: 'Introducing InsureTech, the ultimate cross-platform Flutter application designed to revolutionize insurance management. With its sleek and modern UI, users can seamlessly store and access all their insurance details in one centralized hub. Gone are the days of missing premium due dates. InsureTech keeps users informed with timely notifications, ensuring they never overlook important payments or coverage updates. From health to auto and everything in between, users can effortlessly manage all types of insurances within this powerful app.',
      features: ['Centralized Insurance Hub, User-Friendly, Modern UI', 'Timely Notifications, Easy Coverage Updates', 'Automatic Payment Reminders'] },
    { title: 'Social media & social commerce platform', image: 'social-media-and-social-commerce-platform', tint: '#ffe8d6',
      description: 'It is a social media and social commerce platform where users can connect through shared interests like singing, dancing, sports, and more. Join community groups, share content, engage with others, and shop directly from peer-to-peer listings using in-app crypto wallets. With features like leaderboards, brand promotions, and a personalized user profile, It creates a dynamic space for creators, consumers, and brands to interact.',
      features: ['Community-Based Interaction, Content Sharing', 'In-App Messaging', 'Peer-to-Peer Marketplace, Crypto Wallet Integration', 'Leaderboards, Engaging & Rewarding Experience'] },
  ],

  services: [
    { id: 'ai', title: 'AI & ML',
      description: 'We build AI-powered solutions that transform data into insights, automate complex tasks, and drive smarter decisions. From predictive analytics to computer vision and generative AI, our systems help businesses innovate and scale with confidence.',
      items: ['Predictive Analytics & Forecasting', 'NLP & Conversational AI', 'Computer Vision & Image Processing', 'Generative Models & Content Synthesis', 'Recommendation Systems & Personalization', 'AI Dashboards & Insights'] },
    { id: 'web', title: 'Web / Mobile App / SaaS',
      description: 'We create scalable software and applications that deliver seamless user experiences and business value. From enterprise SaaS platforms to web and mobile apps, our solutions are built to perform, adapt, and grow with your needs.',
      items: ['Web App Development', 'Mobile App Development', 'Custom SaaS Development', 'Workflow Automation', 'API Development & System Integration', 'Progressive Web App (PWA)'] },
    { id: 'ecom', title: 'E commerce',
      description: 'We build intelligent eCommerce platforms that elevate shopping experiences, improve conversions, and drive growth. From multi-vendor marketplaces to subscription commerce and AI-powered personalization, our solutions help retailers thrive in the digital-first era.',
      items: ['D2C / Multi-Vendor Marketplace', 'AI-Powered Personalization & Recommendation', 'Subscription / Rental & Recurring Billing Models', 'Checkout, Payment & Fraud Protection', 'Inventory, Fulfillment & Logistics Integration', 'UI/UX for Storefront & Customer Experience'] },
    { id: 'cloud', title: 'Cloud',
      description: 'We design cloud architectures that ensure scalability, security, and resilience for modern businesses. From cloud migration to DevOps automation and disaster recovery, our services help you optimize performance and reduce costs.',
      items: ['Cloud Migration & Modernization', 'Cloud Native App Development', 'Multi-Cloud & Hybrid Cloud Architecture', 'Cloud Security, Compliance & Governance', 'Observability, Monitoring & Performance Optimization', 'Disaster Recovery, Backup & Business Continuity'] },
  ],

  // Tools & technologies: the AI & ML category (grouped, with roles). `icon` names a file in public/assets/img/tech.
  stack: {
    heading: 'Connected intelligence, built for production',
    lead: 'How Demaze connects foundation AI models, orchestration frameworks, and real-time data infrastructure into resilient production software.',
    groups: ['AI Models', 'Orchestration', 'Data & ML', 'Streaming & Search'],
    items: [
      { name: 'OpenAI', role: 'Large Language Models', group: 'AI Models', icon: 'ai-openai' },
      { name: 'Hugging Face', role: 'Open-Source AI Models', group: 'AI Models', icon: 'ai-hugging-face' },
      { name: 'LangChain', role: 'LLM Orchestration', group: 'Orchestration', icon: 'ai-langchain' },
      { name: 'Python', role: 'Core AI & APIs', group: 'Orchestration', icon: 'ai-python' },
      { name: 'TensorFlow', role: 'Machine Learning Models', group: 'Data & ML', icon: 'ai-tensorflow' },
      { name: 'Pinecone Database', role: 'Vector Database', group: 'Data & ML', icon: 'ai-pinecone-database' },
      { name: 'Apache Kafka', role: 'Real-Time Streaming', group: 'Streaming & Search', icon: 'ai-apache-kafka' },
      { name: 'Elasticsearch', role: 'Search & Indexing', group: 'Streaming & Search', icon: 'ai-elasticsearch' },
    ],
  },

  // Every tab of "Tools & Technologies" on the live /services page. slug = Simple Icons slug (null = text only).
  tools: [
    { tab: 'AI & ML', items: [['Langchain', 'langchain'], ['Python', 'python'], ['Tensorflow', 'tensorflow'], ['OpenAI', null], ['Hugging Face', 'huggingface'], ['Pinecone Database', null], ['Apache Kafka', 'apachekafka'], ['Elastic Search', 'elasticsearch']] },
    { tab: 'Web', items: [['React.js', 'react'], ['Next.js', 'nextdotjs'], ['HTML5', 'html5'], ['CSS', 'css'], ['JavaScript', 'javascript'], ['TypeScript', 'typescript'], ['Redux', 'redux'], ['Tailwind CSS', 'tailwindcss'], ['Node.js', 'nodedotjs'], ['Nest.js', 'nestjs'], ['Express.js', 'express'], ['Elastic Search', 'elasticsearch'], ['MongoDB', 'mongodb'], ['Redis', 'redis']] },
    { tab: 'Mobile App', items: [['Flutter', 'flutter'], ['React Native', 'react'], ['Node.js', 'nodedotjs'], ['Nest.js', 'nestjs'], ['Express.js', 'express'], ['MongoDB', 'mongodb'], ['PostgreSQL', 'postgresql'], ['Redis', 'redis'], ['Firebase', 'firebase'], ['Docker', 'docker']] },
    { tab: 'UI/UX', items: [['Figma', 'figma'], ['Adobe XD', 'adobexd'], ['Photoshop', 'adobephotoshop'], ['Illustrator', 'adobeillustrator'], ['Sketch', 'sketch'], ['InVision', 'invision'], ['Marvel', 'marvelapp'], ['Zeplin', 'zeplin'], ['Balsamiq', 'balsamiq'], ['Axure RP', 'axure']] },
    { tab: 'eCommerce', items: [['React.js', 'react'], ['Next.js', 'nextdotjs'], ['Node.js', 'nodedotjs'], ['Nest.js', 'nestjs'], ['Express.js', 'express'], ['MongoDB', 'mongodb'], ['PostgreSQL', 'postgresql'], ['MySQL', 'mysql'], ['Redis', 'redis'], ['Elastic Search', 'elasticsearch'], ['AWS', 'amazonwebservices'], ['GCP', 'googlecloud'], ['Heroku', 'heroku'], ['Azure', 'microsoftazure'], ['Hostinger', 'hostinger']] },
    { tab: 'Cloud', items: [['AWS', 'amazonwebservices'], ['GCP', 'googlecloud'], ['Azure', 'microsoftazure'], ['Docker', 'docker'], ['Kubernetes', 'kubernetes'], ['Terraform', 'terraform'], ['Jenkins', 'jenkins'], ['Github', 'github'], ['Postman', 'postman'], ['JMeter', 'apachejmeter'], ['Selenium', 'selenium'], ['Vultr', 'vultr'], ['Digital Ocean', 'digitalocean'], ['Heroku', 'heroku'], ['Apache Kafka', 'apachekafka'], ['Redis', 'redis'], ['Elastic Search', 'elasticsearch']] },
  ],

  industries: [
    ['Healthcare', ['Telemedicine Platforms', 'Electronic Health Records (EHR)', 'Patient Management Systems', 'Appointment Scheduling Software', 'Healthcare Analytics Platforms', 'Wellness Tracking Applications', 'Medical Device Integration', 'Hospital Management Systems']],
    ['Fintech', ['Digital Payment Platforms', 'Mobile Banking Applications', 'Cryptocurrency Wallets', 'Peer-to-Peer Payment Systems', 'Lending Management Software', 'Credit Scoring Systems', 'Financial Analytics Tools', 'Blockchain Payment Solutions', 'Trading Platform Development']],
    ['Logistics', ['Delivery Management Systems', 'Shipping Logistics Management', 'Fleet Management Software', 'Inventory Management Software', 'Telematics Software Development', 'Warehouse Management Systems', 'Route Optimization Platforms', 'Supply Chain Visibility Tools', 'Last-Mile Delivery Solutions']],
    ['Retail', ['Point-of-Sale (POS) Systems', 'Inventory Management Platforms', 'Customer Loyalty Programs', 'Staff Management Software', 'Omnichannel Retail Solutions', 'Price Management Systems', 'Retail Analytics Dashboards', 'Store Operations Management', 'Customer Relationship Management']],
    ['Ecommerce', ['Multi-Vendor Marketplaces', 'B2B Ecommerce Platforms', 'B2C Online Stores', 'Shopping Cart Development', 'Payment Gateway Integration', 'Product Recommendation Engines', 'Order Management Systems', 'Customer Review Platforms', 'Auction & Bidding Systems']],
    ['Education', ['Learning Management Systems (LMS)', 'Online Course Platforms', 'Virtual Classroom Software', 'Student Information Systems', 'Assessment & Testing Platforms', 'Educational Content Management', 'VR Learning Applications', 'AI-Powered Tutoring Systems', 'Certification Management']],
    ['BFSI Solutions', ['Core Banking Systems', 'Insurance Management Platforms', 'Loan Origination Systems', 'Credit Monitoring Software', 'Regulatory Compliance Tools', 'Risk Management Systems', 'Customer Onboarding Solutions', 'Anti-Money Laundering (AML) Tools', 'Investment Portfolio Management']],
    ['Sports & Gaming', ['Fantasy Sports Platforms', 'Gaming Applications', 'Tournament Management Systems', 'Live Streaming Applications', 'Sports Analytics Platforms', 'Community Gaming Solutions', 'Leaderboard Systems', 'In-Game Payment Solutions', 'Sports Betting Platforms']],
    ['Energy & Utility', ['Smart Grid Management', 'Energy Monitoring Systems', 'Utility Billing Platforms', 'Renewable Energy Management', 'Consumption Analytics Tools', 'IoT Sensor Integration', 'Energy Trading Platforms', 'Grid Optimization Software', 'Meter Data Management']],
    ['Real Estate', ['Property Management Systems', 'Virtual Tour Platforms', 'Real Estate CRM Solutions', 'Rental Management Applications', 'Property Listing Websites', 'Automated Valuation Models', 'Property Investment Platforms', 'Facility Management Software', 'Real Estate Analytics Tools']],
    ['Media & Entertainment', ['Content Management Systems', 'Streaming Platforms', 'Digital Asset Management', 'Social Media Applications', 'Video Processing Tools', 'AI Content Creation Platforms', 'Live Broadcasting Solutions', 'Creative Collaboration Tools', 'Subscription Management Systems']],
    ['SaaS Products', ['Multi-Tenant Applications', 'Subscription Management Systems', 'Cloud-Native Platforms', 'API Development & Integration', 'Analytics Dashboard Solutions', 'Customer Success Platforms', 'Workflow Automation Tools', 'Data Management Systems', 'Enterprise Software Solutions']],
    ['Automotive', ['Dealership Management Systems', 'Vehicle Valuation Tools', 'Service Scheduling Platforms', 'Car Rental Management', 'Fleet Tracking Systems', 'Automotive CRM Solutions', 'Parts Inventory Management', 'Customer Engagement Platforms', 'Vehicle Financing Calculators']],
    ['Food & Beverage', ['Food Delivery Platforms', 'Restaurant Management Systems', 'Kitchen Display Systems', 'Menu Management Software', 'Food Safety Compliance Tools', 'Inventory Tracking Systems', 'Customer Ordering Apps', 'Multi-Vendor Food Marketplaces', 'Recipe Management Systems']],
    ['Legal & Professional Services', ['Case Management Systems', 'Document Automation Tools', 'Legal Practice Management', 'Time & Billing Software', 'Client Portal Systems', 'Contract Management Solutions', 'Compliance Tracking Tools', 'Legal Research Platforms', 'Court Filing Systems']],
    ['Human Resources', ['Applicant Tracking Systems', 'Employee Onboarding Platforms', 'Performance Management Tools', 'Payroll Management Systems', 'Workforce Analytics Solutions', 'Employee Self-Service Portals', 'Talent Acquisition Platforms', 'HR Compliance Software', 'Learning & Development Systems']],
    ['Insurance', ['Policy Management Systems', 'Claims Processing Automation', 'Insurance CRM Solutions', 'Premium Calculation Tools', 'Underwriting Software', 'Customer Self-Service Portals', 'Insurance Mobile Applications', 'Risk Assessment Tools', 'Regulatory Reporting Systems']],
    ['Social Commerce', ['Social Media Platforms', 'Peer-to-Peer Marketplaces', 'Community Management Systems', 'Social Shopping Applications', 'Influencer Marketing Platforms', 'User-Generated Content Systems', 'Social Analytics Tools', 'Crypto Wallet Integration', 'Social Gaming Features']],
    ['Manufacturing & B2B', ['Supply Chain Management', 'Vendor Management Platforms', 'Procurement Automation Systems', 'Manufacturing Execution Systems', 'Quality Management Software', 'Business Intelligence Dashboards', 'B2B Marketplace Development', 'Production Planning Tools', 'Equipment Maintenance Systems']],
  ],

  whyUs: [
    { title: 'AI-First Innovation',
      description: "We don't just build software; we create intelligent solutions that learn, adapt, and evolve. Our deep expertise in AI, machine learning, and emerging technologies ensures your business stays ahead of the curve with future-ready solutions that drive automation and growth." },
    { title: 'End-to-End Partnership',
      description: "From concept to deployment and beyond, we're your dedicated tech partner. We work as an extension of your team, providing comprehensive support across the entire development lifecycle while focusing on long-term success rather than just project delivery." },
    { title: 'Proven Track Record',
      description: 'With 45+ successful projects across diverse industries and $10M+ generated for our clients, we bring measurable results. Our experienced team of 35+ professionals combines technical excellence with business acumen to deliver solutions that create real impact.' },
  ],

  about: {
   
    whoWeAre: [
      "At Demaze Technologies, we're more than just developers; we're digital transformation architects. We're a passionate team of 35+ technologists, innovators, and strategic thinkers who believe in the power of AI and cutting-edge technology to reshape businesses.",
      'Founded with a vision to democratize advanced technology, we bridge the gap between complex technical possibilities and real business outcomes.',
    ],
    drives: [
      { title: 'Innovation at Our Core', description: "We're driven by the challenge of turning ambitious ideas into reality. Every project is an opportunity to push boundaries and create something extraordinary that makes a meaningful impact." },
      { title: 'Client Success Obsession', description: "Your success is our success. We're motivated by seeing our clients achieve breakthrough results, streamline operations, and unlock new growth opportunities through the solutions we build together." },
      { title: 'Technology for Good', description: 'We believe technology should empower, simplify, and enhance human potential. This drives us to create solutions that not only solve problems but also open new possibilities for businesses and their customers.' },
      { title: 'Continuous Learning', description: "In a rapidly evolving tech landscape, we're driven by curiosity and the pursuit of excellence. We constantly evolve our skills and adopt emerging technologies to deliver the most advanced solutions." },
    ],
  },

  process: [
    { title: 'Discover & Define', description: 'We start by understanding your vision, challenges, and goals. Through deep discovery workshops and research, we define clear requirements and success metrics.' },
    { title: 'Design & Prototype', description: 'Ideas take shape with user-focused designs and interactive prototypes. This ensures alignment, clarity, and a shared vision before development begins.' },
    { title: 'Build & Integrate', description: 'Our engineering team develops scalable, secure, and high-performance solutions. We follow agile methods, ensuring continuous feedback and seamless system integration.' },
    { title: 'Launch & Scale', description: 'Once tested and refined, we launch with confidence. Beyond delivery, we support you in scaling, optimizing, and evolving the product for long-term growth.' },
  ],

  faq: [
    { q: 'What makes Demaze different from other development companies?', a: "We're an AI-first technology partner, not just a development service provider. Unlike traditional companies that focus on coding, we specialize in intelligent solutions that leverage cutting-edge AI, machine learning, and automation. We work as an extension of your team, focusing on long-term partnerships and measurable business outcomes rather than just project delivery." },
    { q: 'How long does it typically take to develop a custom solution?', a: 'Project timelines vary based on complexity and requirements, but most custom solutions take 3-6 months from concept to deployment. Simple applications may take 6-12 weeks, while complex AI-powered platforms or enterprise solutions can take 6-12 months. We provide detailed project timelines during our initial consultation and maintain transparent communication throughout the development process.' },
    { q: 'Do you work with startups or only established enterprises?', a: 'We work with both startups and established enterprises across various industries. Our scalable approach allows us to support early-stage companies with MVP development and growth-stage businesses with comprehensive digital transformation. We tailor our solutions and engagement models to match your business size, budget, and growth objectives.' },
    { q: 'What ongoing support do you provide after project completion?', a: 'We offer comprehensive post-launch support including maintenance, updates, performance monitoring, and technical assistance. Our support packages range from basic maintenance to full managed services with dedicated support teams. We also provide training for your team and can scale our support based on your evolving needs as your business grows.' },
    { q: 'How do you ensure the security and confidentiality of our project?', a: 'Security and confidentiality are paramount in everything we do. We implement industry-standard security protocols, sign comprehensive NDAs before any project discussion, follow secure development practices, and ensure data protection compliance (GDPR, CCPA, etc.). All our team members are bound by strict confidentiality agreements, and we use secure development environments and encrypted communication channels.' },
  ],

  closing: "Let's connect and build smarter, faster, and stronger - together.",
};
