import { COMPANY_NAME, CITY_LINE, EMAIL } from "@/lib/constants";
import { getCMSAboutContent } from "@/lib/cms-content";
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
    const aboutContent = getCMSAboutContent();
    
    return (
        <main>
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            {aboutContent.title}
                        </h1>
                        <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                            {aboutContent.subtitle}
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
                                    {aboutContent.mission.title}
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                    {aboutContent.mission.description}
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
                                    {aboutContent.mission.vision}
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
                            {aboutContent.timeline.map((milestone, index) => (
                                <Milestone
                                    key={index}
                                    year={milestone.year}
                                    title={milestone.title}
                                    description={milestone.description}
                                />
                            ))}
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
                            {aboutContent.values.map((value, index) => (
                                <ValueCard
                                    key={index}
                                    icon={value.icon}
                                    title={value.title}
                                    description={value.description}
                                />
                            ))}
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
                            {aboutContent.team.map((member, index) => (
                                <TeamMember
                                    key={index}
                                    name={member.name}
                                    role={member.role}
                                    bio={member.bio}
                                    expertise={member.expertise}
                                />
                            ))}
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