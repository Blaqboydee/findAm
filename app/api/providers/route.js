import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Provider from '../../../models/Provider'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const area = searchParams.get('area') || ''
    const category = searchParams.get('category') || ''
    const minRating = searchParams.get('minRating') || ''

    let query = { 
      isActive: true,
      city: 'Ibadan'
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serviceType: { $regex: search, $options: 'i' } },
      ]
    }

    if (area) {
      query.areas = { $in: [area] }
    }

    if (category) {
      query.serviceType = category
    }

    // NEW: Filter by minimum rating
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) }
    }

    const providers = await Provider.find(query)
      .select('-userId')
      .sort({ createdAt: -1 })
      .limit(100)

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