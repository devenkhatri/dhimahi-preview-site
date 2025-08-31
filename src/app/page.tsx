import { COMPANY_NAME, PHONE, CITY_LINE } from "@/lib/constants";
import { getAllServices } from "@/lib/services";
import HeroSection from "@/components/HeroSection";

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


      {/* HERO */}
      <HeroSection />

      {/* SERVICES */}
      <section id="services" className="py-12 sm:py-16 md:py-20 bg-gray-50 relative">


        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Helping SMEs in {CITY_LINE} grow with AI, digital marketing, and smart IT strategy.
          </p>



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
              <a href="/consultation" className="inline-block rounded-xl bg-white text-primary px-4 sm:px-5 py-3 font-medium hover:opacity-90 text-center text-sm sm:text-base">Book Free Consultation</a>
              <a href="/quote" className="inline-block rounded-xl border border-white/70 px-4 sm:px-5 py-3 font-medium hover:bg-white/10 text-center text-sm sm:text-base">Get Project Quote</a>
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
          <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}