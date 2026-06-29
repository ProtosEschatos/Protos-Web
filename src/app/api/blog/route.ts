import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/actions/blog'

const fallbackPosts = [
  { id: 1, title: 'Email Marketing — Why Your Subscriber List is Worth More Than Instagram Followers', published_at: '2026-06-15', excerpt: '1,000 email subscribers are worth more than 10,000 Instagram followers.' },
  { id: 2, title: 'Web Analytics — How Do You Know Who Visits Your Site?', published_at: '2026-06-15', excerpt: 'Web analytics shows who visits your site, where they come from, and what they do.' },
  { id: 3, title: 'What is a Landing Page and When to Use It for Maximum Impact?', published_at: '2026-06-17', excerpt: 'A landing page is a page with one goal — turning visitors into customers.' },
]

export async function GET() {
  const posts = await getBlogPosts(20)

  return NextResponse.json({
    posts: posts.length > 0 ? posts : fallbackPosts,
  })
}
