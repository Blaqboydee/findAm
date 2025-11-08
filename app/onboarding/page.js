'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight, Users, Briefcase, CheckCircle2, Sparkles } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function OnboardingPage() {
  const [step, setStep] = useState(0); // 0=logo animation, 1=welcome, 2=intro, 3=auth
  const [userType, setUserType] = useState(null); // 'user' or 'provider'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(0); // 0 = user, 1 = provider
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);


    const cards = [
    {
      type: 'user',
      icon: Users,
      title: 'I need a service',
      description: 'Find trusted providers near you',
      gradient: 'from-primary to-primary-dark'
    },
    {
      type: 'provider',
      icon: Briefcase,
      title: 'I offer a service',
      description: 'Grow your business today',
      gradient: 'from-secondary to-secondary-dark'
    }
  ];

  // Logo animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
    }, 3000); // Logo animation duration
    return () => clearTimeout(timer);
  }, []);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };

  const handleContinueToAuth = () => {
    setStep(3);
  };

  const handleSkipAuth = () => {
    // For users who want to browse without account
    window.location.href = '/home';
  };

    const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && activeCard === 0) {
      setActiveCard(1);
    }
    if (isRightSwipe && activeCard === 1) {
      setActiveCard(0);
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...authForm, role: userType }),
      });

      const data = await res.json();

      if (data.success) {
        // Auto sign in after registration
        const signInRes = await signIn('credentials', {
          redirect: false,
          email: authForm.email,
          password: authForm.password,
        });

        if (!signInRes?.error) {
          // Redirect based on user type
          if (userType === 'provider') {
            window.location.href = '/register'; // Provider profile setup
          } else {
            window.location.href = '/home'; // User browsing
          }
        }
      } else {
        alert(data.message || 'Registration failed');
        setLoading(false);

    // console.log(data);
    
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    await signIn('google', { 
      callbackUrl: userType === 'provider' ? '/register' : '/search' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-secondary flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-light rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Step 0: Logo Animation - REDESIGNED */}
      {step === 0 && (
       <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl animate-fadeIn">
  {/* Logo and Text side-by-side */}
  <div className="flex items-center justify-center">
    <div className="bg-white rounded-xl p-3 md:p-4 shadow-2xl animate-bounceIn z-10">
      <Search className="w-8 h-8 md:w-24 md:h-24 text-primary" />
    </div>
    
    <div 
      className="flex items-center animate-slideInRight ml-1 md:ml-6"
      style={{ animationDelay: '0.8s' }}
    >
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold whitespace-nowrap">
        <span className="text-white">Find</span>
        <span className="text-secondary-light">Am</span>
      </h1>
    </div>
  </div>

  {/* Tagline — now naturally flows below */}
  <div 
    className="mt-2 md:mt-4 animate-fadeInUp"
    style={{ animationDelay: '1.5s' }}
  >
    <p className="text-white text-center text-[12px] md:text-xl font-medium opacity-90">
      Your Trusted Service Connection
    </p>
  </div>
</div>

      )}




      {/* Step 1: Welcome Screen */}

      {step === 1 && (
    <div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-light rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-2xl w-full animate-fadeInUp">
        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-12 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-3 md:mb-6">
            <div className="bg-primary rounded-lg p-2 mr-1 md:mr-2 shadow-lg">
              <Search className="w-6 h-6 md:w-9 md:h-9 text-white" />
            </div>
            <span className="text-2xl md:text-3xl font-bold">
              <span className="text-primary">Find</span>
              <span className="text-secondary">Am</span>
            </span>
          </div>

          {/* Tagline */}
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 md:mb-4">
            Welcome to FindAm
          </h1>
          <p className="text-sm md:text-lg text-neutral-600 mb-4 md:mb-10 max-w-xl mx-auto leading-relaxed">
            Connect with trusted service providers near you, or grow your business by joining our platform.
          </p>

          {/* Desktop: Side by side */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.type}
                  onClick={() => handleUserTypeSelect(card.type)}
                  className={`group relative bg-gradient-to-br ${card.gradient} text-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                  <Icon className="w-14 h-14 mx-auto mb-4 group-hover:scale-110 transition-transform relative z-10" />
                  <h3 className="text-xl font-bold mb-2 relative z-10">{card.title}</h3>
                  <p className="text-neutral-100 text-sm relative z-10">{card.description}</p>
                  <ArrowRight className="w-6 h-6 mx-auto mt-4 group-hover:translate-x-2 transition-transform relative z-10" />
                </button>
              );
            })}
          </div>

          {/* Mobile: Swipeable Cards */}
          <div className="md:hidden">
            {/* Swipe Instruction */}
            <p className="text-xs text-neutral-500 mb-4 font-bold">
              👈 Swipe to see options 👉
            </p>

            {/* Card Container */}
            <div 
              className="relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${activeCard * 100}%)` }}
              >
                {cards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.type}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <button
                        onClick={() => handleUserTypeSelect(card.type)}
                        className={`group relative bg-gradient-to-br ${card.gradient} text-white rounded-2xl p-8 w-full shadow-xl overflow-hidden active:scale-95 transition-transform`}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <Icon className="w-12 h-12 mx-auto mb-4 relative z-10" />
                        <h3 className="text-lg font-bold mb-0 relative z-10">{card.title}</h3>
                        <p className="text-neutral-100 text-xs relative z-10">{card.description}</p>
                        <ArrowRight className="w-6 h-6 mx-auto mt-4 relative z-10" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCard(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeCard 
                      ? 'w-8 h-3 bg-primary' 
                      : 'w-3 h-3 bg-neutral-300'
                  }`}
                  aria-label={`Go to ${card.title}`}
                />
              ))}
            </div>

            {/* Card Labels */}
            <div className="flex justify-center gap-8 mt-4">
              <button
                onClick={() => setActiveCard(0)}
                className={`text-sm font-medium transition-colors ${
                  activeCard === 0 ? 'text-primary' : 'text-neutral-400'
                }`}
              >
                Find Service
              </button>
              <button
                onClick={() => setActiveCard(1)}
                className={`text-sm font-medium transition-colors ${
                  activeCard === 1 ? 'text-secondary' : 'text-neutral-400'
                }`}
              >
                Offer Service
              </button>
            </div>
          </div>

          {/* Skip to browse link */}
          <button
            onClick={handleSkipAuth}
            className="mt-8 text-neutral-600 hover:text-primary transition-colors font-medium text-sm md:text-base"
          >
            Or browse without signing up →
          </button>
        </div>
      </div>
    </div>
  )}


      
      {/* Step 2: Account Type Intro */}
      {step === 2 && userType && (
        <div className="relative z-10 max-w-2xl w-full animate-fadeInUp">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ${
              userType === 'user' ? 'bg-gradient-to-br from-primary to-primary-dark' : 'bg-gradient-to-br from-secondary to-secondary-dark'
            }`}>
              {userType === 'user' ? (
                <Users className="w-8 h-8 text-white" />
              ) : (
                <Briefcase className="w-8 h-8 text-white" />
              )}
            </div>

            {/* Message based on user type */}
            {userType === 'user' ? (
              <>
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-neutral-900 mb-4 text-center">
                  Great! Let's find your perfect service provider
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4 p-4 md:p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-neutral-700 text-sm md:text-base">Search and filter providers by location and service type</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 md:p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-neutral-700 text-sm md:text-base">Save your favorite providers for quick access later</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 md:p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-neutral-700 text-sm md:text-base">View ratings, reviews, and work samples before contacting</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-neutral-900 mb-4 text-center">
                  Awesome! Let's grow your business together
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4 p-4 md:p-5 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <p className="text-neutral-700 text-sm md:text-base">Create a professional profile with photos of your work</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 md:p-5 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <p className="text-neutral-700 text-sm md:text-base">Get discovered by customers actively searching for your services</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 md:p-5 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <p className="text-neutral-700 text-sm md:text-base">Build trust with verified badges and customer reviews</p>
                  </div>
                </div>
              </>
            )}

            {/* Continue Button */}
            <div className="text-center space-y-4">
              <p className="text-base md:text-lg text-neutral-700 font-semibold">
                Ready to get started?
              </p>
              <button
                onClick={handleContinueToAuth}
                className={`w-full md:w-auto md:px-10 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto text-sm md:text-base ${
                  userType === 'user' ? 'bg-gradient-to-r from-primary to-primary-dark' : 'bg-gradient-to-r from-secondary to-secondary-dark'
                }`}
              >
                Create Your Account
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Back button */}
              <button
                onClick={() => setStep(1)}
                className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm md:text-base"
              >
                ← Go back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Auth Form */}
      {step === 3 && userType && (
        <div className="relative z-10 max-w-md w-full animate-fadeInUp">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              {/* <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
                userType === 'user' ? 'bg-gradient-to-br from-primary to-primary-dark' : 'bg-gradient-to-br from-secondary to-secondary-dark'
              }`}>
                <Sparkles className="w-8 h-8 text-white" />
              </div> */}
            
              {/* Logo */}
          <div className="flex items-center justify-center mb-3 md:mb-6">
            <div className="bg-primary rounded-lg p-2 mr-1 md:mr-1 shadow-lg">
              <Search className="w-6 h-6 md:w-9 md:h-9 text-white" />
            </div>
            <span className="text-2xl md:text-3xl font-bold">
              <span className="text-primary">Find</span>
              <span className="text-secondary">Am</span>
            </span>
          </div>
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">
                Create Your Account
              </h2>
              <p className="text-neutral-600 text-sm md:text-base">
                {userType === 'user' ? 'Start finding the best providers' : 'Start growing your business'}
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white text-base"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white text-base"
              />
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white text-base"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base ${
                  userType === 'user' ? 'bg-gradient-to-r from-primary to-primary-dark' : 'bg-gradient-to-r from-secondary to-secondary-dark'
                }`}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-600 font-medium">Or continue with</span>
              </div>
            </div>

            {/* <button
             disabled
              onClick={handleGoogleSignup}
              className="w-full py-3 border-2 border-neutral-200 rounded-xl font-semibold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button> */}

            {userType === 'user' && (
              <button
                onClick={handleSkipAuth}
                className="w-full mt-6 text-neutral-600 hover:text-primary transition-colors text-sm font-medium"
              >
                Skip for now, browse as guest →
              </button>
            )}

            {/* Back button */}
            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 text-neutral-500 hover:text-neutral-700 transition-colors text-sm"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes bounceIn {
          0% { 
            opacity: 0; 
            transform: scale(0.3) rotate(-10deg); 
          }
          50% { 
            transform: scale(1.05) rotate(2deg); 
          }
          70% { 
            transform: scale(0.95) rotate(-1deg); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
          }
        }
        @keyframes slideInRight {
          0% { 
            opacity: 0; 
            transform: translateX(100px); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-bounceIn {
          animation: bounceIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          animation-fill-mode: both;
        }
        .animate-slideInRight {
          animation: slideInRight 1s ease-out;
          animation-fill-mode: both;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}