import { getGeneralSettings } from "@/lib/settings";
import { generateMetadata } from "@/lib/meta";

const settings = getGeneralSettings();

export const metadata = {
  ...generateMetadata({
    title: `Thank You - ${settings.brand.companyName}`,
    description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    path: "/success",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessPage() {
  const settings = getGeneralSettings();
  
  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">Thank You!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Your message has been sent successfully.
            </p>
            <p className="mt-4 text-gray-600">
              We'll get back to you within 24 hours. In the meantime, feel free to explore our services and insights.
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <a
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Back to Home
            </a>
            <a
              href="/services"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Explore Our Services
            </a>
            <a
              href="/insights"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Read Our Insights
            </a>
          </div>

          {(settings.contactEmail || settings.phone) && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Need immediate assistance?
              </p>
              <div className="mt-2 space-y-1">
                {settings.contactEmail && (
                  <p className="text-sm">
                    <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">
                      {settings.contactEmail}
                    </a>
                  </p>
                )}
                {settings.phone && (
                  <p className="text-sm">
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-primary hover:underline">
                      {settings.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}