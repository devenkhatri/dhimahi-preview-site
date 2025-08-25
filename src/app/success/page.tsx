export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Message Sent!</h1>
          <p className="text-gray-600">
            Thank you for reaching out. We'll get back to you within 1 business day.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="/"
            className="block w-full rounded-xl bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Back to Home
          </a>

          <p className="text-sm text-gray-500">
            Need immediate assistance? Email us at{' '}
            <a
              href="mailto:hello@dhimahitechnolabs.com"
              className="text-primary hover:underline"
            >
              hello@dhimahitechnolabs.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}