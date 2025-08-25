export default function SuccessPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-xl text-center">
        <div className="inline-block mb-4 bg-green-100 text-green-600 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold">
          📧 Message sent via preview site
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Thanks! We'll get back to you shortly.</h1>
        <p className="mt-3 text-gray-600 text-sm sm:text-base">
          Your message has been received. Our team will reach out within 1 business day.
        </p>
        <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-700">
            🚀 <strong>Exciting news:</strong> Our full website is launching soon with enhanced contact features and faster response times!
          </p>
        </div>
        <a href="/" className="inline-block mt-6 rounded-xl bg-primary px-4 sm:px-5 py-3 text-white font-medium text-sm sm:text-base">
          Go back home
        </a>
      </div>
    </main>
  );
}