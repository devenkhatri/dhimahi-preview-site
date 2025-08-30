'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMPANY_NAME } from '@/lib/constants';
import { useLanguage, translations } from '@/contexts/LanguageContext';

interface HeaderProps {
  transparent?: boolean;
  sticky?: boolean;
}

export default function Header({ transparent = false, sticky = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, setLanguage, t } = useLanguage();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('#mobile-menu') && !target.closest('#mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus search input when opening
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const handleLanguageSwitch = (lang: 'en' | 'gu') => {
    setLanguage(lang);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navigationItems = [
    { href: '/services', label: translations.services },
    { href: '/#case-studies', label: translations.portfolio },
    { href: '/insights', label: translations.insights },
    { href: '/#about', label: translations.about },
  ];

  const headerClasses = `
    ${sticky ? 'sticky top-0' : ''} 
    z-50 
    ${transparent ? 'bg-white/80' : 'bg-white/95'} 
    backdrop-blur-md 
    border-b border-gray-200/50 
    shadow-sm 
    transition-all duration-300
  `.trim();

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/favicon.svg"
                alt={`${COMPANY_NAME} Logo`}
                className="w-10 h-10 lg:w-12 lg:h-12 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg lg:text-xl text-gray-900 leading-tight">
                {COMPANY_NAME}
              </span>
              <span className="text-xs text-gray-600 leading-tight hidden sm:block">
                {t('tagline', translations.futureReadyIT.en, translations.futureReadyIT.gu)}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-[#215b6f] font-medium transition-colors duration-200 relative group"
              >
                {language === 'en' ? item.label.en : item.label.gu}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#215b6f] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-[#215b6f] transition-colors duration-200"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => handleLanguageSwitch(language === 'en' ? 'gu' : 'en')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-[#215b6f] border border-gray-300 rounded-lg hover:border-[#215b6f] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {language === 'en' ? 'ગુજરાતી' : 'English'}
              </button>
            </div>

            {/* CTA Button */}
            <Link
              href="/#contact-form"
              className="bg-[#215b6f] hover:bg-[#1a4a5a] text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {t('cta', translations.freeConsultation.en, translations.freeConsultation.gu)}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-[#215b6f] transition-colors duration-200"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-button"
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-[#215b6f] transition-colors duration-200"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-gray-200 py-4 animate-fade-in">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder', translations.searchPlaceholder.en, translations.searchPlaceholder.gu)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#215b6f] focus:border-transparent outline-none transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#215b6f] text-white rounded-lg hover:bg-[#1a4a5a] transition-colors duration-200 font-medium"
              >
                {t('search', translations.search.en, translations.search.gu)}
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        <div 
          id="mobile-menu"
          className={`lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="py-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-gray-700 hover:text-[#215b6f] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {language === 'en' ? item.label.en : item.label.gu}
              </Link>
            ))}
            
            {/* Mobile Language Switcher */}
            <button
              onClick={() => handleLanguageSwitch(language === 'en' ? 'gu' : 'en')}
              className="w-full text-left px-4 py-3 text-gray-700 hover:text-[#215b6f] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {t('switchLanguage', translations.switchToGujarati.en, translations.switchToGujarati.gu)}
            </button>

            {/* Mobile CTA */}
            <div className="px-4 pt-2">
              <Link
                href="/#contact-form"
                className="block w-full text-center bg-[#215b6f] hover:bg-[#1a4a5a] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('cta', translations.freeConsultation.en, translations.freeConsultation.gu)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}