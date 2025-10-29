'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, CheckCircle2, Scissors, Wrench, Zap, Palette, Hammer, Camera, Car, Home, Users, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Framer Motion-style animation hook
function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isInView];
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const [heroRef, heroInView] = useInView(0.1);
  const [stepsRef, stepsInView] = useInView(0.2);
  const [categoriesRef, categoriesInView] = useInView(0.2);
  const [ctaRef, ctaInView] = useInView(0.2);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { icon: Scissors, name: 'Tailors', color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600' },
    { icon: Wrench, name: 'Plumbers', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
    { icon: Zap, name: 'Electricians', color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
    { icon: Palette, name: 'Makeup Artists', color: 'bg-rose-500', hoverColor: 'hover:bg-rose-600' },
    { icon: Hammer, name: 'Carpenters', color: 'bg-amber-600', hoverColor: 'hover:bg-amber-700' },
    { icon: Camera, name: 'Photographers', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
    { icon: Car, name: 'Mechanics', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    { icon: Home, name: 'Cleaners', color: 'bg-cyan-500', hoverColor: 'hover:bg-cyan-600' },
  ];

  const steps = [
    { 
      icon: Search, 
      title: 'Search', 
      text: 'Enter the service you need and your location', 
      color: 'bg-primary'
    },
    { 
      icon: Users, 
      title: 'Compare', 
      text: 'View profiles, ratings, and work samples', 
      color: 'bg-secondary'
    },
    { 
      icon: CheckCircle2, 
      title: 'Connect', 
      text: 'Call or message providers directly', 
      color: 'bg-accent'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            style={{ 
              animation: 'blob 7s infinite',
              transform: heroInView ? 'scale(1)' : 'scale(0.8)',
              transition: 'transform 1s ease-out'
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            style={{ 
              animation: 'blob 7s infinite 2s',
              transform: heroInView ? 'scale(1)' : 'scale(0.8)',
              transition: 'transform 1s ease-out 0.2s'
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 w-72 h-72 md:w-96 md:h-96 bg-primary-dark rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            style={{ 
              animation: 'blob 7s infinite 4s',
              transform: heroInView ? 'scale(1)' : 'scale(0.8)',
              transition: 'transform 1s ease-out 0.4s'
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div 
            className="text-center max-w-4xl mx-auto"
            style={{
              transform: heroInView ? 'translateY(0)' : 'translateY(50px)',
              opacity: heroInView ? 1 : 0,
              transition: 'all 0.8s ease-out'
            }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              Find Trusted Service Providers{' '}
              <span className="text-secondary-light">Near You</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-10 text-neutral-100 max-w-3xl mx-auto leading-relaxed px-4">
              Stop asking in WhatsApp groups. Search tailors, plumbers, electricians, and more—all in one place.
            </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="w-full sm:w-auto group bg-secondary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-lg flex items-center justify-center gap-2">
                Search Providers
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
             className="w-full text-sm sm:w-auto group bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105  md:text-lg">
                List Your Business
            </Link>
          </div>

          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
        `}</style>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} className="py-4 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div 
            className="text-center mb-10 md:mb-16"
            style={{
              transform: stepsInView ? 'translateY(0)' : 'translateY(50px)',
              opacity: stepsInView ? 1 : 0,
              transition: 'all 0.8s ease-out'
            }}
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-2 md:mb-4">
              How It Works
            </h2>
            <p className="text-sm md:text-xl text-neutral-800 max-w-2xl mx-auto">
              Get connected with trusted professionals in three simple steps
            </p>
          </div>

          <div className="grid px-4 md:px-0 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.title}
                  className="group relative"
                  style={{
                    transform: stepsInView ? 'translateY(0)' : 'translateY(50px)',
                    opacity: stepsInView ? 1 : 0,
                    transition: `all 0.6s ease-out ${index * 0.2}s`
                  }}
                >
                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary-light">
                    <div className={`${step.color} w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-primary text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-lg shadow-lg">
                      {index + 1}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-neutral-900">{step.title}</h3>
                    <p className="text-sm md:text-base text-neutral-800 leading-relaxed">{step.text}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8  text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section ref={categoriesRef} className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div 
            className="text-center mb-10 md:mb-16"
            style={{
              transform: categoriesInView ? 'translateY(0)' : 'translateY(50px)',
              opacity: categoriesInView ? 1 : 0,
              transition: 'all 0.8s ease-out'
            }}
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-2 md:mb-4">
              Popular Categories
            </h2>
            <p className="text-sm md:text-xl text-neutral-800">
              Browse services by category
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/search?category=${encodeURIComponent(cat.name)}`}
                  className="group bg-white rounded-2xl p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-neutral-200 hover:border-primary-light"
                  style={{
                    transform: categoriesInView ? 'scale(1)' : 'scale(0.8)',
                    opacity: categoriesInView ? 1 : 0,
                    transition: `all 0.5s ease-out ${index * 0.05}s`
                  }}
                >
                  <div className={`${cat.color} ${cat.hoverColor} w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="text-sm text-center md:text-base font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                    {cat.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA for Providers */}
      <section ref={ctaRef} className="relative py-12 md:py-20 bg-gradient-to-r from-primary to-primary-dark text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        <div 
          className="relative container mx-auto px-4 text-center"
          style={{
            transform: ctaInView ? 'translateY(0)' : 'translateY(50px)',
            opacity: ctaInView ? 1 : 0,
            transition: 'all 0.8s ease-out'
          }}
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Are You a Service Provider?
          </h2>
          <p className="text-sm md:text-xl lg:text-2xl mb-6 md:mb-10 text-neutral-100 max-w-3xl mx-auto leading-relaxed px-4">
            Reach more customers. Showcase your work. Grow your business.
          </p>
          <Link 
         
              href="/register"
          className="w-full sm:w-auto group bg-secondary text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-lg inline-flex items-center justify-center gap-3">
            Register Your Business - It's Free!
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}