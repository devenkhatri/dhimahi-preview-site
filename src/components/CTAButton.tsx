'use client';

import { ReactNode } from 'react';
import { useCTATracking } from '@/hooks/useConversionTracking';

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  ctaText: string;
  ctaLocation: string;
  serviceName?: string;
  serviceCategory?: string;
  estimatedValue?: number;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function CTAButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  ctaText,
  ctaLocation,
  serviceName,
  serviceCategory,
  estimatedValue,
  disabled = false,
  type = 'button',
  ...props
}: CTAButtonProps) {
  const { trackClick } = useCTATracking();

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-lg hover:shadow-xl',
    secondary: 'bg-accent text-white hover:bg-accent-dark focus:ring-accent shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const handleClick = () => {
    // Track CTA click
    trackClick(ctaText, ctaLocation, href, {
      serviceName,
      serviceCategory,
      estimatedValue,
      variant,
      size
    });

    // Execute custom onClick if provided
    if (onClick) {
      onClick();
    }
  };

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}