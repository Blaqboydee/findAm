'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Star, MapPin, Phone, Mail, MessageCircle, Shield, CheckCircle, Calendar, Wrench, Scissors, Zap, Palette, Hammer, Camera, Car, Home, Paintbrush, ChefHat, Settings, Snowflake, PartyPopper, ChevronLeft, ChevronRight, X, Edit, Eye, AlertCircle } from 'lucide-react'

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

// Simple animation hook
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
  const { data: session } = useSession()
  
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)

  // Check if current user is the owner
  const isOwner = session?.user?.id && provider?.userId === session.user.id

  // Animate sections
  const contentVisible = useAnimateOnMount(100)
  const ctaVisible = useAnimateOnMount(300)

  useEffect(() => {
    if (params.id) {
      fetchProvider()
    }
  }, [params.id])

  const fetchProvider = async () => {
    try {
      const resolvedParams = await params
      const response = await fetch(`/api/providers/${resolvedParams.id}`)
      const data = await response.json()

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

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (provider.workImages?.length || 1))
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (provider.workImages?.length || 1)) % (provider.workImages?.length || 1))
  }

  const openLightbox = (imageUrl) => {
    setLightboxImage(imageUrl)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxImage(null)
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
  const hasWorkImages = provider.workImages && provider.workImages.length > 0

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Full size work sample"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Owner Banner */}
      {isOwner && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <div className="flex items-center gap-3">
                <p className="font-medium text-sm md:text-base">
                  You're viewing your public profile
                </p>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-2 rounded-lg transition-colors text-sm"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            {/* Provider Header */}
            <div className="flex items-start gap-6 md:gap-8">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                {provider.profileImage ? (
                  <img
                    src={provider.profileImage}
                    alt={provider.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                    <ServiceIcon className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                )}
                {provider.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-1.5 shadow-lg border-2 border-white">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Provider Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg md:text-2xl font-bold text-neutral-900 mb-0">
                      {provider.name}
                    </h1>
                    <p className="text-base md:text-lg text-neutral-600 font-medium mb-2">
                      {provider.serviceType}
                    </p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm md:text-base text-neutral-900">
                      {provider.rating?.average?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-neutral-600 text-sm">
                      ({provider.rating?.count || 0})
                    </span>
                  </div>
                  
                  {/* Display City + Areas */}
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-1 rounded-xl">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium text-neutral-900 text-sm md:text-base">
                      {provider.city || 'Ibadan'}
                      {provider.areas && provider.areas.length > 0 && (
                        <span className="text-neutral-600 text-xs ml-1">
                          ({provider.areas.slice(0, 2).join(', ')}
                          {provider.areas.length > 2 && ` +${provider.areas.length - 2}`})
                        </span>
                      )}
                    </span>
                  </div>

                  {provider.verified && (
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-700 text-sm md:text-base">Verified</span>
                    </div>
                  )}
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
                  className="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-neutral-100"
                  style={{
                    transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                    opacity: contentVisible ? 1 : 0,
                    transition: 'all 0.6s ease-out'
                  }}
                >
                  <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-2">
                    About
                  </h2>
                  <p className="text-neutral-700 leading-relaxed text-sm md:text-base">
                    {provider.description || 'No description available for this provider.'}
                  </p>
                </div>

                {/* Work Samples */}
                {hasWorkImages && (
                  <div 
                    className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-neutral-100"
                    style={{
                      transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                      opacity: contentVisible ? 1 : 0,
                      transition: 'all 0.6s ease-out 0.05s'
                    }}
                  >
                    <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-6">
                      Work Samples
                    </h2>
                    <div className="relative">
                      <img
                        src={provider.workImages[currentSlide]}
                        alt={`Work sample ${currentSlide + 1}`}
                        className="w-full h-64 md:h-96 object-cover rounded-xl shadow-md cursor-pointer"
                        onClick={() => openLightbox(provider.workImages[currentSlide])}
                      />
                      
                      {provider.workImages.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevSlide}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-800 rounded-full p-2 shadow-lg transition-all"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={handleNextSlide}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-800 rounded-full p-2 shadow-lg transition-all"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {provider.workImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentSlide ? 'bg-white w-8' : 'bg-white/60'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Service Details */}
                <div 
                  className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-neutral-100"
                  style={{
                    transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                    opacity: contentVisible ? 1 : 0,
                    transition: 'all 0.6s ease-out 0.1s'
                  }}
                >
                  <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-6">
                    Details
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-0.5">Service Type</p>
                        <p className="font-semibold text-neutral-900 text-sm md:text-base">{provider.serviceType}</p>
                      </div>
                    </div>
                    
                    {/* Areas Served */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-neutral-600 mb-1">Areas Served</p>
                        {provider.areas && provider.areas.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {provider.areas.map((area, idx) => (
                              <span 
                                key={idx}
                                className="inline-block bg-blue-50 text-primary px-3 py-1 rounded-lg text-xs md:text-sm font-medium"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="font-semibold text-neutral-900">{provider.city || 'Ibadan'}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-0.5">Member Since</p>
                        <p className="font-semibold text-neutral-900 text-sm md:text-base">
                          {new Date(provider.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                {!isOwner && (
                  <div 
                    className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-neutral-100"
                    style={{
                      transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                      opacity: contentVisible ? 1 : 0,
                      transition: 'all 0.6s ease-out 0.2s'
                    }}
                  >
                    <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-6">
                      Customer Reviews
                    </h2>
                    <div className="text-center py-12 bg-neutral-50 rounded-xl">
                      <Star className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600 mb-6">
                        {provider.rating?.count > 0 
                          ? 'Reviews coming soon!' 
                          : 'No reviews yet. Be the first to leave a review!'}
                      </p>
                      
                      {session ? (
                        <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all">
                          Leave a Review
                        </button>
                      ) : (
                        <Link
                          href="/onboarding"
                          className="inline-block bg-primary text-sm md:text-base text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all"
                        >
                          Sign In to Leave a Review
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Contact Card */}
              {!isOwner && (
                <div className="md:col-span-1">
                  <div 
                    className="bg-white rounded-2xl shadow-md p-6 md:p-8 sticky top-24 border border-neutral-100"
                    style={{
                      transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                      opacity: contentVisible ? 1 : 0,
                      transition: 'all 0.6s ease-out 0.3s'
                    }}
                  >
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-6">
                      Get in Touch
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <a 
                        href={`tel:${provider.phone}`}
                        className="flex items-center text-sm md:text-base justify-center gap-2 w-full bg-secondary text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </a>
                      
                      <a 
                        href={`https://wa.me/${provider.phone.replace(/^0/, '234')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-sm md:text-base gap-2 w-full bg-accent text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>

                      <a 
                        href={`mailto:${provider.email}`}
                        className="flex items-center justify-center text-sm md:text-base gap-2 w-full bg-neutral-100 text-neutral-800 px-6 py-3.5 rounded-xl font-semibold hover:bg-neutral-200 transition-all duration-300"
                      >
                        <Mail className="w-5 h-5" />
                        Send Email
                      </a>
                    </div>

                    {/* Trust Badge */}
                    <div className="pt-6 border-t border-neutral-200">
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          Your information is never shared with providers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isOwner && (
        <section 
          className="relative py-16 md:py-20 bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden"
        >
          <div 
            className="relative container mx-auto px-4 text-center"
            style={{
              transform: ctaVisible ? 'translateY(0)' : 'translateY(40px)',
              opacity: ctaVisible ? 1 : 0,
              transition: 'all 0.8s ease-out'
            }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Looking for other services?
            </h2>
            <p className="text-base md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Browse hundreds of verified service providers across Ibadan
            </p>
            <Link
              href="/search"
              className="inline-block bg-secondary text-white px-10 py-4 rounded-xl font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Back to Search
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}