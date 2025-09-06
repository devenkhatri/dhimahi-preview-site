import type { 
  HomepageContent, 
  ServiceData, 
  ServiceMeta,
  CaseStudy, 
  CaseStudyMeta,
  Insight,
  InsightMeta,
  AboutContent 
} from './cms-content';

// Fallback content for homepage
export function getDefaultHomepageContent(): HomepageContent {
  return {
    hero: {
      mainHeadline: "Transform Your Business with AI",
      subheadline: "**Dhīmahi Technolabs** helps SMEs in Ahmedabad & Gandhinagar grow with **AI automation, digital marketing, and smart IT strategy** — practical solutions that deliver real ROI.",
      trustBadge: "Gujarat's Preferred IT Partner",
      statistics: [
        { value: 25, suffix: "+", label: "Years Experience" },
        { value: 200, suffix: "+", label: "Businesses Transformed" },
        { value: 95, suffix: "%", label: "Client Satisfaction" }
      ],
      ctaButtons: {
        primary: "Get Free AI Consultation",
        secondary: "Explore Our Services"
      },
      trustIndicators: [
        "Free consultation",
        "ROI-focused approach",
        "Local Gujarat expertise"
      ],
      floatingBadges: [
        { icon: "🏆", text: "25+ Years Expertise" },
        { icon: "🚀", text: "AI-Ready Solutions" },
        { icon: "📈", text: "Proven ROI Results" },
        { icon: "🎯", text: "Gujarat SME Focus" }
      ]
    },
    services: {
      title: "Our Services",
      subtitle: "Helping SMEs in Ahmedabad & Gandhinagar grow with AI, digital marketing, and smart IT strategy."
    },
    whyChooseUs: {
      title: "Why Choose Dhīmahi Technolabs?",
      subtitle: "With 25+ years of IT expertise, we help SMEs take smarter digital steps — practical, affordable, and future-ready.",
      reasons: [
        {
          icon: "👨‍💼",
          title: "25+ Years of Experience",
          description: "Deep expertise in IT, digital marketing, and AI — guiding SMEs with proven strategies, not experiments."
        },
        {
          icon: "📍",
          title: "Local Focus",
          description: "We understand the needs of Ahmedabad & Gandhinagar businesses and provide solutions tailored to your market."
        },
        {
          icon: "💡",
          title: "Practical & Affordable",
          description: "No enterprise complexity — just straightforward, cost-effective IT and digital solutions that deliver ROI."
        },
        {
          icon: "🚀",
          title: "Future-Ready Solutions",
          description: "From AI to automation, we help you stay ahead of the curve and prepare your business for tomorrow."
        }
      ]
    },
    testimonials: {
      title: "Client Success Stories",
      subtitle: "We've helped SMEs across Gujarat streamline operations, grow online, and adopt future-ready IT solutions.",
      items: [
        {
          quote: "With Dhimahi Technolabs, we automated our sales follow-ups using AI tools. Our response time improved by 70%, and our small sales team now closes more deals effortlessly.",
          author: "Owner, Manufacturing SME (Ahmedabad)"
        },
        {
          quote: "Our website was outdated and invisible on Google. Dhimahi redesigned it and implemented SEO. Within 3 months, we started getting steady inquiries and 40% more leads.",
          author: "Director, Service Company (Gandhinagar)"
        },
        {
          quote: "As a growing business, we were confused about which CRM and ERP tools to invest in. Dhimahi guided us like a Fractional CTO and saved us lakhs in wrong purchases.",
          author: "Founder, Trading Firm (Ahmedabad)"
        }
      ]
    },
    contactCta: {
      title: "Let's Discuss Your Business Goals",
      description: "Your first consultation is **free**. Let's explore how AI, digital growth, and smart IT strategy can help your business scale.",
      buttons: {
        primary: "Book Free Consultation",
        secondary: "Get Project Quote"
      }
    },
    contactForm: {
      title: "Send us a message",
      description: "Tell us briefly about your goals. We'll reply within 1 business day.",
      email: "hello@dhimahitechnolabs.com"
    }
  };
}

