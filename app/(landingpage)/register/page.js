'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Target, Star, DollarSign, CheckCircle2, User, Mail, Phone, Briefcase, MapPin, FileText, ArrowRight, AlertCircle, Loader2, Building2 } from 'lucide-react'

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

export default function RegisterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [providerExists, setProviderExists] = useState(null)
  const [checkingProvider, setCheckingProvider] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    areas: [],
    description: '',
  })

  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  
  const [workImages, setWorkImages] = useState([])
  const [workImagesPreviews, setWorkImagesPreviews] = useState([])
  
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [benefitsRef, benefitsInView] = useInView(0.2)
  const [formRef, formInView] = useInView(0.1)
  const [ctaRef, ctaInView] = useInView(0.2)

  // Check authentication and redirect if needed
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/onboarding')
    }
  }, [status, router])

  // Check if provider account already has a business
  useEffect(() => {
    async function checkExistingBusiness() {
      if (status === 'authenticated' && session?.user?.id) {
        // Check if user is a provider
        if (session.user.role !== 'provider') {
          setCheckingProvider(false)
          return
        }

        try {
          const response = await fetch(`/api/providers/by-user/${session.user.id}`)
          const data = await response.json()
          console.log(data);
          
          
          if (data.success && data.data) {
            setProviderExists(data.data)
          }
        } catch (error) {
          console.error('Error checking existing business:', error)
        } finally {
          setCheckingProvider(false)
        }
      }
    }

    checkExistingBusiness()
  }, [status, session])

  // Handle profile image selection
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
  }

  // Handle work images selection (max 3)
  const handleWorkImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (workImages.length + files.length > 3) {
      alert('You can only upload up to 3 work samples')
      return
    }

    const newWorkImages = [...workImages, ...files]
    const newPreviews = files.map(file => URL.createObjectURL(file))

    setWorkImages(newWorkImages)
    setWorkImagesPreviews([...workImagesPreviews, ...newPreviews])
  }

  // Remove work image
  const removeWorkImage = (index) => {
    const newWorkImages = workImages.filter((_, i) => i !== index)
    const newPreviews = workImagesPreviews.filter((_, i) => i !== index)
    setWorkImages(newWorkImages)
    setWorkImagesPreviews(newPreviews)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle area checkbox changes
  const handleAreaChange = (area) => {
    setFormData(prev => {
      const areas = prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area]
      return { ...prev, areas }
    })
  }

  // Upload single image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (data.success) {
      return data.url
    } else {
      throw new Error('Upload failed')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.areas.length === 0) {
      alert('Please select at least one area you serve')
      return
    }
    
    setUploading(true)

    try {
      let profileImageUrl = null
      let workImagesUrls = []

      if (profileImage) {
        profileImageUrl = await uploadImage(profileImage)
      }

      if (workImages.length > 0) {
        const uploadPromises = workImages.map(img => uploadImage(img))
        workImagesUrls = await Promise.all(uploadPromises)
      }
      
      const submissionData = {
        ...formData,
        city: 'Ibadan',
        profileImage: profileImageUrl,
        workImages: workImagesUrls,
      }
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        alert(result.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const serviceCategories = [
    'Tailor', 'Plumber', 'Electrician', 'Makeup Artist', 'Carpenter',
    'Photographer', 'Mechanic', 'Cleaner', 'Painter', 'Hairdresser',
    'Chef/Catering', 'Generator Repairer', 'AC Technician', 'Event Planner', 'Other'
  ]

  const ibadanAreas = [
    'Bodija', 'UI/Ajibode', 'Mokola', 'Dugbe', 'Challenge', 'Ologuneru',
    'Sango', 'Ring Road', 'Adamasingba', 'Agodi', 'Jericho', 'Apata',
    'Oluyole', 'Iwo Road', 'Bashorun', 'Eleyele', 'Idi-Ape', 'New Garage',
    'Secretariat', 'Akobo'
  ]

  const benefits = [
    { icon: Target, title: 'Reach More Customers', text: 'Get discovered by people actively searching for your services', color: 'bg-blue-500' },
    { icon: Star, title: 'Build Your Reputation', text: 'Collect reviews and showcase your best work', color: 'bg-yellow-500' },
    { icon: DollarSign, title: "It's Free", text: 'No registration fees. Start getting customers today', color: 'bg-green-500' },
  ]

  // Loading state
  if (status === 'loading' || (status === 'authenticated' && checkingProvider)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not a provider - show error
  if (status === 'authenticated' && session?.user?.role !== 'provider') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-start justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-red-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-3">
            Provider Account Required
          </h2>
          <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
            You need a provider account to register a business. Your current account is a customer account.
          </p>
          <div className="space-y-3">
            <Link
              href="/onboarding"
              className="block bg-secondary text-sm md:text-base text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-dark transition shadow-lg hover:shadow-xl"
            >
              Create Provider Account
            </Link>
            <Link
              href="/dashboard"
              className="block bg-neutral-100 text-sm md:text-base text-neutral-900 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Provider already has a business
  if (providerExists) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-start justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-green-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-neutral-900 mb-3">
            Business Already Registered!
          </h2>
          <p className="text-neutral-600 mb-2 text-lg font-semibold">
            {providerExists.name}
          </p>
          <p className="text-neutral-500 mb-6">
            {providerExists.serviceType} • {providerExists.city}
          </p>
          <div className="bg-neutral-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-yellow-600 mb-2">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold text-lg">
                {providerExists.rating?.average?.toFixed(1) || '0.0'}
              </span>
              <span className="text-neutral-600 text-sm">
                ({providerExists.rating?.count || 0} reviews)
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
            </Link>
            <Link
              href={`/provider/${providerExists._id}`}
              className="block bg-neutral-100 text-neutral-900 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition"
            >
              View Public Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  // Provider without business - show registration form
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-light rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-6xl font-bold mb-4 md:mb-6">
            Register Your Business
          </h1>
          <p className="text-sm md:text-2xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
            Join FindAm and connect with thousands of potential customers in Ibadan
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section  className="py-8 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 
            className="text-xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-neutral-900"
            // style={{
            //   transform: benefitsInView ? 'translateY(0)' : 'translateY(30px)',
            //   opacity: benefitsInView ? 1 : 0,
            //   transition: 'all 0.6s ease-out'
            // }}
          >
            Why Join FindAm?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div 
                  key={benefit.title}
                  className="group text-center p-8 bg-neutral-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary-light"
                  // style={{
                  //   transform: benefitsInView ? 'scale(1)' : 'scale(0.9)',
                  //   opacity: benefitsInView ? 1 : 0,
                  //   transition: `all 0.5s ease-out ${index * 0.15}s`
                  // }}
                >
                  <div className={`${benefit.color} w-18 h-18 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-neutral-900">{benefit.title}</h3>
                  <p className="text-neutral-600 leading-relaxed text-sm md:text-base">{benefit.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section ref={formRef} className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div 
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10 border-2 border-primary-light"
            // style={{
            //   transform: formInView ? 'translateY(0)' : 'translateY(40px)',
            //   opacity: formInView ? 1 : 0,
            //   transition: 'all 0.8s ease-out'
            // }}
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-14 h-14 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-accent mb-3">Registration Successful!</h3>
                <p className="text-neutral-600 mb-8 text-lg">
                  Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-base md:text-3xl font-bold mb-8 text-neutral-900 text-center">
                  Create Your Profile
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business/Name */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Business/Your Name <span className="text-secondary">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Adewale Fashion House"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Profile/Logo Image */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-800 mb-2">
                      Profile Picture/Business Logo
                    </label>
                    <div className="flex items-center gap-4">
                      {profileImagePreview && (
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                        />
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-neutral-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark"
                        />
                        {/* <p className="text-sm text-neutral-600 mt-1">
                          Recommended: Square image, at least 400x400px
                        </p> */}
                      </div>
                    </div>
                  </div>

                  {/* Work Samples Images */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-800 mb-2">
                      Work Samples (Up to 3 images)
                    </label>
                    
                    {workImagesPreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {workImagesPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Work sample ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-neutral-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeWorkImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {workImages.length < 3 && (
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleWorkImagesChange}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-neutral-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-secondary file:text-white file:cursor-pointer hover:file:bg-secondary-dark"
                      />
                    )}
                    <p className="text-sm text-neutral-600 mt-1">
                      Upload photos of your previous work to build trust with customers
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Email Address <span className="text-secondary">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Phone Number <span className="text-secondary">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="08012345678"
                        required
                        pattern="[0-9]{11}"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                      />
                    </div>
                    <p className="text-sm text-neutral-600 mt-2 ml-1">This number will be visible to customers</p>
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Service Type <span className="text-secondary">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none z-10" />
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white appearance-none cursor-pointer"
                      >
                        <option value="">Select a service</option>
                        {serviceCategories.map(service => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Areas in Ibadan */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-3">
                      Areas You Serve in Ibadan <span className="text-secondary">*</span>
                    </label>
                    <p className="text-sm text-neutral-600 mb-3">
                      Select all areas where you provide your services
                    </p>
                    <div className="max-h-60 overflow-y-auto border-2 border-neutral-200 rounded-xl p-4 bg-neutral-50 grid grid-cols-2 gap-3">
                      {ibadanAreas.map(area => (
                        <label 
                          key={area} 
                          className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.areas.includes(area)}
                            onChange={() => handleAreaChange(area)}
                            className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary cursor-pointer"
                          />
                          <span className="text-sm text-neutral-800">{area}</span>
                        </label>
                      ))}
                    </div>
                    {formData.areas.length > 0 && (
                      <p className="text-sm text-primary mt-2 ml-1 font-medium">
                        Selected: {formData.areas.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      About Your Service <span className="text-secondary">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-neutral-400" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell customers about your service, experience, and what makes you special..."
                        required
                        rows="5"
                        maxLength="500"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 resize-none bg-neutral-50 focus:bg-white"
                      />
                    </div>
                    <p className="text-sm text-neutral-600 mt-2 ml-1">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-secondary-dark transition-all duration-300 text-sm md:text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {uploading ? 'Uploading Images...' : 'Register Now - It\'s Free'}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <p className="text-sm text-neutral-600 text-center pt-2">
                    By registering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section 
        ref={ctaRef}
        className="relative py-16 md:py-20 bg-primary text-white overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-light rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div 
          className="relative container mx-auto px-4 text-center"
          // style={{
          //   transform: ctaInView ? 'translateY(0)' : 'translateY(40px)',
          //   opacity: ctaInView ? 1 : 0,
          //   transition: 'all 0.8s ease-out'
          // }}
        >
          <h2 className="text-xl md:text-3xl font-bold mb-4">
            Already have customers?
          </h2>
          <p className="text-sm md:text-xl text-neutral-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Bring them to FindAm and make it easier for them to find and recommend you to others
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-lg"
          >
            Browse Providers
            <ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}