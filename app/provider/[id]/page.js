'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, MapPin, Phone, Mail, MessageCircle, Shield, CheckCircle, Calendar, Wrench, Scissors, Zap, Palette, Hammer, Camera, Car, Home, Paintbrush, Wind, ChefHat, Settings, Snowflake, PartyPopper } from 'lucide-react'

// Icon mapping for services
const serviceIcons = {
  'Tailor': Scissors,
  'Plumber': Wrench,
  'Electrician': Zap,
  'Makeup Artist': Palette,
  'Carpenter': Hammer,
  'Photographer': Camera,
  'Mechanic': Car,
  'Cleaner': Home,
  'Painter': Paintbrush,
  'Hairdresser': Palette,
  'Chef/Catering': ChefHat,
  'Generator Repairer': Settings,
  'AC Technician': Snowflake,
  'Event Planner': PartyPopper,
}

// Simple animation hook that triggers on mount
function useAnimateOnMount(delay = 0) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return isVisible
}

export default function ProviderProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Animate sections with staggered delays
  const contentVisible = useAnimateOnMount(100)
  const ctaVisible = useAnimateOnMount(300)

  useEffect(() => {
    if (params.id) {
      console.log(params)
      fetchProvider()
    }
  }, [params.id])

  const fetchProvider = async () => {
    try {
      const response = await fetch(`/api/providers/${params.id}`)
      
      const data = await response.json()

      console.log(data);
      

      if (data.success) {
        setProvider(data.data)
      } else {
        setError(data.error || 'Provider not found')
      }
    } catch (err) {
      console.error('Error fetching provider:', err)
      setError('Failed to load provider')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-primary-light rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-neutral-600 mt-6 text-lg">Loading provider...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !provider) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-neutral-400" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-3">Provider Not Found</h2>
          <p className="text-neutral-600 mb-8 text-lg">
            {error || "The provider you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/search"
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const ServiceIcon = serviceIcons[provider.serviceType] || Wrench

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="mb-8 flex items-center gap-2 text-white hover:text-secondary transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Search</span>
            </button>

            {/* Provider Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
              {/* Provider Icon */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
                  <ServiceIcon className="w-15 h-15 md:w-24 md:h-24 text-primary" />
                </div>
                {provider.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-2 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Provider Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-xl md:text-4xl font-bold mb-3">
                  {provider.name}
                </h1>
                <p className="text-sm md:text-xl text-neutral-100 mb-6 font-medium">
                  {provider.serviceType}
                </p>
                <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-sm">
                      {provider.rating?.average?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-sm text-neutral-200">
                      ({provider.rating?.count || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm font-medium">{provider.location}</span>
                  </div>
                  {/* {provider.verified && (
                    <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-full shadow-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold text-sm">Verified</span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="md:col-span-2 space-y-6">
                {/* About Section */}
                <div 
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-transparent hover:border-primary-light transition-all duration-300"
                  style={{
                    transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                    opacity: contentVisible ? 1 : 0,
                    transition: 'all 0.6s ease-out'
                  }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-light/20 rounded-xl flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>
                    About
                  </h2>
                  <p className="text-neutral-700 leading-relaxed text-sm">
                    {provider.description || 'No description available for this provider.'}
                  </p>
                </div>

                {/* Services/Details Section */}
                <div 
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-transparent hover:border-primary-light transition-all duration-300"
                  style={{
                    transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                    opacity: contentVisible ? 1 : 0,
                    transition: 'all 0.6s ease-out 0.1s'
                  }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
                    Service Details
                  </h2>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                      <div className="w-12 h-12 bg-primary-light/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-1">Service Type</h3>
                        <p className="text-neutral-600 text-sm">{provider.serviceType}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                      <div className="w-12 h-12 bg-primary-light/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-1">Location</h3>
                        <p className="text-neutral-600 text-sm">{provider.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                      <div className="w-12 h-12 bg-primary-light/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-1">Member Since</h3>
                        <p className="text-neutral-600 text-sm">
                          {new Date(provider.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Section (Placeholder) */}
                <div 
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-transparent hover:border-primary-light transition-all duration-300"
                  style={{
                    transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                    opacity: contentVisible ? 1 : 0,
                    transition: 'all 0.6s ease-out 0.2s'
                  }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    Customer Reviews
                  </h2>
                  {provider.rating?.count > 0 ? (
                    <div className="text-center py-12 bg-neutral-50 rounded-xl">
                      <Star className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600 text-lg">Reviews coming soon!</p>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 rounded-xl">
                      <Star className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600 text-sm md:text-base px-4">No reviews yet. Be the first to leave a review!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar - Contact Card */}
              <div className="md:col-span-1">
                <div 
                  className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-24"
                  style={{
                    transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                    opacity: contentVisible ? 1 : 0,
                    transition: 'all 0.6s ease-out 0.3s'
                  }}
                >
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <p className="text-sm text-neutral-600 mb-1 font-medium">Phone Number</p>
                      <p className="font-bold text-neutral-900 text-sm md:text-base">{provider.phone}</p>
                    </div>
                    
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <p className="text-sm text-neutral-600 mb-1 font-medium">Email</p>
                      <p className="font-bold text-neutral-900 break-all text-sm md:text-base">{provider.email}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <a 
                      href={`tel:${provider.phone}`}
                      className="flex items-center text-sm justify-center gap-2 w-full bg-secondary text-white px-6 py-4 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                    
                    <a 
                      href={`mailto:${provider.email}`}
                      className="flex items-center text-sm  justify-center gap-2 w-full bg-neutral-100 text-primary px-6 py-4 rounded-xl font-semibold hover:bg-neutral-200 transition-all duration-300 hover:scale-105"
                    >
                      <Mail className="w-5 h-5" />
                      Send Email
                    </a>

                    <a 
                      href={`https://wa.me/${provider.phone.replace(/^0/, '234')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm   justify-center gap-2 w-full bg-accent text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        Your contact information is never shared with providers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-16 md:py-20 bg-primary text-white overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-light rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div 
          className="relative container mx-auto px-4 text-center"
          style={{
            transform: ctaVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: ctaVisible ? 1 : 0,
            transition: 'all 0.8s ease-out'
          }}
        >
          <h2 className="text-xl md:text-3xl font-bold mb-4">
            Looking for other services?
          </h2>
          <p className="text-sm md:text-xl text-neutral-100 mb-8 max-w-2xl mx-auto">
            Browse thousands of verified service providers across Nigeria
          </p>
          <Link
            href="/search"
            className="inline-block bg-secondary text-white px-10 py-3 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-lg"
          >
            Back to Search
          </Link>
        </div>
      </section>
    </div>
  )
}