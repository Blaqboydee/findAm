'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Target, Star, DollarSign, CheckCircle2, User, Mail, Phone, Briefcase, MapPin, FileText, ArrowRight } from 'lucide-react'

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    location: '',
    description: '',
  })

  const [submitted, setSubmitted] = useState(false)
  
  const [benefitsRef, benefitsInView] = useInView(0.2)
  const [formRef, formInView] = useInView(0.1)
  const [ctaRef, ctaInView] = useInView(0.2)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false)
          setFormData({
            name: '',
            email: '',
            phone: '',
            serviceType: '',
            location: '',
            description: '',
          })
        }, 3000)
      } else {
        alert(result.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  const serviceCategories = [
    'Tailor',
    'Plumber', 
    'Electrician',
    'Makeup Artist',
    'Carpenter',
    'Photographer',
    'Mechanic',
    'Cleaner',
    'Painter',
    'Hairdresser',
    'Chef/Catering',
    'Generator Repairer',
    'AC Technician',
    'Event Planner',
    'Other'
  ]

  const nigerianCities = [
    'Lagos',
    'Ibadan',
    'Abuja',
    'Port Harcourt',
    'Kano',
    'Kaduna',
    'Enugu',
    'Benin City',
    'Onitsha',
    'Ilorin'
  ]

  const benefits = [
    { 
      icon: Target, 
      title: 'Reach More Customers',
      text: 'Get discovered by people actively searching for your services',
      color: 'bg-blue-500'
    },
    { 
      icon: Star, 
      title: 'Build Your Reputation',
      text: 'Collect reviews and showcase your best work',
      color: 'bg-yellow-500'
    },
    { 
      icon: DollarSign, 
      title: "It's Free",
      text: 'No registration fees. Start getting customers today',
      color: 'bg-green-500'
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-16 md:py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-light rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-6xl font-bold mb-4 md:mb-6">
            Register Your Business
          </h1>
          <p className="text-sm md:text-2xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
            Join FindAm and connect with thousands of potential customers looking for your services
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-8 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 
            className="text-xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-neutral-900"
            style={{
              transform: benefitsInView ? 'translateY(0)' : 'translateY(30px)',
              opacity: benefitsInView ? 1 : 0,
              transition: 'all 0.6s ease-out'
            }}
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
                  style={{
                    transform: benefitsInView ? 'scale(1)' : 'scale(0.9)',
                    opacity: benefitsInView ? 1 : 0,
                    transition: `all 0.5s ease-out ${index * 0.15}s`
                  }}
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
            style={{
              transform: formInView ? 'translateY(0)' : 'translateY(40px)',
              opacity: formInView ? 1 : 0,
              transition: 'all 0.8s ease-out'
            }}
          >
            {submitted ? (
              // Success Message
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-14 h-14 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-accent mb-3">Registration Successful!</h3>
                <p className="text-neutral-600 mb-8 text-lg">
                  Thank you for joining FindAm. We'll review your application and get back to you soon.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Back to Home
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              // Registration Form
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

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Location <span className="text-secondary">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none z-10" />
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white appearance-none cursor-pointer"
                      >
                        <option value="">Select your city</option>
                        {nigerianCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
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
                    className="w-full bg-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-secondary-dark transition-all duration-300 text-sm md:text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Register Now - It's Free
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