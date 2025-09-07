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
    onError?: () => void;        // callback when Calendly fails to load
    fallbackComponent?: React.ReactNode; // component to show when Calendly fails
    timeout?: number;            // timeout in ms before showing fallback (default 10000)
}

function buildUrl(base: string, opts: CalendlyEmbedProps) {
    const u = new URL(base);

    // Page settings → query params
    if (opts.pageSettings?.backgroundColor) u.searchParams.set("background_color", opts.pageSettings.backgroundColor.replace("#", "%23"));
    if (opts.pageSettings?.textColor) u.searchParams.set("text_color", opts.pageSettings.textColor.replace("#", "%23"));
    if (opts.pageSettings?.primaryColor) u.searchParams.set("primary_color", opts.pageSettings.primaryColor.replace("#", "%23"));
    if (opts.pageSettings?.hideEventTypeDetails) u.searchParams.set("hide_event_type_details", "true");
    if (opts.pageSettings?.hideLandingPageDetails) u.searchParams.set("hide_landing_page_details", "true");

    // UTM
    if (opts.utm?.utmCampaign) u.searchParams.set("utm_campaign", opts.utm.utmCampaign);
    if (opts.utm?.utmSource) u.searchParams.set("utm_source", opts.utm.utmSource);
    if (opts.utm?.utmMedium) u.searchParams.set("utm_medium", opts.utm.utmMedium);
    if (opts.utm?.utmContent) u.searchParams.set("utm_content", opts.utm.utmContent);
    if (opts.utm?.utmTerm) u.searchParams.set("utm_term", opts.utm.utmTerm);

    // Prefill
    if (opts.prefill?.name) u.searchParams.set("name", opts.prefill.name);
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
    prefill,
    onError,
    fallbackComponent,
    timeout = 10000
}: CalendlyEmbedProps) {
    // Build final URL only when props change
    const finalUrl = useMemo(() => buildUrl(url, { url, height, className, pageSettings, utm, prefill }), [url, height, className, pageSettings, utm, prefill]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [showFallback, setShowFallback] = useState(false);
    const finalHeight = fullHeight ? "100vh" : `${height}px`;

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let scriptLoadTimeout: NodeJS.Timeout;

        // Set up timeout to show fallback if Calendly doesn't load
        const setupTimeout = () => {
            timeoutId = setTimeout(() => {
                console.warn('Calendly embed timeout - showing fallback');
                setHasError(true);
                setShowFallback(true);
                setIsLoading(false);
                onError?.();
            }, timeout);
        };

        // Check if Calendly script is already loaded
        const existingScript = document.querySelector<HTMLScriptElement>(
            'script[src="https://assets.calendly.com/assets/external/widget.js"]'
        );

        if (!existingScript) {
            // Load Calendly script
            const script = document.createElement("script");
            script.src = "https://assets.calendly.com/assets/external/widget.js";
            script.async = true;

            script.onload = () => {
                console.log('Calendly script loaded successfully');
                clearTimeout(scriptLoadTimeout);

                // Give Calendly time to initialize and mount iframe
                setTimeout(() => {
                    // Check if Calendly widget actually loaded
                    const calendlyWidget = document.querySelector('.calendly-inline-widget iframe');
                    if (calendlyWidget) {
                        console.log('Calendly widget loaded successfully');
                        setIsLoading(false);
                        clearTimeout(timeoutId);
                    } else {
                        console.warn('Calendly widget failed to load - showing fallback');
                        setHasError(true);
                        setShowFallback(true);
                        setIsLoading(false);
                        onError?.();
                    }
                }, 2000);
            };

            script.onerror = () => {
                console.error('Failed to load Calendly script - showing fallback');
                clearTimeout(scriptLoadTimeout);
                clearTimeout(timeoutId);
                setHasError(true);
                setShowFallback(true);
                setIsLoading(false);
                onError?.();
            };

            // Timeout for script loading
            scriptLoadTimeout = setTimeout(() => {
                console.warn('Calendly script load timeout - showing fallback');
                setHasError(true);
                setShowFallback(true);
                setIsLoading(false);
                onError?.();
            }, 8000);

            document.body.appendChild(script);
            setupTimeout();
        } else {
            // Script already exists, check if widget loads
            setTimeout(() => {
                const calendlyWidget = document.querySelector('.calendly-inline-widget iframe');
                if (calendlyWidget) {
                    console.log('Existing Calendly widget found');
                    setIsLoading(false);
                } else {
                    console.log('Calendly widget not found, waiting...');
                    setupTimeout();

                    // Check again after a delay
                    setTimeout(() => {
                        const widget = document.querySelector('.calendly-inline-widget iframe');
                        if (widget) {
                            console.log('Calendly widget loaded after delay');
                            setIsLoading(false);
                            clearTimeout(timeoutId);
                        }
                    }, 2000);
                }
            }, 1000);
        }

        // Cleanup timeouts on unmount
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(scriptLoadTimeout);
        };
    }, [timeout, onError]);

    // Show fallback if there's an error or explicit fallback request
    if (showFallback && fallbackComponent) {
        return (
            <div className="w-full">
                {fallbackComponent}
            </div>
        );
    }

    return (
        <div className="relative w-full">
            {isLoading && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-600 text-sm z-10"
                    style={{ height: finalHeight }}
                >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <p>{loadingText}</p>
                    {timeout > 5000 && (
                        <p className="text-xs text-gray-500 mt-2">
                            Having trouble loading? We'll show an alternative form shortly.
                        </p>
                    )}
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
