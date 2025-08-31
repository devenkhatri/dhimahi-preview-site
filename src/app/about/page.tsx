import { COMPANY_NAME, CITY_LINE, EMAIL } from "@/lib/constants";
import { aboutContent } from "@/content/about";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `About ${COMPANY_NAME} – 25+ Years of IT Excellence in Gujarat`,
    description: "Learn about Dhimahi Technolabs' journey, mission, and team. 25+ years of helping SMEs in Gujarat with AI solutions, digital marketing, and IT consulting.",
    keywords: [
        "about Dhimahi Technolabs",
        "IT consulting company Gujarat",
        "AI solutions provider Ahmedabad",
        "digital marketing agency Gandhinagar",
        "business automation experts",
        "SME IT consultancy"
    ],
    openGraph: {
        title: `About ${COMPANY_NAME} – 25+ Years of IT Excellence`,
        description: "Discover our mission to make technology accessible to SMEs across Gujarat. Learn about our expertise in AI, digital marketing, and business automation.",
        type: "website",
    },
};

interface TeamMemberProps {
    name: string;
    role: string;
    bio: string;
    expertise: string[];
}

function TeamMember({ name, role, bio, expertise }: TeamMemberProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="w-20 h-20 bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-[#215b6f] font-medium mb-3">{role}</p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{bio}</p>
            <div className="flex flex-wrap gap-2">
                {expertise.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}

interface ValueCardProps {
    icon: string;
    title: string;
    description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
    return (
        <div className="text-center">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

interface MilestoneProps {
    year: string;
    title: string;
    description: string;
}

function Milestone({ year, title, description }: MilestoneProps) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#215b6f] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {year}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

export default function AboutPage() {
    return (
        <main>
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            About {COMPANY_NAME}
                        </h1>
                        <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                            Making technology accessible to SMEs across Gujarat for over 25 years.
                            We bridge the gap between traditional business values and modern digital solutions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                    To empower small and medium businesses in {CITY_LINE} and beyond with
                                    practical, affordable, and future-ready technology solutions that drive
                                    real business growth.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    We believe that every business, regardless of size, deserves access to
                                    cutting-edge technology. Our role is to make AI, automation, and digital
                                    marketing accessible without the enterprise complexity.
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To be Gujarat's most trusted IT consultancy, known for transforming
                                    SMEs into digitally empowered, future-ready businesses that compete
                                    confidently in the modern marketplace.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                            Our Journey
                        </h2>
                        <div className="space-y-8">
                            <Milestone
                                year="1999"
                                title="Foundation & Early Years"
                                description="Started as a small IT services company, focusing on basic web development and computer solutions for local businesses in Ahmedabad."
                            />
                            <Milestone
                                year="2005"
                                title="Digital Marketing Expansion"
                                description="Expanded into digital marketing services as businesses began recognizing the importance of online presence and search engine visibility."
                            />
                            <Milestone
                                year="2015"
                                title="Cloud & Mobile Revolution"
                                description="Embraced cloud technologies and mobile-first approaches, helping clients transition from traditional systems to modern, scalable solutions."
                            />
                            <Milestone
                                year="2020"
                                title="AI & Automation Focus"
                                description="Pivoted to include AI consulting and business process automation, recognizing the transformative potential for SMEs."
                            />
                            <Milestone
                                year="2024"
                                title="Future-Ready Consultancy"
                                description="Evolved into a comprehensive IT consultancy, offering fractional CTO services and strategic technology guidance for growing businesses."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                            What Drives Us
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <ValueCard
                                icon="🤝"
                                title="Trust & Transparency"
                                description="We build lasting relationships through honest communication, clear pricing, and reliable delivery. Your success is our success."
                            />
                            <ValueCard
                                icon="💡"
                                title="Innovation with Purpose"
                                description="We don't chase every tech trend. Instead, we carefully select solutions that deliver real business value and ROI."
                            />
                            <ValueCard
                                icon="🎯"
                                title="SME-Focused Approach"
                                description="We understand the unique challenges of small and medium businesses and tailor our solutions accordingly."
                            />
                            <ValueCard
                                icon="📚"
                                title="Continuous Learning"
                                description="Technology evolves rapidly. We stay ahead of the curve to ensure our clients benefit from the latest innovations."
                            />
                            <ValueCard
                                icon="🌱"
                                title="Sustainable Growth"
                                description="We help businesses grow sustainably, building strong foundations rather than quick fixes."
                            />
                            <ValueCard
                                icon="🏠"
                                title="Local Expertise"
                                description="Deep understanding of the Gujarat business landscape and local market dynamics."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                            Our diverse team combines decades of experience with fresh perspectives,
                            ensuring we deliver both proven strategies and innovative solutions.
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <TeamMember
                                name="Rajesh Patel"
                                role="Founder & Chief Technology Officer"
                                bio="With 25+ years in IT, Rajesh leads our technology vision and ensures we stay ahead of industry trends while maintaining practical, business-focused solutions."
                                expertise={["IT Strategy", "AI Consulting", "Business Automation", "Team Leadership"]}
                            />
                            <TeamMember
                                name="Priyansh Shah"
                                role="Digital Marketing Director"
                                bio="Priyansh brings 15+ years of digital marketing expertise, specializing in helping SMEs build strong online presence and generate quality leads."
                                expertise={["SEO", "PPC", "Social Media", "Content Strategy"]}
                            />
                            <TeamMember
                                name="Amit Desai"
                                role="Senior Web Developer"
                                bio="Amit is our technical lead for web development projects, ensuring every website we build is fast, secure, and user-friendly."
                                expertise={["React", "Next.js", "WordPress", "E-commerce"]}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Why Businesses Trust Us
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 mt-12">
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    🎯 SME-Focused Solutions
                                </h3>
                                <p className="text-gray-600">
                                    We understand that SMEs need solutions that are practical, affordable,
                                    and deliver quick ROI. No enterprise complexity, just results.
                                </p>
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    🚀 Future-Ready Approach
                                </h3>
                                <p className="text-gray-600">
                                    We help you adopt emerging technologies like AI and automation
                                    gradually, ensuring smooth transitions and maximum benefit.
                                </p>
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    📍 Local Market Knowledge
                                </h3>
                                <p className="text-gray-600">
                                    Deep understanding of the Gujarat business landscape helps us
                                    create solutions that resonate with your local audience.
                                </p>
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    🤝 Long-term Partnership
                                </h3>
                                <p className="text-gray-600">
                                    We're not just vendors; we're your technology partners, committed
                                    to your long-term success and growth.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-xl opacity-90 mb-8">
                            Let's discuss how we can help your business grow with the right technology solutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/consultation"
                                className="inline-block bg-white text-[#215b6f] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                Book Free Consultation
                            </a>
                            <a
                                href={`mailto:${EMAIL}`}
                                className="inline-block border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#215b6f] transition-colors duration-200"
                            >
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}