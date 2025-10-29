import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Provider from '../../../models/Provider'

export async function GET(request) {
  try {
    await connectDB()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const category = searchParams.get('category') || ''

    // Build query
    let query = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serviceType: { $regex: search, $options: 'i' } },
      ]
    }

    if (location) {
      query.location = location
    }

    if (category) {
      query.serviceType = category
    }

    // Get providers
    const providers = await Provider.find(query).sort({ createdAt: -1 })

    return NextResponse.json(
      { success: true, data: providers },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fetch providers error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}