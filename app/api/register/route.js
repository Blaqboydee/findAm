import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Provider from '../../../models/Provider'

export async function POST(request) {
  try {
    // Connect to database
    await connectDB()

    // Get form data
    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      serviceType, 
      location, 
      description,
      profileImage,    // NEW
      workImages       // NEW
    } = body

    // Validate required fields
    if (!name || !email || !phone || !serviceType || !location || !description) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingProvider = await Provider.findOne({ email })
    if (existingProvider) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Create new provider
    const provider = await Provider.create({
      name,
      email,
      phone,
      serviceType,
      location,
      description,
      profileImage: profileImage || null,        
      workImages: workImages || [],              
    })

    return NextResponse.json(
      { success: true, data: provider },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}