// Fallback content for about page
export function getDefaultAboutContent(): AboutContent {
  return {
    title: "About Dhīmahi Technolabs",
    subtitle: "Making technology accessible to SMEs across Gujarat for over 25 years. We bridge the gap between traditional business values and modern digital solutions.",
    mission: {
      title: "Our Mission",
      description: "To empower small and medium businesses in Ahmedabad & Gandhinagar and beyond with practical, affordable, and future-ready technology solutions that drive real business growth.",
      vision: "To be Gujarat's most trusted IT consultancy, known for transforming SMEs into digitally empowered, future-ready businesses that compete confidently in the modern marketplace."
    },
    values: [
      {
        icon: "🤝",
        title: "Trust & Transparency",
        description: "We build lasting relationships through honest communication, clear pricing, and reliable delivery. Your success is our success."
      },
      {
        icon: "💡",
        title: "Innovation with Purpose",
        description: "We don't chase every tech trend. Instead, we carefully select solutions that deliver real business value and ROI."
      },
      {
        icon: "🎯",
        title: "SME-Focused Approach",
        description: "We understand the unique challenges of small and medium businesses and tailor our solutions accordingly."
      }
    ],
    timeline: [
      {
        year: "1999",
        title: "Foundation & Early Years",
        description: "Started as a small IT services company, focusing on basic web development and computer solutions for local businesses in Ahmedabad."
      },
      {
        year: "2005",
        title: "Digital Marketing Expansion",
        description: "Expanded into digital marketing services as businesses began recognizing the importance of online presence and search engine visibility."
      },
      {
        year: "2015",
        title: "Cloud & Mobile Revolution",
        description: "Embraced cloud technologies and mobile-first approaches, helping clients transition from traditional systems to modern, scalable solutions."
      }
    ],
    team: [
      {
        name: "Rajesh Patel",
        role: "Founder & Chief Technology Officer",
        bio: "With 25+ years in IT, Rajesh leads our technology vision and ensures we stay ahead of industry trends while maintaining practical, business-focused solutions.",
        expertise: ["IT Strategy", "AI Consulting", "Business Automation", "Team Leadership"]
      }
    ]
  };
}

// Fallback content for services
export function getDefaultServiceMeta(): ServiceMeta[] {
  return [
    {
      slug: "web-development",
      title: "Web Development",
      icon: "🌐",
      excerpt: "Custom websites and web applications built for performance, SEO, and user experience.",
      order: 1,
      features: [
        "Responsive Design",
        "SEO Optimization",
        "Performance Focused",
        "Mobile-First Approach"
      ],
      timeline: "2-6 weeks"
    },
    {
      slug: "digital-marketing",
      title: "Digital Marketing",
      icon: "📈",
      excerpt: "Data-driven digital marketing strategies to grow your online presence and generate leads.",
      order: 2,
      features: [
        "SEO & Local SEO",
        "Google Ads Management",
        "Social Media Marketing",
        "Content Strategy"
      ],
      timeline: "Ongoing"
    },
    {
      slug: "ai-automation",
      title: "AI & Automation",
      icon: "🤖",
      excerpt: "Practical AI solutions and business process automation to improve efficiency and reduce costs.",
      order: 3,
      features: [
        "Process Automation",
        "AI Chatbots",
        "Data Analysis",
        "Workflow Optimization"
      ],
      timeline: "1-4 weeks"
    }
  ];
}

