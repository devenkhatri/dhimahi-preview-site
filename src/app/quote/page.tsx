import { Metadata } from "next";
import ProjectQuoteForm from "@/components/forms/ProjectQuoteForm";
import { getGeneralSettings } from "@/lib/settings";

const settings = getGeneralSettings();

export const metadata: Metadata = {
  title: `Get Project Quote | ${settings.brand.companyName}`,
  description: "Get a detailed project quote for your web development, digital marketing, or AI automation project. Free consultation and transparent pricing.",
  keywords: ["project quote", "web development cost", "digital marketing pricing", "AI automation quote", "IT project cost", "Ahmedabad", "Gujarat"],
  openGraph: {
    title: `Get Project Quote | ${settings.brand.companyName}`,
    description: "Get transparent pricing for your IT project. Detailed quotes with timeline and deliverables included.",
    type: "website"
  }
};

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Your Project Quote
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Tell us about your project and get a detailed, transparent quote. 
            We'll provide timeline estimates, deliverables, and pricing options.
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-8">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Transparent Pricing
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Detailed Proposals
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              No Hidden Costs
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              24hr Response
            </div>
          </div>
        </div>

        {/* Process overview */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Our Quote Process
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Submit Details</h3>
                <p className="text-sm text-gray-600">
                  Fill out our comprehensive form with your project requirements
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analysis</h3>
                <p className="text-sm text-gray-600">
                  Our team analyzes your requirements and prepares a detailed proposal
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quote Delivery</h3>
                <p className="text-sm text-gray-600">
                  Receive a comprehensive quote with timeline and deliverables
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Discussion</h3>
                <p className="text-sm text-gray-600">
                  Schedule a call to discuss the proposal and answer your questions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Form */}
        <ProjectQuoteForm />

        {/* What's included */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              What's Included in Your Quote
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Detailed Breakdown</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Project scope and deliverables
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Timeline with milestones
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Technology stack recommendations
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Pricing breakdown by phase
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Additional Services</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Maintenance and support options
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Training and documentation
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Hosting and deployment guidance
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Payment terms and options
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Quote FAQ
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                How accurate are your quotes?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Our quotes are highly accurate based on the information provided. We include a detailed 
                scope to minimize surprises. Any changes to requirements will be discussed and approved before implementation.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Do you offer payment plans?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Yes! We offer flexible payment options including milestone-based payments, monthly installments, 
                and upfront payment discounts. We'll discuss the best option for your cash flow.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                What if my requirements change during the project?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                We understand that requirements can evolve. We use an agile approach and will provide 
                change requests with transparent pricing for any scope modifications.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Do you provide ongoing support after project completion?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Absolutely! We offer various support packages including bug fixes, updates, hosting management, 
                and feature enhancements. Support options will be included in your quote.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}