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

interface CEOCardProps {
    name: string;
    position: string;
    photo?: string;
    story: string;
    linkedinUrl?: string;
}

function renderMarkdownToHtml(markdown: string): string {
    // Simple markdown to HTML conversion for basic formatting
    return markdown
        // Headings: #### Heading -> <h4>Heading</h4> (process from most specific to least specific)
        .replace(/^#### (.+)$/gm, '<h4 class="text-base md:text-lg font-medium text-gray-900 mt-4 mb-2">$1</h4>')
        .replace(/^### (.+)$/gm, '<h3 class="text-lg md:text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
        // Bold text: **text** -> <strong>text</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        // Italic text: *text* -> <em>text</em>
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Bullet points: - item -> <li>item</li>
        .replace(/^- (.+)$/gm, '<li class="text-gray-600">$1</li>')
        // Wrap consecutive <li> elements in <ul>
        .replace(/(<li class="text-gray-600">[\s\S]*?<\/li>)/g, (match) => {
            const items = match.split('\n').filter(line => line.trim());
            return '<ul class="list-disc list-inside space-y-1 my-4 ml-4">' + items.join('') + '</ul>';
        })
        // Paragraphs: double line breaks -> <p>
        .split('\n\n')
        .map(paragraph => {
            const trimmed = paragraph.trim();
            if (trimmed && !trimmed.startsWith('<ul') && !trimmed.startsWith('<li>') && !trimmed.startsWith('<h')) {
                return `<p class="mb-4 text-gray-600 leading-relaxed">${trimmed}</p>`;
            }
            return trimmed;
        })
        .join('\n');
}

function CEOCard({ name, position, photo, story, linkedinUrl }: CEOCardProps) {
    const storyHtml = renderMarkdownToHtml(story);

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 w-full">
            <div className="grid md:grid-cols-4 gap-6 md:gap-8 items-start">
                {/* CEO Photo and Basic Info */}
                <div className="text-center md:text-left">
                    <div className="relative w-32 h-32 mx-auto md:mx-0 mb-4 md:mb-6">
                        {photo ? (
                            <img
                                src={photo}
                                alt={`${name} - ${position}`}
                                className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-200">
                                {name.split(' ').map(n => n[0]).join('')}
                            </div>
                        )}
                        {/* LinkedIn Badge */}
                        {linkedinUrl && (
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0077B5] rounded-full flex items-center justify-center text-white hover:bg-[#005885] transition-colors duration-200 shadow-lg"
                                aria-label={`${name}'s LinkedIn Profile`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        )}
                    </div>

                    {/* CEO Info */}
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{name}</h3>
                        <p className="text-[#215b6f] font-semibold text-base md:text-lg">{position}</p>
                    </div>
                </div>

                {/* Our Story */}
                <div className="md:col-span-3">
                    {/* <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Our Story</h4> */}
                    <div 
                        className="text-gray-600 leading-relaxed text-sm md:text-base prose prose-sm md:prose-base max-w-none"
                        dangerouslySetInnerHTML={{ __html: storyHtml }}
                    />
                </div>
            </div>
        </div>
    );
}

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





export default function AboutPage() {
    const aboutContent = getCMSAboutContent();

    return (
        <>
            <main>
                {/* Hero Section */}
                <section className="py-16 md:py-24 bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                {aboutContent.title}
                            </h1>
                            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-4">
                                {aboutContent.subtitle}
                            </p>
                            {aboutContent.subIntroduction && (
                                <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-3xl mx-auto">
                                    {aboutContent.subIntroduction}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Mission & Values */}
                <section className="py-16 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-16 items-start">
                                {/* Mission Section */}
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                        {aboutContent.mission.title}
                                    </h2>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                        {aboutContent.mission.description}
                                    </p>
                                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {aboutContent.mission.vision}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">
                                        We believe that every business, regardless of size, deserves access to
                                        cutting-edge technology. Our role is to make AI, automation, and digital
                                        marketing accessible without the enterprise complexity.
                                    </p>
                                </div>

                                {/* Values Section */}
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                        What Drives Us
                                    </h2>
                                    <div className="space-y-6">
                                        {aboutContent.values.map((value, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] rounded-full flex items-center justify-center text-white text-xl">
                                                        {value.icon}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                                                    <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CEO Section */}
                {aboutContent.ceo && (
                    <section className="py-16 md:py-20">
                        <div className="container mx-auto px-4">
                            <div className="max-w-6xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                                    Our Founding Story
                                </h2>
                                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                                    Discover why we started Dhīmahi Technolabs and our mission to bridge the technology gap for SMEs across Gujarat.
                                </p>
                                <CEOCard
                                    name={aboutContent.ceo.name}
                                    position={aboutContent.ceo.position}
                                    photo={aboutContent.ceo.photo}
                                    story={aboutContent.ceo.story}
                                    linkedinUrl={aboutContent.ceo.linkedinUrl}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Team Section */}
                {/* <section className="py-16 md:py-20 bg-gray-50">
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
                </section> */}

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

                {/* Connect With Us */}
                <section className="py-16 md:py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Connect With Us
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Follow us on social media for the latest insights, tips, and updates on AI, digital marketing, and business automation.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
                                <a
                                    href="https://linkedin.com/company/dhimahi-technolabs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 md:space-x-3 bg-[#0077B5] text-white px-3 md:px-6 py-2 md:py-3 rounded-xl hover:bg-[#005885] transition-colors duration-200 text-sm md:text-base"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    <span className="hidden sm:inline">LinkedIn</span>
                                </a>
                                <a
                                    href="https://twitter.com/dhimahitech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 md:space-x-3 bg-[#1DA1F2] text-white px-3 md:px-6 py-2 md:py-3 rounded-xl hover:bg-[#0d8bd9] transition-colors duration-200 text-sm md:text-base"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                    <span className="hidden sm:inline">Twitter</span>
                                </a>
                                <a
                                    href="https://www.facebook.com/dhimahi.technolabs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 md:space-x-3 bg-[#1877F2] text-white px-3 md:px-6 py-2 md:py-3 rounded-xl hover:bg-[#166fe5] transition-colors duration-200 text-sm md:text-base"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="hidden sm:inline">Facebook</span>
                                </a>
                                <a
                                    href="https://instagram.com/dhimahitechnolabs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-[#E4405F] to-[#C13584] text-white px-3 md:px-6 py-2 md:py-3 rounded-xl hover:from-[#d73653] hover:to-[#b02a7a] transition-colors duration-200 text-sm md:text-base"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                    <span className="hidden sm:inline">Instagram</span>
                                </a>
                                <a
                                    href="https://youtube.com/@dhimahitechnolabs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 md:space-x-3 bg-[#FF0000] text-white px-3 md:px-6 py-2 md:py-3 rounded-xl hover:bg-[#e60000] transition-colors duration-200 text-sm md:text-base"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    <span className="hidden sm:inline">YouTube</span>
                                </a>
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
        </>
    );
}