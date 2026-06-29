import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/actions/blog'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'hr'
  const posts = await getBlogPosts(20, lang)
  return NextResponse.json(posts)
}
