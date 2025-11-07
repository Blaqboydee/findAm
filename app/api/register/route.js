import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Provider from '../../../models/Provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request) {
  try {
    // Get session to verify user is logged in
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to register a business' },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()
    console.log(body);
    
    const { 
      name, 
      email, 
      phone, 
      serviceType, 
      city, // Now receives "Ibadan"
      areas, // Now receives array: ["Bodija", "UI", ...]
      description,
      profileImage,
      workImages
    } = body

    // Validate required fields
    if (!name || !email || !phone || !serviceType || !city || !areas || areas.length === 0 || !description) {
      return NextResponse.json(
        { success: false, error: 'All fields are required. Please select at least one area.' },
        { status: 400 }
      )
    }

    // Check if user already has a business
    const existingProvider = await Provider.findOne({ userId: session.user.id })
    if (existingProvider) {
      return NextResponse.json(
        { success: false, error: 'You already have a registered business' },
        { status: 400 }
      )
    }

    // Create new provider linked to user
    const provider = await Provider.create({
      userId: session.user.id, // LINK TO USER - IMPORTANT!
      name,
      email,
      phone,
      serviceType,
      city, // "Ibadan"
      areas, // ["Bodija", "UI", "Challenge"]
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