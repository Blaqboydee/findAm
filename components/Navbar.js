'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import RegisterButton from './RegisterButton'
import { LogOut, LayoutDashboard, Briefcase, Menu, X, Search, UserPlus, Building2 } from 'lucide-react'

export default function Navbar() {
  const { data: session, status } = useSession()
  
  const [hasProvider, setHasProvider] = useState(null)
  const [checkingProvider, setCheckingProvider] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if logged-in user has a business
  useEffect(() => {
    async function checkProvider() {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/providers/by-user/${session.user.id}`)
          const data = await response.json()
          setHasProvider(data.success ? data.data : null)
        } catch (error) {
          console.error('Error checking provider:', error)
          setHasProvider(null)
        } finally {
          setCheckingProvider(false)
        }
      } else {
        setCheckingProvider(false)
      }
    }

    checkProvider()
  }, [session])

  // Close mobile menu when clicking outside
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset'
  }, [mobileMenuOpen])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/home' })
  }

  // Determine user state
  const isGuest = status === 'unauthenticated'
  const isLoading = status === 'loading' || (status === 'authenticated' && checkingProvider)
  const isProvider = session?.user?.role === 'provider'
  const hasBusinessProfile = hasProvider !== null

  // Smart CTA button logic
  const getCtaButton = () => {
    if (isGuest) {
      return {
        text: 'Get Started',
        href: '/onboarding',
        icon: UserPlus,
        variant: 'primary'
      }
    }
    
    if (isProvider && !hasBusinessProfile) {
      return {
        text: 'Register Business',
        href: '/register',
        icon: Building2,
        variant: 'secondary'
      }
    }
    
    // Provider with business OR regular user - no CTA button
    return null
  }

  const ctaButton = getCtaButton()

  return (
    <nav 
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg py-3' : 'shadow-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/home" 
            className="group flex items-center text-2xl font-bold transition-transform duration-300 hover:scale-105"
          >
            <div className="bg-primary text-white mr-2 w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-primary-dark transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-primary">Find</span>
            <span className="text-secondary">Am</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search Link - Always visible */}
            <Link 
              href="/search" 
              className="text-neutral-800 hover:text-primary font-medium transition-colors relative group"
            >
              Search
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Loading State */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-24 h-9 bg-neutral-200 animate-pulse rounded-lg"></div>
                <div className="w-9 h-9 bg-neutral-200 animate-pulse rounded-full"></div>
              </div>
            )}

            {/* Guest State */}
            {!isLoading && isGuest && (
              <>
                {/* <Link
                  href="/onboarding"
                  className="text-neutral-800 hover:text-primary font-medium transition-colors relative group"
                >
                  Sign In
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link> */}
                <RegisterButton  text="Sign In"/>
                {ctaButton && (
                  <Link 
                    href={ctaButton.href}
                    className="bg-secondary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
                  >
                    <ctaButton.icon className="w-4 h-4" />
                    {ctaButton.text}
                  </Link>
                )}
              </>
            )}

            {/* Authenticated State */}
            {!isLoading && !isGuest && (
              <>
                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="text-neutral-800 hover:text-primary font-medium transition-colors flex items-center gap-2 relative group"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* CTA Button (if applicable) */}
                {ctaButton && (
                  <Link 
                    href={ctaButton.href}
                    className="bg-secondary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
                  >
                    <ctaButton.icon className="w-4 h-4" />
                    {ctaButton.text}
                  </Link>
                )}
                
                {/* User Avatar Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className={`w-10 h-10 rounded-full ${
                      hasBusinessProfile ? 'bg-secondary' : 'bg-primary'
                    } text-white flex items-center justify-center font-bold text-lg shadow-md hover:shadow-lg transition-shadow`}>
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-neutral-200 py-2 z-50 animate-slideDown">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-neutral-200">
                          <p className="font-bold text-neutral-900 text-lg">{session.user.name}</p>
                          <p className="text-sm text-neutral-600 truncate">{session.user.email}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              isProvider 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {isProvider ? 'Provider' : 'User'}
                            </span>
                            {hasBusinessProfile && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                Business Active
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition text-neutral-800 font-medium"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          
                          {hasBusinessProfile && (
                            <Link
                              href={`/provider/${hasProvider._id}`}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition text-neutral-800 font-medium"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Briefcase className="w-4 h-4" />
                              My Business Profile
                            </Link>
                          )}

                          {isProvider && !hasBusinessProfile && (
                            <Link
                              href="/register"
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition text-secondary font-medium"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Building2 className="w-4 h-4" />
                              Register Business
                            </Link>
                          )}
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-neutral-200 mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-red-600 w-full text-left font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-800" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-800" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4 space-y-3 animate-slideDown">
            <Link 
              href="/search" 
              className="block text-neutral-800 hover:text-primary hover:bg-neutral-50 font-medium transition px-3 py-2.5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search
            </Link>

            {/* Guest Mobile */}
            {isGuest && (
              <>
                 <RegisterButton  text="Sign In" style="block text-neutral-800 hover:text-primary hover:bg-neutral-50 font-medium transition px-3 rounded-lg" />
                {ctaButton && (
                  <Link 
                    href={ctaButton.href}
                    className="flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-dark transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ctaButton.icon className="w-5 h-5" />
                    {ctaButton.text}
                  </Link>
                )}
              </>
            )}

            {/* Authenticated Mobile */}
            {!isGuest && !isLoading && (
              <>
                {/* User Info Card */}
                <div className="px-3 py-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="font-bold text-neutral-900">{session.user.name}</p>
                  <p className="text-sm text-neutral-600 truncate mb-2">{session.user.email}</p>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      isProvider 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isProvider ? 'Provider' : 'User'}
                    </span>
                    {hasBusinessProfile && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Business Active
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 text-neutral-800 hover:text-primary hover:bg-neutral-50 font-medium transition px-3 py-2.5 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>

                {hasBusinessProfile && (
                  <Link
                    href={`/provider/${hasProvider._id}`}
                    className="flex items-center gap-3 text-neutral-800 hover:text-primary hover:bg-neutral-50 font-medium transition px-3 py-2.5 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Briefcase className="w-5 h-5" />
                    My Business Profile
                  </Link>
                )}

                {ctaButton && (
                  <Link 
                    href={ctaButton.href}
                    className="flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-dark transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ctaButton.icon className="w-5 h-5" />
                    {ctaButton.text}
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-3 text-red-600 hover:bg-red-50 font-medium transition px-3 py-2.5 rounded-lg w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  )
}