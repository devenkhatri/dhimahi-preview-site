'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Persona } from '@/lib/content';
import { type GeneralSettings } from '@/lib/settings';

interface HeaderProps {
  transparent?: boolean;
  sticky?: boolean;
  personas?: Persona[];
  settings?: GeneralSettings;
}

export default function Header({ transparent = false, sticky = true, personas = [], settings }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isPersonasDropdownOpen, setIsPersonasDropdownOpen] = useState(false);
  const [isMobilePersonasOpen, setIsMobilePersonasOpen] = useState(false);
  const pathname = usePathname();

  // Use provided settings or fallback to default values
  const companyName = settings?.brand?.companyName || 'Dhīmahi Technolabs';
  const tagline = settings?.brand?.tagline || 'Future-Ready IT Solutions';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('#mobile-menu') && !target.closest('#mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
      if (isPersonasDropdownOpen && !target.closest('#personas-dropdown') && !target.closest('#personas-menu-item')) {
        setIsPersonasDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen, isPersonasDropdownOpen]);

  // Close mobile menu and dropdowns on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
        setIsPersonasDropdownOpen(false);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to main search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navigationItems = [
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/insights', label: 'Insights' },
    { href: '/resources', label: 'Resources' },
    { href: '/about', label: 'About' },
  ];

  const isPersonasActive = pathname?.startsWith('/personas');

  const togglePersonasDropdown = () => {
    setIsPersonasDropdownOpen(!isPersonasDropdownOpen);
  };

  const toggleMobilePersonas = () => {
    setIsMobilePersonasOpen(!isMobilePersonasOpen);
  };

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
                alt={`${companyName} Logo`}
                className="w-10 h-10 lg:w-12 lg:h-12 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg lg:text-xl text-gray-900 leading-tight">
                {companyName}
              </span>
              <span className="text-xs text-gray-600 leading-tight hidden sm:block">
                {tagline}
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
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#215b6f] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Personas Dropdown */}
            <div className="relative" id="personas-menu-item">
              <button
                onClick={togglePersonasDropdown}
                className={`flex items-center gap-1 font-medium transition-colors duration-200 relative group ${isPersonasActive ? 'text-[#215b6f]' : 'text-gray-700 hover:text-[#215b6f]'
                  }`}
                aria-expanded={isPersonasDropdownOpen}
                aria-haspopup="true"
              >
                Personas
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isPersonasDropdownOpen ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#215b6f] transition-all duration-300 ${isPersonasActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </button>

              {/* Dropdown Menu - Megamenu */}
              {mounted && isPersonasDropdownOpen && (
                <div
                  id="personas-dropdown"
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-[90vw] max-w-[800px] bg-white rounded-xl shadow-xl border border-gray-100/50 p-6 z-50 animate-fade-in ring-1 ring-gray-900/5"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Select Your Persona</h3>
                    <Link
                      href="/personas"
                      className="text-xs font-semibold text-[#215b6f] hover:text-[#1a4a5a] flex items-center gap-1 group/link"
                      onClick={() => setIsPersonasDropdownOpen(false)}
                    >
                      View All Personas
                      <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {personas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {personas.map((persona) => (
                        <Link
                          key={persona.slug}
                          href={`/personas/${persona.slug}`}
                          className="flex flex-col gap-2 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group/card border border-transparent hover:border-gray-100"
                          onClick={() => setIsPersonasDropdownOpen(false)}
                        >
                          <div className="flex items-start gap-3">
                            {persona.icon && (
                              <div className="bg-gray-50 group-hover/card:bg-white p-2 rounded-lg transition-colors border border-gray-100">
                                <img
                                  src={persona.icon}
                                  alt=""
                                  className="w-6 h-6 object-contain"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 group-hover/card:text-[#215b6f] transition-colors mb-0.5 text-sm">
                                {persona.title}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {persona.excerpt}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      No personas available at the moment.
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 px-6 py-3 flex items-center justify-between rounded-b-xl">
                    <span className="text-xs text-gray-500">Not sure which one fits you?</span>
                    <Link href="/consultation" className="text-xs font-semibold text-[#215b6f] hover:underline">
                      Get a generic consultation &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-[#215b6f] transition-colors duration-200"
              aria-label="Search"
              style={{ display: mounted ? 'block' : 'none' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* CTA Button */}
            <Link
              href="/consultation"
              className="bg-[#215b6f] hover:bg-[#1a4a5a] text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Free Consultation
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-[#215b6f] transition-colors duration-200"
              aria-label="Search"
              style={{ display: mounted ? 'block' : 'none' }}
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
              style={{ display: mounted ? 'block' : 'none' }}
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
        {mounted && isSearchOpen && (
          <div className="border-t border-gray-200 py-4 animate-fade-in">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, insights, personas, or solutions..."
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
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out ${mounted && isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
        >
          <div className="py-4 space-y-1 overflow-y-auto max-h-[calc(80vh-2rem)]">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-gray-700 hover:text-[#215b6f] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Personas Section */}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <Link
                  href="/personas"
                  className={`flex-1 block px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isPersonasActive
                    ? 'text-[#215b6f] bg-[#215b6f]/5'
                    : 'text-gray-700 hover:text-[#215b6f] hover:bg-gray-50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Personas
                </Link>

                {/* Toggle button for personas submenu */}
                {personas.length > 0 && (
                  <button
                    onClick={toggleMobilePersonas}
                    className="p-2 text-gray-500 hover:text-[#215b6f] transition-colors duration-200"
                    aria-label="Toggle personas submenu"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isMobilePersonasOpen ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Mobile Personas Submenu */}
              {personas.length > 0 && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobilePersonasOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <div className="px-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {personas.map((persona) => (
                        <Link
                          key={persona.slug}
                          href={`/personas/${persona.slug}`}
                          className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100 active:scale-98 transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {persona.icon && (
                            <img
                              src={persona.icon}
                              alt=""
                              className="w-8 h-8 object-contain p-1 bg-white rounded-md shadow-sm"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">{persona.title}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{persona.excerpt}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/personas"
                      className="block mt-4 text-center text-sm font-medium text-[#215b6f] py-2 border border-[#215b6f]/20 rounded-lg hover:bg-[#215b6f]/5 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      View All Personas
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile CTA */}
            <div className="px-4 pt-2">
              <Link
                href="/consultation"
                className="block w-full text-center bg-[#215b6f] hover:bg-[#1a4a5a] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}