"use client";
import { useState } from "react";

export default function NetlifyContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Let the form submit naturally to Netlify
    // We'll show success message after redirect
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Message Sent!</h3>
        <p className="text-green-700">Thank you for your message. We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <>
      {/* Hidden form for Netlify */}
      <form name="contact-form" data-netlify="true" hidden>
        <input name="name" />
        <input name="email" />
        <input name="phone" />
        <input name="company" />
        <textarea name="message" />
      </form>

      <form 
        name="contact-form"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        action="/success"
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4"
      >
        <input type="hidden" name="form-name" value="contact-form" />
        <p className="hidden">
          <label>Don't fill this out if you're human: <input name="bot-field" /></label>
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              name="name" 
              required 
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input 
              name="phone" 
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (optional)</label>
            <input 
              name="company" 
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">How can we help?</label>
          <textarea 
            name="message" 
            rows={5} 
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary" 
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button 
            type="submit" 
            className="rounded-xl bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Send Message
          </button>
          <span className="text-sm text-gray-500 text-center sm:text-left">
            Or email us at <a className="underline text-primary" href="mailto:hello@dhimahitechnolabs.com">hello@dhimahitechnolabs.com</a>
          </span>
        </div>
      </form>
    </>
  );
}