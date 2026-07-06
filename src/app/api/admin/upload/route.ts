import { NextResponse } from 'next/server'
import { adminUploadPortfolioImage } from '@/actions/admin-upload'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const result = await adminUploadPortfolioImage(formData)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true, url: result.url })
  } catch {
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
