import { Metadata } from "next";
import ConsultationBookingForm from "@/components/forms/ConsultationBookingForm";
import { COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Book Free Consultation | ${COMPANY_NAME}`,
  description: "Book a free 30-minute consultation with our IT experts. Get personalized insights for your business growth with AI, digital marketing, and smart IT solutions.",
  keywords: ["free consultation", "IT consulting", "business consultation", "AI solutions", "digital marketing", "Ahmedabad", "Gujarat"],
  openGraph: {
    title: `Book Free Consultation | ${COMPANY_NAME}`,
    description: "Get expert guidance for your business growth. Free 30-minute consultation with 25+ years of IT expertise.",
    type: "website"
  }
};

export default function ConsultationPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book Your Free Consultation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Get personalized insights and expert guidance for your business growth. 
            Our 30-minute consultation is completely free with no obligations.
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-8">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              25+ Years Experience
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              100+ SMEs Helped
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              No Sales Pressure
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Actionable Insights
            </div>
          </div>
        </div>

        {/* What to expect */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              What to Expect in Your Consultation
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Analysis</h3>
                <p className="text-sm text-gray-600">
                  We'll analyze your current situation and identify growth opportunities
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Custom Recommendations</h3>
                <p className="text-sm text-gray-600">
                  Get tailored solutions for your specific industry and business size
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Action Plan</h3>
                <p className="text-sm text-gray-600">
                  Leave with a clear roadmap for your next steps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Form */}
        <ConsultationBookingForm />

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Is the consultation really free?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Yes, absolutely! Our initial 30-minute consultation is completely free with no strings attached. 
                We believe in providing value upfront and building relationships based on trust.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                What if I'm not ready to start a project immediately?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                That's perfectly fine! Many of our consultations are for businesses in the planning phase. 
                We'll provide insights and recommendations that you can implement when you're ready.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Do you work with businesses outside Gujarat?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                While we're based in Ahmedabad and Gandhinagar, we work with businesses across India. 
                Many of our consultations and projects are conducted remotely.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                What should I prepare for the consultation?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Just come with your questions and challenges! If you have a website or existing systems, 
                having those details handy can help, but it's not required.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}