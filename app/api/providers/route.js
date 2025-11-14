import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Provider from '../../../models/Provider'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    console.log(searchParams);
    
    const search = searchParams.get('search') || ''
    const area = searchParams.get('area') || '' // Changed from location
    const category = searchParams.get('category') || ''

    // Build query
    let query = { 
      isActive: true,
      city: 'Ibadan' // Always filter by Ibadan for MVP
    }

    // Search by name or service type
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serviceType: { $regex: search, $options: 'i' } },
      ]
    }

    // Filter by area (checks if area is in the areas array)
    if (area) {
      query.areas = { $in: [area] }
    }

    // Filter by category/service type
    if (category) {
      query.serviceType = category
    }

    console.log(query);
    

    const providers = await Provider.find(query)
      .select('-userId') // Don't expose userId
      .sort({ createdAt: -1 })
      .limit(100)

      // console.log(providers);
      

    return NextResponse.json({
      success: true,
      data: providers,
      count: providers.length
    })
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}