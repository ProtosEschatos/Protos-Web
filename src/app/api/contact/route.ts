import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Placeholder — wire up your email service (Formspree, SendGrid, etc.) later
  const body = await request.json()
  console.log('Contact form submission:', body)

  return NextResponse.json({
    success: true,
    message: 'Message received! We will get back to you soon.',
  })
}
