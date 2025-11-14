import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import User from '../../../../models/User'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token and password are required' 
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      }, { status: 400 })
    }

    await connectDB()

    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired reset link' 
      }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password and clear reset token
    user.password = hashedPassword
    user.resetToken = null
    user.resetTokenExpiry = null
    await user.save()

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully' 
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reset password' 
    }, { status: 500 })
  }
}