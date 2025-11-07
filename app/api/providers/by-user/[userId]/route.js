import { NextResponse } from 'next/server'
import connectDB from '../../../../../lib/mongodb'
import Provider from '../../../../../models/Provider'

export async function GET(request, { params }) {
  try {
    await connectDB()
    // console.log(params);
    
    const { userId } = await params
    console.log(userId);
    

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Find provider by userId
    const provider = await Provider.findOne({ userId })

    if (!provider) {
      return NextResponse.json(
        { success: false, message: 'No business found for this user' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: provider },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fetch provider by user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch provider' },
      { status: 500 }
    )
  }
}
