// All site copy and data in one place. Edit here, then run `npm run build` to regenerate public/*.html.
// Everything below is published as-is, so keep it accurate: no placeholder numbers or invented claims.

module.exports = {
  calendly: 'https://calendly.com/krupal-demazetech/30min',
  email: 'contact@demazetech.com',
  address: 'A 804, Ganesh Glory 11, Jagatpur road, Near S.G. Highway, Gota, Ahmedabad',
  mapUrl: 'https://www.google.com/maps/dir//A-804,+Ganesh+Glory+11,+Jagatpur+Road,+Sarkhej+-+Gandhinagar+Hwy,+Gota,+Ahmedabad,+Gujarat+382470/@23.1141548,72.4578552,12z',
  socials: [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/krupalchaudhary', icon: 'linkedin' },
    { name: 'X', href: 'https://x.com/growwithkrupal', icon: 'x' },
    { name: 'Instagram', href: 'https://www.instagram.com/demaze_technologies', icon: 'instagram' },
  ],
  logoMark: './assets/img/logo.png',
  tagline: 'We combine AI, software engineering, and automation with deep industry expertise to build scalable, sustainable solutions, working alongside you as a trusted, long-term partner.',

  // Home hero. The label is the original promise (a strategic partner for scalable AI products); the headline is the
  // name's promise (de-maze), the part in <em> set in brand blue and the word in <mark> looped by hand; the lead names
  // the maze (the pitfalls drawn in the maze under it) and hands over to "How we work" ("the way through").
  hero: {
    label: 'Your strategic partner for scalable AI products',
    headline: 'Build AI products <em>without the <mark>maze.</mark></em>',
    lead: 'Vague specs, scope creep, deadlines, tech debt: every product has its maze. We design, build and scale AI software with you and find the way through, as one long-term team.',
  },

  // "How we work" (templates/journey.js): the heading over the maze scene; the four stages are `process` below.
  journey: {
    title: 'Every product starts as a maze. <em>We find the way through.</em>',
    lead: 'Four stages and one team, from your first idea to a product at scale.',
    // The maze's dead ends are where products get lost: each holds one of these (a doodle, its label, a marker
    // colour). The route passes all of them; on scroll they fall away with the walls. `start` and `finish` label
    // the doodles at the entrance and the exit.
    pitfalls: [['ghost', 'Scope creep', 'lilac'], ['bug', 'Bugs', 'tomato'], ['clock', 'Deadlines', 'sun'], ['tangle', 'Tech debt', 'pink'],
      ['question', 'Vague specs', 'sky'], ['flame', 'Budget burn', 'tomato'], ['lock', 'Lock-in', 'mint']],
    start: 'Your idea',
    finish: 'Launch',
  },

  founder: {
    quote: 'We harness your vision and data to build AI-driven solutions that help your brand stand out and grow revenue. When you thrive, we thrive, and we’re with you, executing every step of the way.',
    mark: 'When you thrive, we thrive', // the part of the quote that gets a marker line
    name: 'Krupal Chaudhary',
    title: 'Founder & CEO',
    photo: 'krupal-chaudhary',
    href: 'https://www.linkedin.com/in/krupalchaudhary',
  },

  metrics: [
    { value: 45, prefix: '', suffix: '+', label: 'Projects delivered' },
    { value: 10, prefix: '$', suffix: 'M+', label: 'Client value generated' },
    { value: 35, prefix: '', suffix: '+', label: 'Team members' },
    { value: 6, prefix: '', suffix: '+', label: 'Years in business' },
  ],

  // Order matches the live /projects page; the first four are the homepage selection. `sector` is the short label
  // shown on the project cards and case dialog; `name` is the short name used where projects are listed by name (the
  // product's own name where its screens show it). `brief` and `outcome` open and close the case study.
  projects: [
    { title: 'AI-Based Software for Luxury Car Dealers', image: 'ai-based-software-for-luxury-car-dealers', name: 'Carzup', sector: 'Automotive', tint: '#dfe6ff',
      description: "This comprehensive AI-based software solution was developed for one of India's largest luxury car dealerships to streamline various operations, including used car valuation, new car EMI calculations, car refurbishment management, and serving as a powerful backend system for the sales team. The tool enhances operational efficiency and significantly improves the customer experience, making it an indispensable asset for the dealership.",
      features: ['Accurate Used Car Valuations', 'Instant New Car EMIs', 'Seamless Car Refurbishment', 'Efficient Sales Team Backend'],
      brief: "One system to value used cars, quote new-car EMIs, run refurbishment and back the sales team.",
      outcome: "Smoother operations for the dealership and a better experience for every customer." },
    { title: 'Investigative Case Management Software', image: 'investigative-case-management-software', name: 'Case management', sector: 'Legal & investigation', tint: '#e9e2ff',
      description: 'It is an advanced web-based software designed to enhance the capabilities of private investigators with AI-powered tools and comprehensive case management features. It supports seamless organization of case information and media, secure data storage, and automated workflow management, accessible from anywhere.',
      features: ['Case Management', 'AI-Powered Tools', 'Document Automation, Subscription-based Auto deposit pricing model', 'Web-Based Access & Data Security'],
      brief: "Give private investigators one secure place to organise cases, analyse media and automate the paperwork, from anywhere.",
      outcome: "Investigators get AI-powered tools and every case organised, secured and reachable anywhere." },
    { title: 'AI-Powered Luxury eCommerce Platform', image: 'ai-powered-luxury-ecommerce-platform', name: 'Eco Chic', sector: 'Fashion & retail', tint: '#dcf3e6',
      description: 'Developed a modern e-commerce and lifestyle platform focused on sustainability and luxury retail. The project involved designing and implementing intuitive user journeys, personalization mechanisms, and secure data handling to ensure a premium digital experience. The result was a scalable, user-friendly solution aligned with the client’s vision for innovation and environmental responsibility.',
      features: ['AI-Powered Search, Try-ons, Recommendations, Price models', 'AI-Powered Dashboard & Analytics, Custom Drag & Drop CMS', 'Live Selling, Workflow Automations, Product Authentication', 'Smart Order & Inventory Management'],
      brief: "A premium store for sustainable luxury, where every piece can be bought, rented or resold.",
      outcome: "A scalable, user-friendly store built for innovation and environmental responsibility." },
    { title: 'Senior Engagement & Support Platform', image: 'senior-engagement-and-support-platform', name: 'Sukoon', sector: 'Senior care', tint: '#fff1cf',
      description: 'Sukoon Unlimited is an innovative platform designed to help seniors lead a connected, purposeful, and fulfilled life by providing access to support, meaningful conversations, and activities. The platform offers various services including personalized coaching, meetups, and a community of compassionate individuals, all aimed at reducing isolation and fostering connections. Sukoon Unlimited serves as a dedicated space for seniors to share experiences, seek guidance, and participate in enriching discussions that enhance mental and emotional well-being.',
      features: ['Speak with Sarathis, Club Sukoon', 'Coaching and Counseling', 'Meetups and Social Engagements', 'Sukoon Corner Blog'],
      brief: "Help seniors lead connected, purposeful lives, with support, conversation and activities that reduce isolation.",
      outcome: "A dedicated space where seniors share experiences, seek guidance and feel connected." },
    { title: 'Multi-Vendor eCommerce Marketplace', image: 'multi-vendor-ecommerce-marketplace', name: 'Better That', sector: 'Marketplace', tint: '#ffe0e6',
      description: 'It is Australian and New Zealand’s leading online marketplace where shoppers, good causes and retailers can do better shopping to get the latest trends, shoes, dresses, accessories and more. This app contains many features like category-wise products, easy searching, wishlist, brands, drop auction, currency converter, add to cart and buy with many payment options.',
      features: ['Enhanced Shopping Experience', 'Increased Reach for Retailers', 'Multi-vendor features, Live Auction', 'Achieved 99% Lighthouse Score'],
      brief: "Australia and New Zealand's marketplace where shoppers, retailers and good causes all do better.",
      outcome: "A faster, better shopping experience and more reach for every retailer." },
    { title: 'Multi-Shoppers Food & Grocery Delivery App', image: 'multi-shoppers-food-and-grocery-delivery-app', name: 'Grocery delivery', sector: 'Food & grocery', tint: '#e2f6d5',
      description: 'It is a cross-platform application developed using Flutter for user-facing apps and ReactJS for the admin panel. The platform is designed to empower local shop vendors by enabling them to sell their products online and manage their digital stores efficiently. It provides a seamless experience for both customers and shop owners, offering features that facilitate easy product listing, inventory management, and customer interaction.',
      features: ['Buy Grocery, Household Items, & Restaurant’s food', 'User App, Seller App, Rider (Delivery Person) App', 'Customer & Delivery Management, Account Management', 'Complete Control of Digital Store, Delivery Areas Setting'],
      brief: "Help local shops sell online and run their digital stores, from the first order to the doorstep.",
      outcome: "A seamless experience for customers, with local shop owners in charge of their own stores." },
    { title: 'Car Service & Customer Engagement Platform', image: 'car-service-and-customer-engagement-platform', name: 'Car service', sector: 'Automotive', tint: '#dfe6ff',
      description: 'The platform is a web and mobile-based application designed to enhance the efficiency of the service department of an authorized car dealership in India. The platform streamlines customer data management, service tracking, automated communication, and role-based access to improve operational efficiency and enhance customer experience. The application automates service reminders, tracks customer interactions, and provides real-time analytics to optimize the dealership’s Preventive Maintenance (PM), General Repairs (GR), and Body & Paint (BP) services.',
      features: ['Data Management & Integration', 'Admin Dashboard & Reporting', 'Automated Communication & Customer Engagement', 'Role-Based User Access, Customer Data Management'],
      brief: "Run an authorised dealership's service department on data: maintenance, repairs and body & paint.",
      outcome: "A more efficient service department and a better experience for every customer." },
    { title: 'B2B Gift Marketplace', image: 'b2b-gift-marketplace', name: 'Greeto', sector: 'B2B commerce', tint: '#ffe8d6',
      description: 'It is a comprehensive multi-vendor e-commerce platform developed to streamline the gifting business by connecting resellers and manufacturers in a seamless ecosystem. Designed with scalability, automation, and efficiency in mind, it enables resellers to grow their business, manufacturers to scale production, and administrators to oversee the entire system effortlessly.',
      features: ['Reseller Application', 'Manufacturer Portal', 'AI-Powered Product Discovery', 'Admin Dashboard & Analytics'],
      brief: "Connect gift resellers and manufacturers in one marketplace, with admins overseeing it all.",
      outcome: "Resellers grow their business, manufacturers scale production, and admins oversee it effortlessly." },
    { title: 'Global Payment Transfer Platform', image: 'global-payment-transfer-platform', name: 'Stablepay', sector: 'Fintech', tint: '#e9e2ff',
      description: 'It is an advanced digital payment platform that utilizes blockchain technology to simplify global money transfers. With a focus on efficiency and security, it enables fast, low-cost, and seamless cross-border transactions using stablecoins. By removing traditional banking intermediaries, it reduces transaction costs and processing times. Whether for personal or business transactions, it ensures funds are transferred quickly, safely, and affordably, offering a more accessible financial solution for individuals and businesses worldwide.',
      features: ['Global Payments', 'Blockchain Technology', 'Stablecoin Integration', 'User Empowerment'],
      brief: "Make cross-border transfers fast, low-cost and safe, without traditional banking intermediaries.",
      outcome: "Funds move quickly, safely and affordably, for anyone, anywhere." },
    { title: 'CMA Report Generation Software', image: 'cma-report-generation-software', name: 'CMA reports', sector: 'Banking & finance', tint: '#dcf3e6',
      description: 'The Credit Monitoring Arrangement (CMA) Report Generation Software is a cloud-based platform designed to streamline and automate the preparation of CMA reports. Developed using ReactJS and NodeJS, this platform includes comprehensive features that enable users to create detailed reports with all necessary data tables and charts. The software allows users to prepare, edit, and finalize CMA reports efficiently and provides options to download the reports in PDF and Excel formats.',
      features: ['Comprehensive Data Tables and Charts', 'Cloud-Based Platform', 'PDF and Excel Downloads', 'Efficient Report Preparation'],
      brief: "Automate the preparation of Credit Monitoring Arrangement reports, from data tables to the final PDF.",
      outcome: "Detailed CMA reports, prepared and finalised efficiently in the cloud." },
    { title: 'Recruitment Platform', image: 'recruitment-platform', name: 'Find Your Work', sector: 'Recruitment', tint: '#fff1cf',
      description: 'This is a recruitment consultancy platform that streamlines the hiring process for businesses of all types. With its user-friendly interface and powerful features, it makes it easy for employers to find, manage, and track the progress of job candidates. The platform allows employers to create job listings. It also provides a real-time chat feature for communication between employers & employees. The platform also allows businesses to track the progress of candidates throughout the hiring process, from application to offer letter. With it, businesses can save time and resources while finding the best candidates for their open positions and candidates can find their best employers to join in the new organisation.',
      features: ['Job Listing Creation', 'Real-Time Chat Functionality', 'Candidate Progress Tracking', 'Analytics & Reporting Tools'],
      brief: "Make hiring simple for businesses of all types, from the job post to the offer letter.",
      outcome: "Businesses save time finding the best candidates, and candidates find the right employer." },
    { title: 'Task, Staff & Document Management Platform', image: 'task-staff-and-document-management-platform', name: 'Task & documents', sector: 'Insurance & investment', tint: '#ffe0e6',
      description: 'It is a cross-platform application designed to digitally transform insurance and investment agencies by streamlining tasks, staff, and document management. Built for admins, heads, and field & office staff, the platform enables seamless task assignment, real-time communication, and document handling. With real-time messaging (powered by WebSockets), team members can collaborate efficiently, while heads can track progress and follow up on tasks. The system ensures secure document storage, categorizing files under respective policy or investment holders, making retrieval quick and organized.',
      features: ['Cross-Platform Task Management', 'Task Status Updates & Follow-Ups', 'Family Wise Document Upload & Search', 'Enhanced Workflow Efficiency'],
      brief: "Digitally transform insurance and investment agencies: tasks, staff and documents in one app.",
      outcome: "Teams collaborate in real time, heads track every task, and any file is quick to find." },
    // TODO(content): this project still needs its own description; an empty string hides the paragraph.
    { title: 'Educational Courses & LMS Platform', image: 'educational-courses-and-lms-platform', name: 'Learning platform', sector: 'Education', tint: '#e2f6d5', description: '',
      features: ['Website & Learning Management System', 'User Dashboard for Learners', 'Search & AI-Powered Recommendations', 'VR Content Access for Immersive Learning'],
      brief: "One platform for courses, a learning management system and immersive VR lessons.",
      outcome: "Learning that works on screen or in VR, with every learner’s progress in view." },
    { title: 'Storyboard Creation for Films with AI', image: 'storyboard-creation-for-films-with-ai', name: 'AI storyboards', sector: 'Film & media', tint: '#e9e2ff',
      description: 'It is a cutting-edge platform designed to transform the storyboard creation process using generative AI and advanced algorithms. This innovative tool allows filmmakers, advertisers, and content creators to convert scripts into stunning visual storyboards within minutes. It analyzes scripts, breaks them down scene by scene, and provides powerful editing tools to ensure narrative coherence and creative control.',
      features: ['Script to Storyboard Conversion', 'Effortless Iteration', 'Context Consistency & Creative Control', 'Intuitive Editing Tools'],
      brief: "Turn scripts into visual storyboards in minutes, for filmmakers, advertisers and creators.",
      outcome: "Storyboards in minutes, with narrative coherence and full creative control." },
    { title: 'Insurance Management Platform', image: 'insurance-management-platform', name: 'InsureTech', sector: 'Insurance', tint: '#dfe6ff',
      description: 'Introducing InsureTech, the ultimate cross-platform Flutter application designed to revolutionize insurance management. With its sleek and modern UI, users can seamlessly store and access all their insurance details in one centralized hub. Gone are the days of missing premium due dates. InsureTech keeps users informed with timely notifications, ensuring they never overlook important payments or coverage updates. From health to auto and everything in between, users can effortlessly manage all types of insurances within this powerful app.',
      features: ['Centralized Insurance Hub, User-Friendly, Modern UI', 'Timely Notifications, Easy Coverage Updates', 'Automatic Payment Reminders'],
      brief: "Keep every insurance policy in one app, so no premium or coverage update is ever missed.",
      outcome: "Users manage every type of insurance in one place and never miss a payment." },
    { title: 'Social Media & Social Commerce Platform', image: 'social-media-and-social-commerce-platform', name: 'Social commerce', sector: 'Social commerce', tint: '#ffe8d6',
      description: 'It is a social media and social commerce platform where users can connect through shared interests like singing, dancing, sports, and more. Join community groups, share content, engage with others, and shop directly from peer-to-peer listings using in-app crypto wallets. With features like leaderboards, brand promotions, and a personalized user profile, it creates a dynamic space for creators, consumers, and brands to interact.',
      features: ['Community-Based Interaction, Content Sharing', 'In-App Messaging', 'Peer-to-Peer Marketplace, Crypto Wallet Integration', 'Leaderboards, Engaging & Rewarding Experience'],
      brief: "A social network where shared interests become communities, and communities become a marketplace.",
      outcome: "A dynamic space where creators, consumers and brands meet, share and trade." },
  ],

  // `work`: the projects that show each service (project image keys); they link into those case studies and drive
  // the filters on the projects page.
  services: [
    { id: 'ai', title: 'AI & ML', summary: 'Forecasting, conversational AI, computer vision and generative AI',
      description: 'We build AI-powered solutions that transform data into insights, automate complex tasks, and drive smarter decisions. From predictive analytics to computer vision and generative AI, our systems help businesses innovate and scale with confidence.',
      items: ['Predictive Analytics & Forecasting', 'NLP & Conversational AI', 'Computer Vision & Image Processing', 'Generative Models & Content Synthesis', 'Recommendation Systems & Personalization', 'AI Dashboards & Insights'],
      work: ['ai-based-software-for-luxury-car-dealers', 'investigative-case-management-software', 'ai-powered-luxury-ecommerce-platform', 'storyboard-creation-for-films-with-ai', 'educational-courses-and-lms-platform'] },
    { id: 'web', title: 'Web, Mobile & SaaS', summary: 'Web and mobile apps, custom SaaS, APIs and workflow automation',
      description: 'We create scalable software and applications that deliver seamless user experiences and business value. From enterprise SaaS platforms to web and mobile apps, our solutions are built to perform, adapt, and grow with your needs.',
      items: ['Web App Development', 'Mobile App Development', 'Custom SaaS Development', 'Workflow Automation', 'API Development & System Integration', 'Progressive Web App (PWA)'],
      work: ['senior-engagement-and-support-platform', 'car-service-and-customer-engagement-platform', 'recruitment-platform', 'insurance-management-platform', 'global-payment-transfer-platform', 'task-staff-and-document-management-platform', 'educational-courses-and-lms-platform', 'social-media-and-social-commerce-platform', 'multi-shoppers-food-and-grocery-delivery-app', 'cma-report-generation-software'] },
    { id: 'ecom', title: 'E-commerce', summary: 'Marketplaces, personalization, checkout, payments and fulfilment',
      description: 'We build intelligent eCommerce platforms that elevate shopping experiences, improve conversions, and drive growth. From multi-vendor marketplaces to subscription commerce and AI-powered personalization, our solutions help retailers thrive in the digital-first era.',
      items: ['D2C / Multi-Vendor Marketplace', 'AI-Powered Personalization & Recommendation', 'Subscription / Rental & Recurring Billing Models', 'Checkout, Payment & Fraud Protection', 'Inventory, Fulfillment & Logistics Integration', 'UI/UX for Storefront & Customer Experience'],
      work: ['ai-powered-luxury-ecommerce-platform', 'multi-vendor-ecommerce-marketplace', 'b2b-gift-marketplace', 'multi-shoppers-food-and-grocery-delivery-app', 'social-media-and-social-commerce-platform'] },
    { id: 'cloud', title: 'Cloud', summary: 'Migration, cloud-native apps, security and disaster recovery',
      description: 'We design cloud architectures that ensure scalability, security, and resilience for modern businesses. From cloud migration to DevOps automation and disaster recovery, our services help you optimize performance and reduce costs.',
      items: ['Cloud Migration & Modernization', 'Cloud Native App Development', 'Multi-Cloud & Hybrid Cloud Architecture', 'Cloud Security, Compliance & Governance', 'Observability, Monitoring & Performance Optimization', 'Disaster Recovery, Backup & Business Continuity'],
      work: ['cma-report-generation-software', 'investigative-case-management-software', 'task-staff-and-document-management-platform'] },
  ],

  // Every tab of "Tools & Technologies" on the live /services page. slug = Simple Icons slug (null = text only).
  tools: [
    { tab: 'AI & ML', items: [['Langchain', 'langchain'], ['Python', 'python'], ['Tensorflow', 'tensorflow'], ['OpenAI', null], ['Hugging Face', 'huggingface'], ['Pinecone Database', null], ['Apache Kafka', 'apachekafka'], ['Elastic Search', 'elasticsearch']] },
    { tab: 'Web', items: [['React.js', 'react'], ['Next.js', 'nextdotjs'], ['HTML5', 'html5'], ['CSS', 'css'], ['JavaScript', 'javascript'], ['TypeScript', 'typescript'], ['Redux', 'redux'], ['Tailwind CSS', 'tailwindcss'], ['Node.js', 'nodedotjs'], ['Nest.js', 'nestjs'], ['Express.js', 'express'], ['Elastic Search', 'elasticsearch'], ['MongoDB', 'mongodb'], ['Redis', 'redis']] },
    { tab: 'Mobile App', items: [['Flutter', 'flutter'], ['React Native', 'react'], ['Node.js', 'nodedotjs'], ['Nest.js', 'nestjs'], ['Express.js', 'express'], ['MongoDB', 'mongodb'], ['PostgreSQL', 'postgresql'], ['Redis', 'redis'], ['Firebase', 'firebase'], ['Docker', 'docker']] },
    { tab: 'UI/UX', items: [['Figma', 'figma'], ['Adobe XD', 'adobexd'], ['Photoshop', 'adobephotoshop'], ['Illustrator', 'adobeillustrator'], ['Sketch', 'sketch'], ['InVision', 'invision'], ['Marvel', 'marvelapp'], ['Zeplin', 'zeplin'], ['Balsamiq', 'balsamiq'], ['Axure RP', 'axure']] },
    { tab: 'eCommerce', items: [['React.js', 'react'], ['Next.js', 'nextdotjs'], ['Node.js', 'nodedotjs'], ['Nest.js', 'nestjs'], ['Express.js', 'express'], ['MongoDB', 'mongodb'], ['PostgreSQL', 'postgresql'], ['MySQL', 'mysql'], ['Redis', 'redis'], ['Elastic Search', 'elasticsearch'], ['AWS', 'amazonwebservices'], ['GCP', 'googlecloud'], ['Heroku', 'heroku'], ['Azure', 'microsoftazure'], ['Hostinger', 'hostinger']] },
    { tab: 'Cloud', items: [['AWS', 'amazonwebservices'], ['GCP', 'googlecloud'], ['Azure', 'microsoftazure'], ['Docker', 'docker'], ['Kubernetes', 'kubernetes'], ['Terraform', 'terraform'], ['Jenkins', 'jenkins'], ['Github', 'github'], ['Postman', 'postman'], ['JMeter', 'apachejmeter'], ['Selenium', 'selenium'], ['Vultr', 'vultr'], ['Digital Ocean', 'digitalocean'], ['Heroku', 'heroku'], ['Apache Kafka', 'apachekafka'], ['Redis', 'redis'], ['Elastic Search', 'elasticsearch']] },
  ],

  // Industries (services page): [name, the kinds of systems we build for it, { the drawing (templates/doodles.js), its
  // marker colour, the projects in that sector (image keys; they link into their case studies) }].
  industries: [
    ['Healthcare', ['Telemedicine Platforms', 'Electronic Health Records (EHR)', 'Patient Management Systems', 'Appointment Scheduling Software', 'Healthcare Analytics Platforms', 'Wellness Tracking Applications', 'Medical Device Integration', 'Hospital Management Systems'], { doodle: 'pulse', color: 'pink', work: [] }],
    ['Fintech', ['Digital Payment Platforms', 'Mobile Banking Applications', 'Cryptocurrency Wallets', 'Peer-to-Peer Payment Systems', 'Lending Management Software', 'Credit Scoring Systems', 'Financial Analytics Tools', 'Blockchain Payment Solutions', 'Trading Platform Development'], { doodle: 'card', color: 'mint', work: ['global-payment-transfer-platform'] }],
    ['Logistics', ['Delivery Management Systems', 'Shipping Logistics Management', 'Fleet Management Software', 'Inventory Management Software', 'Telematics Software Development', 'Warehouse Management Systems', 'Route Optimization Platforms', 'Supply Chain Visibility Tools', 'Last-Mile Delivery Solutions'], { doodle: 'truck', color: 'sun', work: ['multi-shoppers-food-and-grocery-delivery-app'] }],
    ['Retail', ['Point-of-Sale (POS) Systems', 'Inventory Management Platforms', 'Customer Loyalty Programs', 'Staff Management Software', 'Omnichannel Retail Solutions', 'Price Management Systems', 'Retail Analytics Dashboards', 'Store Operations Management', 'Customer Relationship Management'], { doodle: 'store', color: 'tomato', work: ['ai-powered-luxury-ecommerce-platform'] }],
    ['Ecommerce', ['Multi-Vendor Marketplaces', 'B2B Ecommerce Platforms', 'B2C Online Stores', 'Shopping Cart Development', 'Payment Gateway Integration', 'Product Recommendation Engines', 'Order Management Systems', 'Customer Review Platforms', 'Auction & Bidding Systems'], { doodle: 'cart', color: 'sky', work: ['multi-vendor-ecommerce-marketplace', 'ai-powered-luxury-ecommerce-platform', 'b2b-gift-marketplace'] }],
    ['Education', ['Learning Management Systems (LMS)', 'Online Course Platforms', 'Virtual Classroom Software', 'Student Information Systems', 'Assessment & Testing Platforms', 'Educational Content Management', 'VR Learning Applications', 'AI-Powered Tutoring Systems', 'Certification Management'], { doodle: 'cap', color: 'lilac', work: ['educational-courses-and-lms-platform'] }],
    ['BFSI Solutions', ['Core Banking Systems', 'Insurance Management Platforms', 'Loan Origination Systems', 'Credit Monitoring Software', 'Regulatory Compliance Tools', 'Risk Management Systems', 'Customer Onboarding Solutions', 'Anti-Money Laundering (AML) Tools', 'Investment Portfolio Management'], { doodle: 'bank', color: 'sky', work: ['cma-report-generation-software', 'task-staff-and-document-management-platform'] }],
    ['Sports & Gaming', ['Fantasy Sports Platforms', 'Gaming Applications', 'Tournament Management Systems', 'Live Streaming Applications', 'Sports Analytics Platforms', 'Community Gaming Solutions', 'Leaderboard Systems', 'In-Game Payment Solutions', 'Sports Betting Platforms'], { doodle: 'gamepad', color: 'lilac', work: [] }],
    ['Energy & Utility', ['Smart Grid Management', 'Energy Monitoring Systems', 'Utility Billing Platforms', 'Renewable Energy Management', 'Consumption Analytics Tools', 'IoT Sensor Integration', 'Energy Trading Platforms', 'Grid Optimization Software', 'Meter Data Management'], { doodle: 'bolt', color: 'sun', work: [] }],
    ['Real Estate', ['Property Management Systems', 'Virtual Tour Platforms', 'Real Estate CRM Solutions', 'Rental Management Applications', 'Property Listing Websites', 'Automated Valuation Models', 'Property Investment Platforms', 'Facility Management Software', 'Real Estate Analytics Tools'], { doodle: 'house', color: 'tomato', work: [] }],
    ['Media & Entertainment', ['Content Management Systems', 'Streaming Platforms', 'Digital Asset Management', 'Social Media Applications', 'Video Processing Tools', 'AI Content Creation Platforms', 'Live Broadcasting Solutions', 'Creative Collaboration Tools', 'Subscription Management Systems'], { doodle: 'play', color: 'pink', work: ['storyboard-creation-for-films-with-ai'] }],
    ['SaaS Products', ['Multi-Tenant Applications', 'Subscription Management Systems', 'Cloud-Native Platforms', 'API Development & Integration', 'Analytics Dashboard Solutions', 'Customer Success Platforms', 'Workflow Automation Tools', 'Data Management Systems', 'Enterprise Software Solutions'], { doodle: 'layers', color: 'sky', work: ['investigative-case-management-software', 'cma-report-generation-software'] }],
    ['Automotive', ['Dealership Management Systems', 'Vehicle Valuation Tools', 'Service Scheduling Platforms', 'Car Rental Management', 'Fleet Tracking Systems', 'Automotive CRM Solutions', 'Parts Inventory Management', 'Customer Engagement Platforms', 'Vehicle Financing Calculators'], { doodle: 'car', color: 'tomato', work: ['ai-based-software-for-luxury-car-dealers', 'car-service-and-customer-engagement-platform'] }],
    ['Food & Beverage', ['Food Delivery Platforms', 'Restaurant Management Systems', 'Kitchen Display Systems', 'Menu Management Software', 'Food Safety Compliance Tools', 'Inventory Tracking Systems', 'Customer Ordering Apps', 'Multi-Vendor Food Marketplaces', 'Recipe Management Systems'], { doodle: 'cup', color: 'sun', work: ['multi-shoppers-food-and-grocery-delivery-app'] }],
    ['Legal & Professional Services', ['Case Management Systems', 'Document Automation Tools', 'Legal Practice Management', 'Time & Billing Software', 'Client Portal Systems', 'Contract Management Solutions', 'Compliance Tracking Tools', 'Legal Research Platforms', 'Court Filing Systems'], { doodle: 'scales', color: 'lilac', work: ['investigative-case-management-software'] }],
    ['Human Resources', ['Applicant Tracking Systems', 'Employee Onboarding Platforms', 'Performance Management Tools', 'Payroll Management Systems', 'Workforce Analytics Solutions', 'Employee Self-Service Portals', 'Talent Acquisition Platforms', 'HR Compliance Software', 'Learning & Development Systems'], { doodle: 'badge', color: 'mint', work: ['recruitment-platform'] }],
    ['Insurance', ['Policy Management Systems', 'Claims Processing Automation', 'Insurance CRM Solutions', 'Premium Calculation Tools', 'Underwriting Software', 'Customer Self-Service Portals', 'Insurance Mobile Applications', 'Risk Assessment Tools', 'Regulatory Reporting Systems'], { doodle: 'shield', color: 'sky', work: ['insurance-management-platform', 'task-staff-and-document-management-platform'] }],
    ['Social Commerce', ['Social Media Platforms', 'Peer-to-Peer Marketplaces', 'Community Management Systems', 'Social Shopping Applications', 'Influencer Marketing Platforms', 'User-Generated Content Systems', 'Social Analytics Tools', 'Crypto Wallet Integration', 'Social Gaming Features'], { doodle: 'chat', color: 'pink', work: ['social-media-and-social-commerce-platform'] }],
    ['Manufacturing & B2B', ['Supply Chain Management', 'Vendor Management Platforms', 'Procurement Automation Systems', 'Manufacturing Execution Systems', 'Quality Management Software', 'Business Intelligence Dashboards', 'B2B Marketplace Development', 'Production Planning Tools', 'Equipment Maintenance Systems'], { doodle: 'factory', color: 'sun', work: ['b2b-gift-marketplace'] }],
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

  // How we work (templates/journey.js): each stage's `steps` are the work its description names, as a short list.
  process: [
    { title: 'Discover & Define', description: 'We start by understanding your vision, challenges, and goals. Through deep discovery workshops and research, we define clear requirements and success metrics.', steps: ['Discovery workshops', 'Research', 'Requirements', 'Success metrics'] },
    { title: 'Design & Prototype', description: 'Ideas take shape with user-focused designs and interactive prototypes. This ensures alignment, clarity, and a shared vision before development begins.', steps: ['User-focused design', 'Interactive prototypes', 'A shared vision'] },
    { title: 'Build & Integrate', description: 'Our engineering team develops scalable, secure, and high-performance solutions. We follow agile methods, ensuring continuous feedback and seamless system integration.', steps: ['Agile sprints', 'Continuous feedback', 'System integration'] },
    { title: 'Launch & Scale', description: 'Once tested and refined, we launch with confidence. Beyond delivery, we support you in scaling, optimizing, and evolving the product for long-term growth.', steps: ['Testing', 'Launch', 'Scaling and optimising'] },
  ],

  faq: [
    { q: 'What makes Demaze different from other development companies?', a: "We're an AI-first technology partner, not just a development service provider. Unlike traditional companies that focus on coding, we specialize in intelligent solutions that leverage cutting-edge AI, machine learning, and automation. We work as an extension of your team, focusing on long-term partnerships and measurable business outcomes rather than just project delivery." },
    { q: 'How long does it typically take to develop a custom solution?', a: 'Project timelines vary based on complexity and requirements, but most custom solutions take 3-6 months from concept to deployment. Simple applications may take 6-12 weeks, while complex AI-powered platforms or enterprise solutions can take 6-12 months. We provide detailed project timelines during our initial consultation and maintain transparent communication throughout the development process.' },
    { q: 'Do you work with startups or only established enterprises?', a: 'We work with both startups and established enterprises across various industries. Our scalable approach allows us to support early-stage companies with MVP development and growth-stage businesses with comprehensive digital transformation. We tailor our solutions and engagement models to match your business size, budget, and growth objectives.' },
    { q: 'What ongoing support do you provide after project completion?', a: 'We offer comprehensive post-launch support including maintenance, updates, performance monitoring, and technical assistance. Our support packages range from basic maintenance to full managed services with dedicated support teams. We also provide training for your team and can scale our support based on your evolving needs as your business grows.' },
    { q: 'How do you ensure the security and confidentiality of our project?', a: 'Security and confidentiality are paramount in everything we do. We implement industry-standard security protocols, sign comprehensive NDAs before any project discussion, follow secure development practices, and ensure data protection compliance (GDPR, CCPA, etc.). All our team members are bound by strict confidentiality agreements, and we use secure development environments and encrypted communication channels.' },
  ],

  // The brief (contact page): what they need (any of `needs`, sent as the subject) and where they are now (one of
  // `stages`); lib/contact-api.js accepts exactly these stage values. `budgets` and `timelines` are older optional
  // questions the endpoint still accepts. Edit these and the endpoint together.
  brief: {
    needs: ['AI & ML', 'Web or mobile app', 'SaaS platform', 'E-commerce', 'Cloud', 'Not sure yet'],
    stages: ['Just an idea', 'Have designs', 'Have a product', 'Scaling up'],
    budgets: ['Under $10k', '$10k–25k', '$25k–50k', '$50k+', 'Not sure yet'],
    timelines: ['As soon as possible', 'In 1–3 months', 'In 3–6 months', 'Just exploring'],
  },

  // Where each page sends you next (the big link at the top of the footer), so a visit reads as one route through
  // the site: home → projects → services → about → contact → projects. [label, headline, link]
  next: {
    '': ['Projects', 'Every product, brief to launch', './projects'],
    projects: ['Services', 'Four kinds of product, one team', './services'],
    services: ['About', 'The people behind the route', './about-us'],
    'about-us': ['Contact', 'Tell us about your maze', './contact'],
    contact: ['Projects', 'See what we’ve shipped', './projects'],
    case: ['Projects', 'More products we’ve built', './projects'],
    404: ['Home', 'Back to the start of the route', './'],
  },
};
