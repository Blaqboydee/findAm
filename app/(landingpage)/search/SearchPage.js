'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, MapPin, Filter, Star, Phone, Eye, Scissors, Wrench, Zap, Palette, Hammer, Camera, Car, Home, Paintbrush, Wind, ChefHat, Settings, Snowflake, PartyPopper, CheckCircle, Smartphone, Code, Package, GraduationCap, Music } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

// Icon mapping for services
const serviceIcons = {
  // Physical Services
  'Tailor': Scissors,
  'Plumber': Wrench,
  'Electrician': Zap,
  'Carpenter': Hammer,
  'Painter': Paintbrush,
  'Cleaner': Home,
  'Generator Repairer': Settings,
  'AC Technician': Snowflake,
  
  // Personal Care
  'Hairdresser/Barber': Scissors,
  'Makeup Artist': Palette,
  'Massage Therapist': Palette,
  'Nail Technician': Palette,
  
  // Automotive
  'Mechanic': Car,
  'Auto Electrician': Zap,
  'Car Wash': Car,
  'Vulcanizer': Settings,
  
  // Creative
  'Photographer': Camera,
  'Videographer': Camera,
  'Graphic Designer': Palette,
  'Content Creator': Camera,
  
  // Fashion
  'Fashion Designer': Scissors,
  'Shoe Maker': Scissors,
  
  // Food
  'Chef/Catering': ChefHat,
  'Baker': ChefHat,
  'Small Chops': ChefHat,
  'Event Catering': ChefHat,
  
  // Tech
  'Web Designer': Code,
  'App Developer': Code,
  'Phone Repair': Smartphone,
  'Computer Repair': Smartphone,
  'Tech Support': Settings,
  
  // Retail
  'Gadget Seller': Package,
  'Phone Accessories': Smartphone,
  'Fashion/Clothing Store': Package,
  'Provision Store': Package,
  
  // Education
  'Private Tutor': GraduationCap,
  'Music Teacher': Music,
  'Driving Instructor': Car,
  'Lesson Teacher': GraduationCap,
  
  // Events
  'Event Planner': PartyPopper,
  'MC/Compere': Music,
  'DJ': Music,
  'Decorator': Palette,
  
  // Default
  'Other': Wrench
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
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  
  // Initialize state with URL params
  const [searchTerm, setSearchTerm] = useState('')
  const [area, setArea] = useState('')
  const [category, setCategory] = useState(categoryFromUrl || '')
  const [minRating, setMinRating] = useState('')
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [resultsRef, resultsInView] = useInView(0.1)
  const [ctaRef, ctaInView] = useInView(0.2)

  // All Ibadan areas (expanded)
  const ibadanAreas = [
    'Bodija', 'UI/Ajibode', 'Mokola', 'Dugbe', 'Challenge', 'Ologuneru',
    'Nihort', 'Orita-Mefa', 'Olodo', 'Oke-Ado', 'Oke-Bola',
    'Oke-Are', 'Ita-Olugbodi', 'Sango-Ota', 'Odo-Ona', 'Aremo', 'Orita-Challenge',
    'Gbagi', 'Olubadan Estate', 'Ring Road', 'Iwo Road', 'Agbowo',
    'Sango', 'Adamasingba', 'Agodi', 'Jericho', 'Apata',
    'Oluyole', 'Bashorun', 'Eleyele', 'Idi-Ape', 'New Garage',
    'Secretariat', 'Akobo', 'Iresa Adu', 'Aleshinloye', 'Omi-Adio',
    'Olunloyo Estate', 'Odo-Ona Elewe', 'Muslim-Ogbere'
  ]

  // All service categories (grouped)
  const serviceCategories = [
    { category: 'Home Services', services: ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'Generator Repairer', 'AC Technician'] },
    { category: 'Personal Care', services: ['Hairdresser/Barber', 'Makeup Artist', 'Massage Therapist', 'Nail Technician'] },
    { category: 'Automotive', services: ['Mechanic', 'Auto Electrician', 'Car Wash', 'Vulcanizer'] },
    { category: 'Creative Services', services: ['Photographer', 'Videographer', 'Graphic Designer', 'Content Creator'] },
    { category: 'Fashion & Tailoring', services: ['Tailor', 'Fashion Designer', 'Shoe Maker'] },
    { category: 'Food & Catering', services: ['Chef/Catering', 'Baker', 'Small Chops', 'Event Catering'] },
    { category: 'Tech Services', services: ['Web Designer', 'App Developer', 'Phone Repair', 'Computer Repair', 'Tech Support'] },
    { category: 'Retail & Sales', services: ['Gadget Seller', 'Phone Accessories', 'Fashion/Clothing Store', 'Provision Store'] },
    { category: 'Education', services: ['Private Tutor', 'Music Teacher', 'Driving Instructor', 'Lesson Teacher'] },
    { category: 'Event Services', services: ['Event Planner', 'MC/Compere', 'DJ', 'Decorator'] }
  ]

  // Flatten all services for the dropdown
  const allServices = serviceCategories.flatMap(cat => cat.services)

  // Fetch providers from API
  useEffect(() => {
    fetchProviders()
  }, [searchTerm, area, category, minRating])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      // Build query params
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (area) params.append('area', area)
      if (category) params.append('category', category)
      if (minRating) params.append('minRating', minRating)

      const url = `/api/providers?${params.toString()}`
      
      const response = await fetch(url)
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
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-12 md:py-16 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-light rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-5xl font-bold mb-3">
              Find Service Providers in Ibadan
            </h1>
            <p className="text-sm md:text-lg text-neutral-100">
              Search by service, area, or category
            </p>
          </div>
          
          {/* Search Form */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              {/* First Row: Main Search Fields */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {/* Search Input */}
                <div className="relative">
                  <label className="block text-xs md:text-sm font-semibold text-neutral-800 mb-2">
                    Service or Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="e.g., Tailor, Plumber..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Area Dropdown */}
                <div className="relative">
                  <label className="block text-xs md:text-sm font-semibold text-neutral-800 mb-2">
                    Area in Ibadan
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-neutral-400 pointer-events-none z-10" />
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="">All Areas</option>
                      {ibadanAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <label className="block text-xs md:text-sm font-semibold text-neutral-800 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-neutral-400 pointer-events-none z-10" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {serviceCategories.map(cat => (
                        <optgroup key={cat.category} label={cat.category}>
                          {cat.services.map(service => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Second Row: Rating Filter */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-xs md:text-sm font-semibold text-neutral-800 mb-2">
                    Minimum Rating
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-yellow-500 pointer-events-none z-10" />
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="md:col-span-3 flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setArea('')
                      setCategory('')
                      setMinRating('')
                    }}
                    className="w-full md:w-auto px-6 py-2.5 md:py-3 text-sm md:text-base bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section ref={resultsRef} className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div 
            className="mb-6"
            style={{
              transform: resultsInView ? 'translateY(0)' : 'translateY(20px)',
              opacity: resultsInView ? 1 : 0,
              transition: 'all 0.6s ease-out'
            }}
          >
            <p className="text-neutral-800 text-base md:text-xl">
              {loading ? (
                <span className="text-neutral-600">Searching...</span>
              ) : (
                <>
                  <span className="font-bold text-primary text-xl md:text-2xl">{providers.length}</span>
                  <span className="text-neutral-600 ml-1 text-sm md:text-lg">
                    provider{providers.length !== 1 ? 's' : ''} found
                  </span>
                  {(searchTerm || area || category || minRating) && (
                    <span className="text-neutral-500 text-sm ml-2">
                      (filtered)
                    </span>
                  )}
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
                    <div className="relative bg-gradient-to-br from-primary to-primary-dark p-6 md:p-8 text-center overflow-hidden">
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-full blur-3xl opacity-30"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-20"></div>
                      
                      <div className="relative">
                        {/* Profile Image with Verification Badge */}
                        <div className="relative inline-block">
                          {provider.profileImage ? (
                            <img
                              src={provider.profileImage}
                              alt={provider.name}
                              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-white/20 group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                              <ServiceIcon className="w-10 h-10 text-white" />
                            </div>
                          )}
                          
                          {/* Verification Badge */}
                          {provider.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-accent rounded-full p-1 shadow-lg border-2 border-white">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 line-clamp-1">{provider.name}</h3>
                        <p className="text-neutral-100 text-sm font-medium">{provider.serviceType}</p>
                      </div>
                    </div>

                    {/* Provider Details */}
                    <div className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-neutral-900 text-sm">
                            {provider.rating?.average?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-neutral-600 text-xs">
                            ({provider.rating?.count || 0})
                          </span>
                        </div>
                        
                        {/* Display areas served */}
                        <div className="flex items-start gap-1.5 text-neutral-600 text-xs">
                          <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">
                            {provider.areas?.slice(0, 2).join(', ')}
                            {provider.areas?.length > 2 && ` +${provider.areas.length - 2}`}
                          </span>
                        </div>
                      </div>

                      <p className="text-neutral-700 mb-4 text-xs md:text-sm leading-relaxed line-clamp-2">
                        {provider.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 md:gap-3">
                        <a 
                          href={`tel:${provider.phone}`}
                          className="flex-1 bg-secondary text-white px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold hover:bg-secondary-dark transition-all duration-300 text-center flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105"
                        >
                          <Phone className="w-3 h-3 md:w-4 md:h-4" />
                          Call
                        </a>
                        <Link
                          href={`/provider/${provider._id}`}
                          className="flex-1 bg-neutral-100 text-primary px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold hover:bg-neutral-200 transition-all duration-300 text-center flex items-center justify-center gap-1.5 hover:scale-105"
                        >
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
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
              className="text-center py-16 md:py-20"
              style={{
                transform: resultsInView ? 'translateY(0)' : 'translateY(30px)',
                opacity: resultsInView ? 1 : 0,
                transition: 'all 0.6s ease-out'
              }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 md:w-12 md:h-12 text-neutral-400" />
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-neutral-900 mb-3">No providers found</h3>
              <p className="text-neutral-600 mb-8 text-sm md:text-base max-w-md mx-auto">
                Try adjusting your search filters or browse all providers
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setArea('')
                  setCategory('')
                  setMinRating('')
                }}
                className="bg-secondary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="relative py-12 md:py-16 bg-primary text-white overflow-hidden"
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
          <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">
            Cannot find what you are looking for?
          </h2>
          <p className="text-sm md:text-xl text-neutral-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            More providers are joining every day. Check back soon or register your business!
          </p>
          <Link
            href="/register"
            className="inline-block bg-secondary text-white px-8 md:px-10 py-3 md:py-3.5 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-lg"
          >
            Register Your Business
          </Link>
        </div>
      </section>
    </div>
  )
}