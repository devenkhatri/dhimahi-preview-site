"use client";
import React, { useEffect, useMemo, useState } from "react";

type PageSettings = {
  backgroundColor?: string; // e.g. "#ffffff"
  textColor?: string;       // e.g. "#000000"
  primaryColor?: string;    // e.g. "#215b6f"
  hideEventTypeDetails?: boolean;
  hideLandingPageDetails?: boolean; // (Calendly ignores some options for inline, but harmless)
};

type UTM = {
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
};

type Prefill = {
  name?: string;
  email?: string;
  customAnswers?: Record<string, string>; // maps to q1, q2... in Calendly
};

interface CalendlyEmbedProps {
  url: string;                 // e.g. "https://calendly.com/dhimahitechnolabs/30min"
  height?: number;             // default 700
  fullHeight?: boolean;        // NEW: makes it fill viewport height
  className?: string;          // wrapper styles
  pageSettings?: PageSettings; // colors + visibility
  loadingText?: string;        // optional loading text
  utm?: UTM;                   // optional UTM params
  prefill?: Prefill;           // optionally prefill name/email
}

function buildUrl(base: string, opts: CalendlyEmbedProps) {
  const u = new URL(base);

  // Page settings → query params
  if (opts.pageSettings?.backgroundColor) u.searchParams.set("background_color", opts.pageSettings.backgroundColor.replace("#","%23"));
  if (opts.pageSettings?.textColor)       u.searchParams.set("text_color", opts.pageSettings.textColor.replace("#","%23"));
  if (opts.pageSettings?.primaryColor)    u.searchParams.set("primary_color", opts.pageSettings.primaryColor.replace("#","%23"));
  if (opts.pageSettings?.hideEventTypeDetails)    u.searchParams.set("hide_event_type_details", "true");
  if (opts.pageSettings?.hideLandingPageDetails)  u.searchParams.set("hide_landing_page_details", "true");

  // UTM
  if (opts.utm?.utmCampaign) u.searchParams.set("utm_campaign", opts.utm.utmCampaign);
  if (opts.utm?.utmSource)   u.searchParams.set("utm_source",   opts.utm.utmSource);
  if (opts.utm?.utmMedium)   u.searchParams.set("utm_medium",   opts.utm.utmMedium);
  if (opts.utm?.utmContent)  u.searchParams.set("utm_content",  opts.utm.utmContent);
  if (opts.utm?.utmTerm)     u.searchParams.set("utm_term",     opts.utm.utmTerm);

  // Prefill
  if (opts.prefill?.name)  u.searchParams.set("name",  opts.prefill.name);
  if (opts.prefill?.email) u.searchParams.set("email", opts.prefill.email);
  if (opts.prefill?.customAnswers) {
    Object.entries(opts.prefill.customAnswers).forEach(([k, v]) => u.searchParams.set(k, v));
  }

  return u.toString();
}

export default function CalendlyEmbed({
  url,
  height = 700,
  fullHeight = false,
  className = "",
  loadingText = "Loading your scheduling experience...",
  pageSettings,
  utm,
  prefill
}: CalendlyEmbedProps) {
  // Build final URL only when props change
  const finalUrl = useMemo(() => buildUrl(url, { url, height, className, pageSettings, utm, prefill }), [url, height, className, pageSettings, utm, prefill]);
  const [isLoading, setIsLoading] = useState(true);
  const finalHeight = fullHeight ? "100vh" : `${height}px`;

  useEffect(() => {
    // Load Calendly script once
    if (!document.querySelector<HTMLScriptElement>(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    )) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => {
        // give Calendly a moment to mount iframe
        setTimeout(() => setIsLoading(false), 1200);
      };
      document.body.appendChild(script);
    } else {
      // script already present → wait briefly then hide loader
      setTimeout(() => setIsLoading(false), 1200);
    }
  }, []);

  return (
    <div className="relative w-full">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-600 text-sm"
          style={{ height: finalHeight }}
        >
          ⏳ {loadingText}
        </div>
      )}
      <div
        className={`calendly-inline-widget ${className}`}
        data-url={finalUrl}
        style={{ minWidth: "320px", height: finalHeight }}
      />
    </div>
  );
}
