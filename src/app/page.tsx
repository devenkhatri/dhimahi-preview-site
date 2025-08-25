import { COMPANY_NAME, PHONE, CITY_LINE } from "@/lib/constants";
import { getAllServices } from "@/lib/services";

interface ServiceCardProps {
  icon: string;
  title: string;
  body: string;
  features: string[];
  slug: string;
}

function ServiceCard({ icon, title, body, features, slug }: ServiceCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-soft">
      <div className="text-3xl sm:text-4xl mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm sm:text-base text-gray-600">{body}</p>
      <ul className="mt-4 space-y-1">
        {features.slice(0, 3).map((feature, index) => (
          <li key={index} className="text-xs sm:text-sm text-gray-500 flex items-center">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
            {feature}
          </li>
        ))}
      </ul>
      <a href={`/services/${slug}`} className="mt-4 inline-block text-primary font-medium hover:underline text-sm sm:text-base">Learn More →</a>
    </div>
  );
}

function ReasonCard({ icon, title, body }: { icon: string; title: string; body: string; }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 sm:p-6">
      <div className="text-xl sm:text-2xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-sm sm:text-base">{title}</h3>
      <p className="mt-2 text-xs sm:text-sm text-gray-600">{body}</p>
    </div>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string; }) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-soft">
      <p className="italic leading-relaxed text-sm sm:text-base">"{quote}"</p>
      <div className="mt-4 text-xs sm:text-sm text-gray-600">— {author}</div>
    </div>
  );
}

