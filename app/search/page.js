'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, MapPin, Filter, Star, Phone, Eye, Scissors, Wrench, Zap, Palette, Hammer, Camera, Car, Home, Paintbrush, Wind, ChefHat, Settings, Snowflake, PartyPopper } from 'lucide-react'

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

// Intersection Observer hook for animations
function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return [ref, isInView]
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  const [resultsRef, resultsInView] = useInView(0.1)
  const [ctaRef, ctaInView] = useInView(0.2)

  const nigerianCities = ['Lagos', 'Ibadan', 'Abuja', 'Port Harcourt', 'Kano', 'Enugu']
  const serviceCategories = ['Tailor', 'Plumber', 'Electrician', 'Makeup Artist', 'Carpenter', 'Photographer', 'Mechanic', 'Cleaner']

  // Fetch providers from API
  useEffect(() => {
    fetchProviders()
  }, [searchTerm, location, category])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      // Build query params
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (location) params.append('location', location)
      if (category) params.append('category', category)

      const response = await fetch(`/api/providers?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setProviders(data.data)
      } else {
        console.error('Failed to fetch providers:', data.error)
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Search Header */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-light rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-5xl font-bold mb-3">
              Find Service Providers
            </h1>
            <p className="text-sm md:text-lg text-neutral-100">
              Search by service, location, or category
            </p>
          </div>
          
          {/* Search Form */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-500 hover:shadow-3xl">
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {/* Search Input */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">
                    Service or Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="e.g., Tailor, Plumber..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full  pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Location Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none z-10" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="">All Locations</option>
                      {nigerianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none z-10" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {serviceCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section ref={resultsRef} className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div 
            className="mb-8"
            style={{
              transform: resultsInView ? 'translateY(0)' : 'translateY(20px)',
              opacity: resultsInView ? 1 : 0,
              transition: 'all 0.6s ease-out'
            }}
          >
            <p className="text-neutral-800 text-lg md:text-xl">
              {loading ? (
                <span className="text-neutral-600">Searching...</span>
              ) : (
                <>
                  <span className="font-bold text-primary md:text-2xl">{providers.length}</span>
                  <span className="text-neutral-600 ml-1 text-base md:text-lg ">
                    provider{providers.length !== 1 ? 's' : ''} found
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="w-16 h-16 border-4 border-primary-light rounded-full"></div>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-neutral-600 mt-6 text-lg">Loading providers...</p>
            </div>
          ) : providers.length > 0 ? (
            // Provider Cards Grid
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider, index) => {
                const ServiceIcon = serviceIcons[provider.serviceType] || Wrench
                return (
                  <div
                    key={provider._id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary-light hover:-translate-y-1"
                    style={{
                      transform: resultsInView ? 'scale(1)' : 'scale(0.9)',
                      opacity: resultsInView ? 1 : 0,
                      transition: `all 0.5s ease-out ${index * 0.1}s`
                    }}
                  >
                    {/* Provider Header */}
                    <div className="relative bg-gradient-to-br from-primary to-primary-dark p-8 text-center overflow-hidden">
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-full blur-3xl opacity-30"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-20"></div>
                      
                      <div className="relative">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <ServiceIcon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{provider.name}</h3>
                        <p className="text-neutral-100 font-medium">{provider.serviceType}</p>
                      </div>
                    </div>

                    {/* Provider Details */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-neutral-900">
                            {provider.rating?.average || 0}
                          </span>
                          <span className="text-neutral-600 text-sm">
                            ({provider.rating?.count || 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{provider.location}</span>
                        </div>
                      </div>

                      <p className="text-neutral-700 mb-6 text-sm leading-relaxed line-clamp-2">
                        {provider.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <a 
                          href={`tel:${provider.phone}`}
                          className="flex-1 bg-secondary text-white px-4 py-3 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                        <Link
                          href={`/provider/${provider._id}`}
                          className="flex-1 bg-neutral-100 text-primary px-4 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-all duration-300 text-center flex items-center justify-center gap-2 hover:scale-105"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // No Results State
            <div 
              className="text-center py-20"
              style={{
                transform: resultsInView ? 'translateY(0)' : 'translateY(30px)',
                opacity: resultsInView ? 1 : 0,
                transition: 'all 0.6s ease-out'
              }}
            >
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">No providers found</h3>
              <p className="text-neutral-600 mb-8 text-lg max-w-md mx-auto">
                Try adjusting your search filters or browse all providers
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setLocation('')
                  setCategory('')
                }}
                className="bg-secondary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
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
            transform: ctaInView ? 'translateY(0)' : 'translateY(40px)',
            opacity: ctaInView ? 1 : 0,
            transition: 'all 0.8s ease-out'
          }}
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Cannot find what you are looking for?
          </h2>
          <p className="text-sm md:text-xl text-neutral-100 mb-8 max-w-2xl mx-auto">
            More providers are joining every day. Check back soon or register your business!
          </p>
          <Link
            href="/register"
            className="inline-block bg-secondary text-white px-10 py-3.5 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-base md:text-lg"
          >
            Register Your Business
          </Link>
        </div>
      </section>
    </div>
  )
}