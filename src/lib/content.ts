import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface HomepageContent {
  hero: {
    mainHeadline: string;
    subheadline: string;
    trustBadge: string;
    statistics: Array<{
      value: number;
      suffix: string;
      label: string;
    }>;
    ctaButtons: {
      primary: string;
      secondary: string;
    };
    trustIndicators: string[];
    floatingBadges: Array<{
      icon: string;
      text: string;
    }>;
  };
  services: {
    title: string;
    subtitle: string;
  };
  whyChooseUs: {
    title: string;
    subtitle: string;
    reasons: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      quote: string;
      author: string;
    }>;
  };
  contactCta: {
    title: string;
    description: string;
    buttons: {
      primary: string;
      secondary: string;
    };
  };
  contactForm: {
    title: string;
    description: string;
    email: string;
  };
}

export interface AboutContent {
  title: string;
  subtitle: string;
  subIntroduction?: string;
  mission: {
    title: string;
    description: string;
    vision: string;
  };
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  ceo?: {
    name: string;
    position: string;
    photo?: string;
    story: string;
    linkedinUrl?: string;
  };
  team: Array<{
    name: string;
    role: string;
    bio: string;
    expertise: string[];
  }>;
}

export function getHomepageContent(): HomepageContent {
  const fullPath = path.join(contentDirectory, 'homepage.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);

  // Parse the markdown content and extract structured data
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

export function getAboutContent(): AboutContent {
  const fullPath = path.join(contentDirectory, 'about.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);

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
      },
      {
        icon: "📚",
        title: "Continuous Learning",
        description: "Technology evolves rapidly. We stay ahead of the curve to ensure our clients benefit from the latest innovations."
      },
      {
        icon: "🌱",
        title: "Sustainable Growth",
        description: "We help businesses grow sustainably, building strong foundations rather than quick fixes."
      },
      {
        icon: "🏠",
        title: "Local Expertise",
        description: "Deep understanding of the Gujarat business landscape and local market dynamics."
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
      },
      {
        year: "2020",
        title: "AI & Automation Focus",
        description: "Pivoted to include AI consulting and business process automation, recognizing the transformative potential for SMEs."
      },
      {
        year: "2024",
        title: "Future-Ready Consultancy",
        description: "Evolved into a comprehensive IT consultancy, offering fractional CTO services and strategic technology guidance for growing businesses."
      }
    ],
    team: [
      {
        name: "Rajesh Patel",
        role: "Founder & Chief Technology Officer",
        bio: "With 25+ years in IT, Rajesh leads our technology vision and ensures we stay ahead of industry trends while maintaining practical, business-focused solutions.",
        expertise: ["IT Strategy", "AI Consulting", "Business Automation", "Team Leadership"]
      },
      {
        name: "Priyal Shah",
        role: "Digital Marketing Director",
        bio: "Priyal brings 15+ years of digital marketing expertise, specializing in helping SMEs build strong online presence and generate quality leads.",
        expertise: ["SEO", "PPC", "Social Media", "Content Strategy"]
      },
      {
        name: "Amit Desai",
        role: "Senior Web Developer",
        bio: "Amit is our technical lead for web development projects, ensuring every website we build is fast, secure, and user-friendly.",
        expertise: ["React", "Next.js", "WordPress", "E-commerce"]
      }
    ]
  };
}