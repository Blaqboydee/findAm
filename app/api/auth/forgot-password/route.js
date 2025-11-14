import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import User from '../../../../models/User'
import { sendPasswordResetEmail } from '../../../../lib/email'
import crypto from 'crypto'
import { log } from 'console'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    await connectDB()
    const user = await User.findOne({ email })

   
    if (!user) {
      // Don't reveal if email exists (security)
      return NextResponse.json({ 
        success: true, 
        message: 'If that email exists, we sent a reset link' 
      })
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    console.log(resetToken);
    const resetTokenExpiry = Date.now() + 3600000 
    
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()
    
    // Send email
    await sendPasswordResetEmail(email, resetToken)
    
    return NextResponse.json({ 
      success: true,
      message: 'Password reset email sent' 
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Something went wrong' 
    }, { status: 500 })
  }
}