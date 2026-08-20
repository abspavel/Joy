import { supabase } from './src/lib/supabase';

async function seed() {
  console.log('Fetching services...');
  const { data: services, error } = await supabase.from('services').select('*');
  if (error || !services) {
    console.error('Error fetching services:', error);
    return;
  }

  const defaultContent = {
    "web-design": {
      detailed_content: "In today's digital landscape, your website is often the first impression a potential client has of your business. Our web design service goes beyond just making things look pretty. We focus on creating strategic, user-centric designs that not only capture attention but also guide visitors naturally toward taking action. By combining aesthetics with usability, we ensure your site is memorable and effective.",
      features: ["Custom UI/UX Design", "Wireframing & Prototyping", "Mobile-First Responsive Layouts", "Brand Identity Integration", "Conversion Rate Optimization (CRO)", "Interactive Prototypes"],
      process_steps: [
        { title: "Discovery", description: "We start by understanding your brand, goals, target audience, and competitors." },
        { title: "Wireframing", description: "Creating the structural blueprint of the website to define user flow." },
        { title: "Visual Design", description: "Applying colors, typography, and imagery to create high-fidelity mockups." },
        { title: "Review & Refine", description: "Collaborating with you to ensure the design aligns perfectly with your vision." }
      ]
    },
    "frontend-development": {
      detailed_content: "Frontend development is where design comes to life. We specialize in building fast, interactive, and highly responsive user interfaces using modern frameworks like React, Next.js, and Vue. Our code is clean, modular, and optimized for performance, ensuring that your website looks flawless and functions perfectly across all devices and browsers. We pay meticulous attention to animations, state management, and accessibility.",
      features: ["React / Next.js / Vue.js", "Complex State Management", "Custom Animations & Micro-interactions", "Performance Optimization", "Cross-Browser Compatibility", "WCAG Accessibility Compliance"],
      process_steps: [
        { title: "Setup & Architecture", description: "Choosing the right framework and structuring the project for scalability." },
        { title: "Component Development", description: "Building reusable, modular UI components based on the design." },
        { title: "State & Logic", description: "Integrating complex logic and state management for seamless interactions." },
        { title: "Performance Testing", description: "Optimizing load times, smooth animations, and Lighthouse scores." }
      ]
    },
    "backend-api-development": {
      detailed_content: "A beautiful frontend means nothing without a robust backend to support it. We build secure, scalable server-side architectures and REST/GraphQL APIs that power your applications. From database design to third-party integrations and cloud deployment, we handle the complex logic that keeps your business running smoothly behind the scenes. We prioritize security, speed, and maintainability.",
      features: ["Node.js / Express / NestJS", "Database Design (SQL & NoSQL)", "RESTful & GraphQL API Development", "Authentication & Authorization", "Third-Party API Integrations", "Cloud Deployment & DevOps"],
      process_steps: [
        { title: "System Architecture", description: "Designing the database schema and overall system architecture." },
        { title: "API Development", description: "Building secure and efficient endpoints for the frontend to consume." },
        { title: "Database Integration", description: "Setting up databases (e.g., PostgreSQL, Supabase, MongoDB)." },
        { title: "Security & Testing", description: "Implementing robust security measures and rigorous unit/integration testing." }
      ]
    },
    "ecommerce-development": {
      detailed_content: "Transform your business with a powerful, scalable online store. Our e-commerce development service provides end-to-end solutions, from custom storefront design to secure payment gateway integration. We build platforms that are easy for you to manage and provide a frictionless shopping experience for your customers, ultimately driving sales and fostering brand loyalty.",
      features: ["Custom Storefront Design", "Secure Payment Gateway Integration", "Inventory Management Systems", "Shopping Cart & Checkout Optimization", "User Account Management", "SEO for E-commerce"],
      process_steps: [
        { title: "Platform Selection", description: "Choosing the best platform (Shopify, Custom Next.js, Stripe, etc.) for your needs." },
        { title: "Store Setup & Design", description: "Configuring the store and applying a custom, conversion-optimized design." },
        { title: "Product & Payment Integration", description: "Importing products and setting up secure payment processing." },
        { title: "Launch & Training", description: "Testing the checkout flow thoroughly and training you on store management." }
      ]
    },
    "website-maintenance-optimization": {
      detailed_content: "Launching a website is just the beginning. To stay competitive, your site needs ongoing care. Our maintenance and optimization service ensures your website remains fast, secure, and up-to-date. We handle everything from routine software updates and security patches to continuous performance monitoring and SEO enhancements, giving you peace of mind and keeping your visitors happy.",
      features: ["Regular Security Updates", "Performance & Speed Optimization", "Technical SEO Improvements", "Content Updates & Additions", "Uptime Monitoring", "Monthly Analytics Reports"],
      process_steps: [
        { title: "Audit & Baseline", description: "Conducting a comprehensive audit to establish current performance metrics." },
        { title: "Immediate Fixes", description: "Addressing any critical security vulnerabilities or severe performance bottlenecks." },
        { title: "Ongoing Monitoring", description: "Setting up automated monitoring for uptime and errors." },
        { title: "Continuous Improvement", description: "Regularly updating plugins/dependencies and optimizing for speed and SEO." }
      ]
    }
  };

  for (const s of services) {
    let slug = s.slug;
    if (!slug) {
      slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    // Find matching default content based on slug or generate empty if not found
    const contentData = defaultContent[slug] || {
      detailed_content: s.description,
      features: ["Feature 1", "Feature 2"],
      process_steps: [{title: "Step 1", description: "Desc"}]
    };

    const updatePayload = {
      slug: slug,
      detailed_content: s.detailed_content || contentData.detailed_content,
      features: s.features?.length > 0 ? s.features : contentData.features,
      process_steps: s.process_steps?.length > 0 ? s.process_steps : contentData.process_steps
    };

    const { error: upErr } = await supabase.from('services').update(updatePayload).eq('id', s.id);
    if (upErr) {
      console.error('Error updating', s.name, upErr);
    } else {
      console.log('Updated', s.name);
    }
  }
  console.log('Done');
}
seed();
