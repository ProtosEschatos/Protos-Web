import { NextResponse } from 'next/server'
import { submitContact } from '@/actions/contact'

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
  }

  const result = await submitContact({
    name: String(body.name),
    email: String(body.email),
    service: String(body.service || ''),
    message: String(body.message),
  })

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error || 'Failed to submit' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Message received! We will get back to you soon.',
  })
}
