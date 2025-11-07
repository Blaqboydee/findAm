'use client'

import { useSession } from 'next-auth/react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle, X, User, Briefcase, TrendingUp, Eye, Phone, MapPin, Star } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showError, setShowError] = useState(errorParam === 'provider-only')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard')
    }
  }, [status, router])

  // Fetch provider data if user is a provider
  useEffect(() => {
    async function fetchProvider() {
      if (status === 'authenticated' && session?.user?.id && session?.user?.role === 'provider') {
        try {
          console.log('Fetching provider for user:', session.user.id)
          
          const response = await fetch(`/api/providers/by-user/${session.user.id}`)
          const data = await response.json()
          
          console.log('Provider fetch response:', data)
          
          if (data.success) {
            setProvider(data.data)
          } else {
            console.log('No provider found for user')
            setProvider(null)
          }
        } catch (error) {
          console.error('Error fetching provider:', error)
          setError('Failed to load business information')
        } finally {
          setLoading(false)
        }
      } else if (status === 'authenticated') {
        // Regular user - no need to fetch provider
        setLoading(false)
      }
    }

    fetchProvider()
  }, [status, session])

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading while fetching provider
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error if any
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Determine which dashboard to show
  const userRole = session?.user?.role
  const isProvider = userRole === 'provider'
  const hasRegisteredBusiness = provider !== null

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Error Message for Regular Users Trying to Register */}
        {showError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Provider Account Required
                </h3>
                <p className="text-red-700 text-sm mb-3">
                  Your account was created as a customer account. To register a business, 
                  you'll need to create a separate provider account.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/onboarding"
                    className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Create Provider Account
                  </Link>
                  <Link
                    href="/search"
                    className="text-sm bg-white text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 transition font-medium"
                  >
                    Browse Providers Instead
                  </Link>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {/* <div className={`w-16 h-12 rounded-full  flex items-center justify-center ${
              isProvider ? 'bg-secondary' : 'bg-primary'
            }`}>
              {isProvider ? (
                <Briefcase className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div> */}
            <div>
              <h1 className="text-lg md:text-4xl font-bold text-neutral-900">
                Welcome back, {session?.user?.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-sm text-neutral-600">
                {isProvider 
                  ? hasRegisteredBusiness 
                    ? 'Manage your business and track performance' 
                    : 'Complete your business registration to start getting customers'
                  : 'Discover and connect with trusted service providers'
                }
              </p>
            </div>
          </div>
        </div>

        {/* PROVIDER DASHBOARD */}
        {isProvider && (
          <>
            {hasRegisteredBusiness ? (
              // Provider WITH Business
              <div className="space-y-6">
                {/* Business Overview Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900 mb-1">
                        {provider.name}
                      </h2>
                      <p className="text-neutral-600 text-sm md:text-base">{provider.serviceType} • {provider.location}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-5 h-5 text-primary" />
                        <p className="text-sm text-neutral-600">Profile Views</p>
                      </div>
                      <p className="text-2xl font-bold text-neutral-900">0</p>
                      <p className="text-xs text-neutral-500">This month</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-secondary" />
                        <p className="text-sm text-neutral-600">Calls</p>
                      </div>
                      <p className="text-2xl font-bold text-neutral-900">0</p>
                      <p className="text-xs text-neutral-500">This month</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <p className="text-sm text-neutral-600">Rating</p>
                      </div>
                      <p className="text-2xl font-bold text-neutral-900">
                        {provider.rating?.average?.toFixed(1) || '0.0'}
                      </p>
                      <p className="text-xs text-neutral-500">{provider.rating?.count || 0} reviews</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <p className="text-sm text-neutral-600">Rank</p>
                      </div>
                      <p className="text-2xl font-bold text-neutral-900">#-</p>
                      <p className="text-xs text-neutral-500">In your area</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/provider/${provider._id}`}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition text-center"
                    >
                      View Public Profile
                    </Link>
                    {/* <Link
            
                      href={`/dashboard/edit-business`}
                      className="flex-1 bg-neutral-100 text-neutral-900 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition text-center"
                    >
                      Edit Business
                    </Link> */}
                  </div>
                </div>

                {/* Tips for Growth */}
                <div className="bg-gradient-to-br from-secondary to-secondary-dark text-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-4">💡 Tips to Grow Your Business</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-accent-light text-xl">✓</span>
                      <div>
                        <p className="font-semibold">Add more photos of your work</p>
                        <p className="text-sm text-neutral-100">Profiles with work samples get 3x more calls</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-neutral-400 text-xl">○</span>
                      <div>
                        <p className="font-semibold">Get your first review</p>
                        <p className="text-sm text-neutral-100">Ask satisfied customers to leave reviews</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-neutral-400 text-xl">○</span>
                      <div>
                        <p className="font-semibold">Complete verification</p>
                        <p className="text-sm text-neutral-100">Verified profiles are trusted 5x more</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              // Provider WITHOUT Business
              <div className="bg-gradient-to-br from-secondary to-secondary-dark text-white rounded-lg shadow-md p-8 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-lg md:text-xl font-bold mb-4">
                  Complete Your Business Registration
                </h2>
                <p className="text-neutral-100 mb-6 max-w-xl mx-auto text-sm md:text-base">
                  You're one step away from reaching thousands of potential customers. 
                  Set up your business profile now!
                </p>
                <ul className="space-y-3 mb-8 max-w-md mx-auto text-left">
                  <li className="flex items-center gap-3">
                    <span className="text-accent-light text-sm md:text-base">✓</span>
                    <span className='text-sm md:text-base'>Create a professional profile</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-accent-light text-sm md:text-base">✓</span>
                    <span className='text-sm md:text-base'>Upload photos of your work</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-accent-light text-sm md:text-base">✓</span>
                    <span className='text-sm md:text-base'>Start getting customer calls today</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="inline-block bg-white text-sm md:text-base text-secondary px-8 py-4 rounded-lg font-bold hover:bg-neutral-100 transition shadow-lg text-lg"
                >
                  Register Your Business Now
                </Link>
              </div>
            )}
          </>
        )}

        {/* REGULAR USER DASHBOARD */}
        {!isProvider && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {/* User Activity Card */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">
                  Your Activity
                </h2>
                <div className="space-y-4">
                  <Link
                    href="/dashboard/favorites"
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-neutral-900">Favorites</p>
                      <p className="text-sm text-neutral-600">Saved providers</p>
                    </div>
                    <span className="text-3xl font-bold text-primary">0</span>
                  </Link>
                  
                  <Link
                    href="/dashboard/reviews"
                    className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-neutral-900">Reviews</p>
                      <p className="text-sm text-neutral-600">Written by you</p>
                    </div>
                    <span className="text-3xl font-bold text-secondary">0</span>
                  </Link>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-neutral-900">Recent Searches</p>
                      <p className="text-sm text-neutral-600">Your history</p>
                    </div>
                    <span className="text-3xl font-bold text-accent">0</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-6 text-center">
                  These features are coming soon! 🚀
                </p>
              </div>

              {/* Recommendations Card */}
              <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">
                   Popular in Your Area
                </h2>
                <p className="text-neutral-100 mb-6 text-sm md:text-base">
                  Discover top-rated service providers near you
                </p>
                <p className="text-neutral-100 mb-6 text-sm md:text-base">
                  Note that these are sample categories for demonstration purposes. Real data will be displayed once providers register their businesses on the platform.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <p className="font-semibold">Tailors</p>
                    <p className="text-sm text-neutral-200">23 providers near you</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <p className="font-semibold">Plumbers</p>
                    <p className="text-sm text-neutral-200">18 providers near you</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <p className="font-semibold">Electricians</p>
                    <p className="text-sm text-neutral-200">31 providers near you</p>
                  </div>
                </div>
                <Link
                  href="/search"
                  className="block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition text-center"
                >
                  Explore All Services
                </Link>
              </div>
            </div>

            {/* Want to Become a Provider CTA */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-secondary/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-secondary" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    Are You a Service Provider?
                  </h3>
                  <p className="text-neutral-600 text-sm md:text-base">
                    Create a separate provider account to register your business and reach thousands of customers.
                  </p>
                </div>
                <Link
                  href="/onboarding"
                  className="flex-shrink-0 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-dark transition whitespace-nowrap"
                >
                  Create Provider Account
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Quick Actions - Both User Types */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/search"
              className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition text-center group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔍</span>
              <span className="font-semibold text-neutral-900">Search</span>
            </Link>
            
            {isProvider && !hasRegisteredBusiness && (
              <Link
                href="/register"
                className="flex flex-col items-center justify-center p-6 bg-secondary/5 border-2 border-secondary/20 rounded-lg hover:bg-secondary/10 transition text-center group"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💼</span>
                <span className="font-semibold text-secondary">Register Business</span>
              </Link>
            )}
            
            <button
              disabled
              className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-lg opacity-50 cursor-not-allowed text-center"
            >
              <span className="text-3xl mb-2">⭐</span>
              <span className="font-semibold text-neutral-900">Favorites</span>
              <span className="text-xs text-neutral-500 mt-1">Coming soon</span>
            </button>
            
            <button
              disabled
              className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-lg opacity-50 cursor-not-allowed text-center"
            >
              <span className="text-3xl mb-2">📝</span>
              <span className="font-semibold text-neutral-900">Reviews</span>
              <span className="text-xs text-neutral-500 mt-1">Coming soon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}