export function getDefaultServiceData(slug: string): ServiceData {
  const services: Record<string, ServiceData> = {
    "web-development": {
      slug: "web-development",
      title: "Web Development",
      icon: "🌐",
      excerpt: "Custom websites and web applications built for performance, SEO, and user experience.",
      order: 1,
      features: [
        "Responsive Design",
        "SEO Optimization",
        "Performance Focused",
        "Mobile-First Approach"
      ],
      content: "<p>Professional web development services for SMEs in Gujarat.</p>",
      processSteps: [
        {
          step: 1,
          title: "Discovery & Planning",
          description: "Understanding your business goals and technical requirements",
          duration: "1-2 days",
          deliverables: ["Project requirements", "Technical specification"]
        },
        {
          step: 2,
          title: "Design & Development",
          description: "Creating responsive, user-friendly websites",
          duration: "1-3 weeks",
          deliverables: ["Website design", "Functional website"]
        },
        {
          step: 3,
          title: "Testing & Launch",
          description: "Thorough testing and smooth deployment",
          duration: "2-3 days",
          deliverables: ["Tested website", "Live deployment"]
        }
      ],
      technologyStack: [
        {
          category: "Frontend",
          technologies: [
            { name: "React", description: "Modern JavaScript library for building user interfaces" },
            { name: "Next.js", description: "React framework for production-ready applications" },
            { name: "TypeScript", description: "Typed JavaScript for better development experience" }
          ]
        },
        {
          category: "Backend",
          technologies: [
            { name: "Node.js", description: "JavaScript runtime for server-side development" },
            { name: "Python", description: "Versatile programming language for web development" },
            { name: "PHP", description: "Server-side scripting language for web applications" }
          ]
        }
      ],
      faqs: [
        {
          question: "How long does web development take?",
          answer: "Typically 2-6 weeks depending on complexity and requirements."
        }
      ],
      timeline: "2-6 weeks",
      startingPrice: "₹25,000"
    },
    "digital-marketing": {
      slug: "digital-marketing",
      title: "Digital Marketing",
      icon: "📈",
      excerpt: "Data-driven digital marketing strategies to grow your online presence and generate leads.",
      order: 2,
      features: [
        "SEO & Local SEO",
        "Google Ads Management",
        "Social Media Marketing",
        "Content Strategy"
      ],
      content: "<p>Comprehensive digital marketing services for Gujarat SMEs.</p>",
      processSteps: [
        {
          step: 1,
          title: "Strategy Development",
          description: "Creating customized marketing strategies",
          duration: "1 week",
          deliverables: ["Marketing strategy", "Campaign plan"]
        },
        {
          step: 2,
          title: "Implementation",
          description: "Executing campaigns across channels",
          duration: "Ongoing",
          deliverables: ["Active campaigns", "Performance tracking"]
        },
        {
          step: 3,
          title: "Optimization",
          description: "Continuous improvement based on data",
          duration: "Ongoing",
          deliverables: ["Performance reports", "Optimization recommendations"]
        }
      ],
      technologyStack: [
        {
          category: "Analytics",
          technologies: [
            { name: "Google Analytics", description: "Web analytics and reporting platform" },
            { name: "Google Tag Manager", description: "Tag management system for tracking" }
          ]
        },
        {
          category: "Advertising",
          technologies: [
            { name: "Google Ads", description: "Online advertising platform" },
            { name: "Facebook Ads", description: "Social media advertising platform" }
          ]
        }
      ],
      faqs: [
        {
          question: "How long before I see results?",
          answer: "SEO results typically take 3-6 months, while paid advertising can show results within days."
        }
      ],
      timeline: "Ongoing",
      startingPrice: "₹15,000/month"
    },
    "ai-automation": {
      slug: "ai-automation",
      title: "AI & Automation",
      icon: "🤖",
      excerpt: "Practical AI solutions and business process automation to improve efficiency and reduce costs.",
      order: 3,
      features: [
        "Process Automation",
        "AI Chatbots",
        "Data Analysis",
        "Workflow Optimization"
      ],
      content: "<p>AI and automation solutions tailored for SMEs.</p>",
      processSteps: [
        {
          step: 1,
          title: "Process Analysis",
          description: "Identifying automation opportunities",
          duration: "3-5 days",
          deliverables: ["Process audit", "Automation roadmap"]
        },
        {
          step: 2,
          title: "Solution Design",
          description: "Designing AI-powered solutions",
          duration: "1-2 weeks",
          deliverables: ["Solution architecture", "Implementation plan"]
        },
        {
          step: 3,
          title: "Implementation",
          description: "Deploying and training your team",
          duration: "1-2 weeks",
          deliverables: ["Working automation", "Team training"]
        }
      ],
      technologyStack: [
        {
          category: "AI/ML",
          technologies: [
            { name: "OpenAI", description: "Advanced AI models and APIs" },
            { name: "TensorFlow", description: "Machine learning framework" },
            { name: "Python", description: "Programming language for AI development" }
          ]
        },
        {
          category: "Automation",
          technologies: [
            { name: "Zapier", description: "Workflow automation platform" },
            { name: "Make", description: "Visual automation platform" },
            { name: "Custom APIs", description: "Tailored integration solutions" }
          ]
        }
      ],
      faqs: [
        {
          question: "Is AI suitable for small businesses?",
          answer: "Yes, we focus on practical, cost-effective AI solutions that provide immediate value."
        }
      ],
      timeline: "1-4 weeks",
      startingPrice: "₹20,000"
    }
  };

  return services[slug] || services["web-development"];
}

