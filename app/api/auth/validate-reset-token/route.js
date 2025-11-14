import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import User from '../../../../models/User'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Token is required' 
      })
    }

    await connectDB()

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid or expired reset link' 
      })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({ 
      valid: false, 
      error: 'Failed to validate token' 
    })
  }
}