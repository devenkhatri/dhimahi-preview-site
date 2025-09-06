'use client';

import { useState, useEffect } from 'react';
import type { HomepageContent } from "@/lib/cms-content";

interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ end, duration, suffix = '', prefix = '' }: CounterProps) {
  const [count, setCount] = useState(end); // Start with end value to prevent hydration mismatch

  useEffect(() => {
    // Reset to 0 and animate only on client
    setCount(0);

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    // Small delay to ensure smooth animation
    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <span suppressHydrationWarning>{prefix}{count}{suffix}</span>;
}

interface TrustBadgeProps {
  icon: string;
  text: string;
  delay?: number;
}

function FloatingTrustBadge({ icon, text, delay = 0 }: TrustBadgeProps) {
  return (
    <div
      className="bg-white backdrop-blur-sm text-primary px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-primary/20 animate-float hover:scale-105 transition-transform duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="mr-1.5 text-sm">{icon}</span>
      <span className="whitespace-nowrap">{text}</span>
    </div>
  );
}

interface StatisticProps {
  value: number;
  suffix: string;
  label: string;
  duration?: number;
}

function StatisticCard({ value, suffix, label, duration = 2000 }: StatisticProps) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold text-primary">
        <AnimatedCounter end={value} duration={duration} suffix={suffix} />
      </div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );
}

interface HeroSectionProps {
  content: HomepageContent['hero'];
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-white via-accent-soft/30 to-white">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Primary gradient blob */}
        <svg className="absolute -top-24 -left-24 h-[420px] w-[420px] opacity-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="heroGradient1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
          </defs>
          <path fill="url(#heroGradient1)" d="M37.3,-63.4C47.4,-55.2,54.8,-47,60.9,-37.2C66.9,-27.3,71.6,-15.6,72.1,-3.6C72.6,8.4,68.7,20.7,63.2,32.1C57.7,43.4,50.6,53.8,40.4,60.8C30.2,67.7,16.9,71.3,3.1,67.2C-10.6,63.2,-21.2,51.6,-32.6,43.4C-44,35.1,-56.2,30.2,-63.7,20.9C-71.2,11.7,-74,-1.9,-70.5,-14.2C-67,-26.5,-57.1,-37.6,-45.7,-46C-34.3,-54.5,-21.4,-60.3,-8.2,-60.8C5,-61.4,10,-56.7,37.3,-63.4Z" transform="translate(100 100)" />
        </svg>

        {/* Secondary accent blob */}
        <svg className="absolute -bottom-32 -right-32 h-[380px] w-[380px] opacity-8" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="heroGradient2" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <path fill="url(#heroGradient2)" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.2,-0.5C88.4,15.3,84.2,30.6,76.8,44.2C69.4,57.8,58.8,69.7,45.6,76.8C32.4,83.9,16.2,86.2,0.5,85.4C-15.2,84.6,-30.4,80.7,-43.8,73.6C-57.2,66.5,-68.8,56.2,-75.9,43.1C-83,30,-85.6,15.1,-84.8,0.6C-84,-13.9,-79.8,-27.8,-72.4,-40.2C-65,-52.6,-54.4,-63.5,-41.8,-71.2C-29.2,-78.9,-14.6,-83.4,0.8,-84.8C16.2,-86.2,32.4,-84.5,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>

        {/* Floating geometric elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-40 left-1/4 w-3 h-3 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-5 h-5 bg-accent/15 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-20 md:py-28" suppressHydrationWarning>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Section */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            {/* Trust Indicator Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {content.trustBadge}
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-gray-900">{content.mainHeadline.split(' ').slice(0, 2).join(' ')}</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {content.mainHeadline.split(' ').slice(2).join(' ')}
              </span>
            </h1>

            {/* Subheadline */}
            <div className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              <div dangerouslySetInnerHTML={{
                __html: content.subheadline
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }} />
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-3 gap-6 mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40">
              {content.statistics.map((stat, index) => (
                <StatisticCard
                  key={index}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  duration={2500 + (index * 300)}
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href="/consultation"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-8 py-4 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
              >
                <span className="relative z-10">{content.ctaButtons?.primary || "Get Free AI Consultation"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="#services"
                className="group rounded-2xl border-2 border-primary/20 bg-white/80 backdrop-blur-sm px-8 py-4 font-semibold text-primary hover:bg-primary hover:text-white transition-all duration-300 text-center"
              >
                {content.ctaButtons?.secondary || "Explore Our Services"}
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-600">
              {content.trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{indicator}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Section */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white via-accent-soft/50 to-primary/5 p-8">
              {/* Hero Illustration - Background Layer */}
              <div className="relative z-0">
                <img
                  src="/hero-illustration.svg"
                  alt="AI-powered business transformation for SMEs in Gujarat"
                  className="w-full h-auto animate-fade-in opacity-90"
                />
              </div>

              {/* Floating Trust Badges - Foreground Layer */}
              {content.floatingBadges?.map((badge, index) => {
                const positions = [
                  { top: '10%', left: '5%' },
                  { top: '15%', right: '8%' },
                  { bottom: '20%', left: '8%' },
                  { bottom: '15%', right: '5%' }
                ];
                return (
                  <div key={index} className="absolute z-30" style={positions[index] || positions[0]}>
                    <FloatingTrustBadge
                      icon={badge.icon}
                      text={badge.text}
                      delay={index * 500}
                    />
                  </div>
                );
              })}

              {/* Animated Elements - Background Layer */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full opacity-20 animate-pulse z-10"></div>
              <div className="absolute bottom-8 left-6 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full opacity-30 animate-float z-10"></div>

              {/* Glow Effect - Background Layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl z-0"></div>
            </div>

            {/* Additional floating elements around the main visual */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}