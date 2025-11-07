'use client';

import React from 'react';
import { Search, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { useSession } from "next-auth/react";
import Link from 'next/link';

function Footer() {
  const { data: session } = useSession();
  
  // Determine user state
  const isProvider = session?.user?.role === 'provider';
  const isAuthenticated = !!session;

  // Dynamic Quick Links based on user role
  const getQuickLinks = () => {
    if (!isAuthenticated) {
      // Guest users - show all links
      return [
        { label: 'Search Providers', href: '/search' },
        { label: 'Register Business', href: '/onboarding' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ];
    } else if (isProvider) {
      // Provider users - show all links
      return [
        { label: 'Search Providers', href: '/search' },
        { label: 'My Dashboard', href: '/dashboard' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ];
    } else {
      // Regular users - only search
      return [
        { label: 'Search Providers', href: '/search' },
        { label: 'My Dashboard', href: '/dashboard' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ];
    }
  };

  const quickLinks = getQuickLinks();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-4 hover:opacity-80 transition-opacity">
              <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-primary-light">Find</span>
                <span className="text-secondary">Am</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Connecting Nigerians with trusted service providers across the country.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://twitter.com/blaqboydee" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/adegoke-adeoluwa-579119345" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:adeoluwaadegoke05@gmail.com"
                className="bg-gray-800 hover:bg-orange-500 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - Dynamic based on user role */}
          <div>
            <h3 className="font-bold text-base md:text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 text-sm md:text-base hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-base md:text-lg mb-4">Popular Categories</h3>
            <ul className="space-y-3">
              {['Tailors', 'Plumbers', 'Electricians', 'Carpenters'].map((category) => (
                <li key={category}>
                  <Link 
                    href={`/search?category=${category}`}
                    className="text-gray-400 text-sm md:text-base hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold md:text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Get the latest updates on new providers and features.
            </p>
            <div className="flex flex-wrap gap-2 md:flex-col lg:flex-row">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-white"
              />
              <button 
                className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 px-3 py-2 rounded-lg transition-colors min-w-[40px]"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; 2025 FindAm. All rights reserved.
          
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