// Fallback content for case studies
export function getDefaultCaseStudyMeta(): CaseStudyMeta[] {
  return [
    {
      slug: "healthcare-clinic-website-development",
      title: "Healthcare Clinic Website Development",
      client: {
        name: "Gujarat Healthcare Clinic",
        industry: "Healthcare",
        size: "Small",
        location: "Ahmedabad"
      },
      projectType: "Web Development",
      duration: "4 weeks",
      excerpt: "Modern website with online appointment booking system for a growing healthcare clinic.",
      publishDate: new Date('2024-01-15'),
      featured: true,
      category: "web-development",
      services: ["web-development"],
      images: [
        {
          src: "/case-studies/healthcare-website-home.jpg",
          alt: "Healthcare clinic website homepage",
          type: "result" as const
        }
      ]
    }
  ];
}

export function getDefaultCaseStudyData(slug: string): CaseStudy {
  return {
    slug: slug,
    title: "Sample Case Study",
    client: {
      name: "Sample Client",
      industry: "Technology",
      size: "Medium",
      location: "Ahmedabad"
    },
    projectType: "Web Development",
    duration: "4 weeks",
    teamSize: 3,
    challenge: "The client needed a modern web presence to compete in the digital marketplace.",
    solution: [
      "Developed a responsive website with modern design",
      "Implemented SEO best practices",
      "Added performance optimizations"
    ],
    results: [
      {
        label: "Page Load Speed",
        value: "2.1s",
        improvement: "Improved from 8.5s",
        timeframe: "After optimization"
      },
      {
        label: "Mobile Traffic",
        value: "+150%",
        improvement: "Significant increase",
        timeframe: "Within 3 months"
      }
    ],
    testimonial: {
      quote: "Dhimahi Technolabs delivered exactly what we needed. Professional service and great results.",
      author: "John Doe",
      position: "CEO",
      company: "Sample Client"
    },
    images: [
      {
        src: "/case-studies/sample-project.jpg",
        alt: "Sample project screenshot",
        type: "result" as const
      }
    ],
    technologies: [
      { name: "React", category: "Frontend" },
      { name: "Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" }
    ],
    services: ["web-development"],
    publishDate: new Date(),
    featured: false,
    content: "<p>This is a sample case study demonstrating our web development capabilities.</p>",
    excerpt: "A sample case study showcasing our development process and results.",
    category: "web-development"
  };
}

