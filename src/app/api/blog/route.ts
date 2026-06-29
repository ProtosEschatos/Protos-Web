import { NextResponse } from 'next/server'

export async function GET() {
  // Placeholder — connect to Supabase or your CMS later
  return NextResponse.json({
    posts: [
      { id: 1, title: 'Email Marketing — Why Your Subscriber List is Worth More Than Instagram Followers', date: 'June 15, 2026', excerpt: '1,000 email subscribers are worth more than 10,000 Instagram followers.' },
      { id: 2, title: 'Web Analytics — How Do You Know Who Visits Your Site?', date: 'June 15, 2026', excerpt: 'Web analytics shows who visits your site, where they come from, and what they do.' },
      { id: 3, title: 'What is a Landing Page and When to Use It for Maximum Impact?', date: 'June 17, 2026', excerpt: 'A landing page is a page with one goal — turning visitors into customers.' },
    ],
  })
}