export default function HomePage() {
  const services = getAllServices();

  return (
    <main>
      {/* PROMINENT LAUNCH NOTICE */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-2 sm:px-4 text-center relative overflow-hidden border-b-4 border-yellow-400">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-bold mb-1">
            <span className="text-xl sm:text-2xl animate-bounce">🚀</span>
            <span className="bg-yellow-400 text-purple-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-black">COMING SOON</span>
            <span className="text-xl sm:text-2xl animate-bounce delay-300">🚀</span>
          </div>
          <p className="text-xs sm:text-sm md:text-base font-medium opacity-95 px-2">
            This is a preview of our new website • Full launch with advanced features happening soon!
          </p>
        </div>
        {/* Enhanced animated elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-[5%] w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-3 right-[8%] w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-2 left-[25%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-3 right-[30%] w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-1 left-[70%] w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-200"></div>
        </div>
      </div>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <svg className="absolute -top-24 -left-24 h-[320px] sm:h-[420px] md:h-[520px] w-[320px] sm:w-[420px] md:w-[520px] opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#0FB5AE" />
                <stop offset="100%" stopColor="#0A66C2" />
              </linearGradient>
            </defs>
            <path fill="url(#g1)" d="M37.3,-63.4C47.4,-55.2,54.8,-47,60.9,-37.2C66.9,-27.3,71.6,-15.6,72.1,-3.6C72.6,8.4,68.7,20.7,63.2,32.1C57.7,43.4,50.6,53.8,40.4,60.8C30.2,67.7,16.9,71.3,3.1,67.2C-10.6,63.2,-21.2,51.6,-32.6,43.4C-44,35.1,-56.2,30.2,-63.7,20.9C-71.2,11.7,-74,-1.9,-70.5,-14.2C-67,-26.5,-57.1,-37.6,-45.7,-46C-34.3,-54.5,-21.4,-60.3,-8.2,-60.8C5,-61.4,10,-56.7,37.3,-63.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <div className="inline-block mb-3 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold shadow-lg animate-pulse border-2 border-yellow-400">
                🚧 PREVIEW SITE • Full launch coming soon! 🚧
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs sm:text-sm font-medium text-primary">
                Gujarat SMEs • AI • Digital Growth
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Future-Ready IT Consulting for SMEs
              </h1>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700">
                At <strong>{COMPANY_NAME}</strong>, we help small and medium businesses in {CITY_LINE} grow with
                <strong> AI solutions, digital marketing, and smart IT strategy</strong> — without enterprise complexity or cost.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#contact-form"
                  className="rounded-2xl bg-primary px-4 sm:px-6 py-3 font-medium text-white shadow-soft hover:bg-primary-dark text-center text-sm sm:text-base"
                >
                  Book Your Free Consultation
                </a>
                <a
                  href="#services"
                  className="rounded-2xl border border-gray-300 px-4 sm:px-6 py-3 font-medium hover:bg-gray-50 text-center text-sm sm:text-base"
                >
                  Explore Services
                </a>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-gray-500">25+ years experience • Local focus • Practical, ROI-first.</p>
            </div>

            {/* Hero Illustration */}
            <div className="relative mt-8 lg:mt-0">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
                <img
                  src="/hero-illustration.svg"
                  alt="IT Consulting for SMEs - Digital Transformation, AI Solutions, and Business Growth"
                  className="w-full h-auto animate-fade-in"
                />
                {/* Floating badges */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  ✓ 25+ Years
                </div>
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-pulse delay-500">
                  🚀 AI Ready
                </div>
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-purple-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-pulse delay-1000">
                  📈 ROI Focused
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-12 sm:py-16 md:py-20 bg-gray-50 relative">
        {/* Services Launch Notice */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-yellow-400 text-black px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs font-bold shadow-lg animate-pulse z-10">
          🔥 More services coming in full launch!
        </div>

        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Helping SMEs in {CITY_LINE} grow with AI, digital marketing, and smart IT strategy.
          </p>

          {/* Preview Notice */}
          <div className="mb-6 sm:mb-8 text-center">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border border-blue-200">
              📋 Preview of our core services • Full service portfolio launching soon with detailed case studies!
            </div>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                icon={service.icon}
                title={service.title}
                body={service.excerpt}
                features={service.features}
                slug={service.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Why Choose {COMPANY_NAME}?</h2>
          <p className="section-subtitle">
            With 25+ years of IT expertise, we help SMEs take smarter digital steps — practical, affordable, and future-ready.
          </p>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ReasonCard icon="👨‍💼" title="25+ Years of Experience" body="Deep expertise in IT, digital marketing, and AI — guiding SMEs with proven strategies, not experiments." />
            <ReasonCard icon="📍" title="Local Focus" body={`We understand the needs of ${CITY_LINE} businesses and provide solutions tailored to your market.`} />
            <ReasonCard icon="💡" title="Practical & Affordable" body="No enterprise complexity — just straightforward, cost-effective IT and digital solutions that deliver ROI." />
            <ReasonCard icon="🚀" title="Future-Ready Solutions" body="From AI to automation, we help you stay ahead of the curve and prepare your business for tomorrow." />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="case-studies" className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Client Success Stories</h2>
          <p className="section-subtitle">
            We've helped SMEs across Gujarat streamline operations, grow online, and adopt future-ready IT solutions.
          </p>
          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="With Dhimahi Technolabs, we automated our sales follow-ups using AI tools. Our response time improved by 70%, and our small sales team now closes more deals effortlessly."
              author="Owner, Manufacturing SME (Ahmedabad)"
            />
            <TestimonialCard
              quote="Our website was outdated and invisible on Google. Dhimahi redesigned it and implemented SEO. Within 3 months, we started getting steady inquiries and 40% more leads."
              author="Director, Service Company (Gandhinagar)"
            />
            <TestimonialCard
              quote="As a growing business, we were confused about which CRM and ERP tools to invest in. Dhimahi guided us like a Fractional CTO and saved us lakhs in wrong purchases."
              author="Founder, Trading Firm (Ahmedabad)"
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-primary text-white p-6 sm:p-8 md:p-12 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Let's Discuss Your Business Goals</h2>
              <p className="mt-2 opacity-90 text-sm sm:text-base">Your first consultation is <strong>free</strong>. Let's explore how AI, digital growth, and smart IT strategy can help your business scale.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a href="mailto:hello@dhimahitechnolabs.com" className="inline-block rounded-xl bg-white text-primary px-4 sm:px-5 py-3 font-medium hover:opacity-90 text-center text-sm sm:text-base">Book Free Consultation</a>
              {PHONE && <a href={`tel:${PHONE}`} className="inline-block rounded-xl border border-white/70 px-4 sm:px-5 py-3 font-medium hover:bg-white/10 text-center text-sm sm:text-base">Call {PHONE}</a>}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM (Netlify Forms compatible) */}
      <section id="contact-form" className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto rounded-2xl bg-white shadow-soft p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Send us a message</h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Tell us briefly about your goals. We'll reply within 1 business day.</p>

            <form
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              action="/success"
              className="mt-6 grid gap-4"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>Don't fill this out if you're human: <input name="bot-field" /></label>
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input name="name" required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" name="email" required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input name="phone" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Company (optional)</label>
                  <input name="company" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">How can we help?</label>
                <textarea name="message" rows={5} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-white font-medium text-sm sm:text-base">Send Message</button>
                <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">Or email us at <a className="underline" href="mailto:hello@dhimahitechnolabs.com">hello@dhimahitechnolabs.com</a></span>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="inline-block mb-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
            PREVIEW VERSION
          </div>
          <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
          <p className="mt-1 text-xs">Full website launching soon with enhanced features!</p>
        </div>
      </footer>
    </main>
  );
}