// Fallback content for insights
export function getDefaultInsightMeta(): InsightMeta[] {
  return [
    {
      slug: "ai-automation-for-smes",
      title: "AI Automation for SMEs: Getting Started Guide",
      excerpt: "A practical guide to implementing AI automation in small and medium businesses.",
      publishDate: new Date('2024-01-01'),
      author: "Dhimahi Team",
      category: "AI & Automation",
      tags: ["AI", "Automation", "SME", "Business Growth"],
      featuredImage: "/insights/ai-automation-guide.jpg"
    },
    {
      slug: "digital-marketing-trends-2024",
      title: "Digital Marketing Trends for Gujarat SMEs in 2024",
      excerpt: "Key digital marketing trends that Gujarat businesses should focus on this year.",
      publishDate: new Date('2024-01-15'),
      author: "Dhimahi Team",
      category: "Digital Marketing",
      tags: ["Digital Marketing", "Trends", "Gujarat", "SME"],
      featuredImage: "/insights/digital-marketing-trends.jpg"
    }
  ];
}

export function getDefaultInsightData(slug: string): Insight {
  const insights: Record<string, Insight> = {
    "ai-automation-for-smes": {
      slug: "ai-automation-for-smes",
      title: "AI Automation for SMEs: Getting Started Guide",
      excerpt: "A practical guide to implementing AI automation in small and medium businesses.",
      content: "<p>AI automation is becoming increasingly accessible for small and medium enterprises. This guide covers the basics of getting started.</p>",
      publishDate: new Date('2024-01-01'),
      author: "Dhimahi Team",
      category: "AI & Automation",
      tags: ["AI", "Automation", "SME", "Business Growth"],
      featuredImage: "/insights/ai-automation-guide.jpg",
      seo: {
        metaTitle: "AI Automation for SMEs: Getting Started Guide",
        metaDescription: "A practical guide to implementing AI automation in small and medium businesses.",
        keywords: "AI, Automation, SME, Business Growth"
      }
    }
  };

  return insights[slug] || {
    slug: slug,
    title: "Sample Insight Article",
    excerpt: "This is a sample insight article demonstrating our content structure.",
    content: "<p>This is sample content for an insight article.</p>",
    publishDate: new Date(),
    author: "Dhimahi Team",
    category: "General",
    tags: ["Sample"],
    seo: {
      metaTitle: "Sample Insight Article",
      metaDescription: "This is a sample insight article demonstrating our content structure.",
      keywords: "Sample"
    }
  };
}

// Error message templates
export const ERROR_MESSAGES = {
  CONTENT_NOT_FOUND: (type: string, slug: string) => 
    `${type} content not found for slug: ${slug}. Using fallback content.`,
  CONTENT_INVALID: (type: string, errors: string[]) => 
    `${type} content validation failed: ${errors.join(', ')}. Using fallback content.`,
  FILE_READ_ERROR: (path: string, error: string) => 
    `Failed to read file at ${path}: ${error}. Using fallback content.`,
  YAML_PARSE_ERROR: (path: string, error: string) => 
    `Failed to parse YAML file at ${path}: ${error}. Using fallback content.`,
  MARKDOWN_PARSE_ERROR: (path: string, error: string) => 
    `Failed to parse Markdown file at ${path}: ${error}. Using fallback content.`,
  DIRECTORY_NOT_FOUND: (path: string) => 
    `Directory not found: ${path}. Using fallback content.`,
  BUILD_TIME_ERROR: (type: string, count: number) => 
    `Build-time validation found ${count} errors in ${type} content. Check logs for details.`
};

// Logging utility for errors
export function logContentError(error: string, context?: Record<string, any>): void {
  console.error(`🚨 CMS Content Error: ${error}`);
  if (context) {
    console.error('Context:', context);
  }
}

// Logging utility for warnings
export function logContentWarning(warning: string, context?: Record<string, any>): void {
  console.warn(`⚠️  CMS Content Warning: ${warning}`);
  if (context) {
    console.warn('Context:', context);
  }
}