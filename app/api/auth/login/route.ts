import { loginController } from '@/models/auth/auth.controller'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const user = await loginController(req)
    if (!user) throw new Error('User not found')

    
    return NextResponse.json({
      message: 'User logged in successfully',
      data:    user,
      success: true,
    })
  } catch (error: any) {
    if(error.message) return NextResponse.json({ message: error.message, success: false }, { status: 400 })
    return NextResponse.json(
      { message: "something went wrong", success: false },
      { status: 500 }
    )
  }
}