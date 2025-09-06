import Link from "next/link";
import { COMPANY_NAME } from "@/lib/constants";
import { getAllCMSServices } from "@/lib/cms-content";
import { generateMetadata, defaultMeta } from "@/lib/meta";

export const metadata = generateMetadata(defaultMeta.services);

export default function ServicesPage() {
  const services = getAllCMSServices();
  return (
    <main className="py-12 sm:py-16">


      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {COMPANY_NAME} offers comprehensive IT consulting and digital transformation services 
            designed specifically for SMEs in Gujarat. We help businesses leverage technology 
            to drive growth, improve efficiency, and stay competitive.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
          {services.map((service) => (
            <Link 
              href={`/services/${service.slug}`} 
              key={service.slug}
              className="group rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300 hover:border-primary"
            >
              <div className="text-3xl sm:text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{service.excerpt}</p>
              
              {/* Timeline */}
              {service.timeline && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    ⏱️ {service.timeline}
                  </span>
                </div>
              )}
              
              <ul className="space-y-2">
                {service.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="text-xs sm:text-sm text-gray-500 flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
                {service.features.length > 4 && (
                  <li className="text-xs sm:text-sm text-gray-400 italic">
                    +{service.features.length - 4} more features
                  </li>
                )}
              </ul>
              <div className="mt-4 sm:mt-6 text-primary font-medium group-hover:underline text-sm sm:text-base">
                Learn More →
              </div>
            </Link>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Why Choose {COMPANY_NAME}?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-4">🏆</div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">25+ Years Experience</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Deep expertise in IT consulting and digital transformation for SMEs.</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-4">📍</div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Local Gujarat Focus</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Understanding of local business needs and market dynamics.</p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl mb-4">💡</div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Practical Solutions</h3>
              <p className="text-gray-600 text-xs sm:text-sm">No enterprise complexity - just straightforward, effective solutions.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
            Let's discuss how our services can help your business grow and succeed in the digital age.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/#contact-form"
              className="rounded-2xl bg-primary px-6 sm:px-8 py-3 sm:py-4 font-medium text-white shadow-soft hover:bg-primary-dark text-center text-sm sm:text-base"
            >
              Get Free Consultation
            </Link>
            <Link 
              href="/insights"
              className="rounded-2xl border border-gray-300 px-6 sm:px-8 py-3 sm:py-4 font-medium hover:bg-gray-50 text-center text-sm sm:text-base"
            >
              Read Our Insights
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}