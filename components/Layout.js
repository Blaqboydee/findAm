'use client';

import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-white shadow-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/" 
            className="group flex items-center  text-2xl font-bold transition-transform duration-300 hover:scale-105"
          >
            <div className="bg-blue-600 text-white mr-2 w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Search className="w-5 h-5" />
            </div>
<span className="text-blue-600">Find</span><span className="text-orange-500">Am</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="/search" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              Search
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="/register" 
              className="group bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
            >
              Register Business
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-3 py-4 border-t border-gray-200">
            <a 
              href="/search" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
            >
              Search
            </a>
            <a 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
            >
              About
            </a>
            <a 
              href="/register" 
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 text-center"
            >
              Register Business
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold mb-4">
              <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <span className="text-primary-light">Find</span><span className="text-secondary">Am</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Connecting Nigerians with trusted service providers across the country.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://twitter.com/blaqboydee" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/adegoke-adeoluwa-579119345" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:adeoluwaadegoke05@gmail.com"
                className="bg-gray-800 hover:bg-orange-500 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base md:text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {['Search Providers', 'Register Business', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-400 text-sm md:text-base hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link}
                  </a>
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
                  <a 
                    href={`/search?category=${category.toLowerCase()}`}
                    className="text-gray-400 text-sm md:text-base hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {category}
                  </a>
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
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors">
                <ArrowRight className="w-5 h-5" />
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
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// For layout.js usage - export the components separately
export { Navbar, Footer };
