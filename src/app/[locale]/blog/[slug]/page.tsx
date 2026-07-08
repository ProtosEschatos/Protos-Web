import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAdjacentBlogPosts, getBlogPostBySlug, getBlogSlugLocales } from '@/actions/blog'
import BlogPostContent from '@/components/blog/BlogPostContent'
import BlogPostNav from '@/components/blog/BlogPostNav'
import ReadingTime from '@/components/blog/ReadingTime'
import AuthorAvatar from '@/components/blog/AuthorAvatar'
import ShareButtons from '@/components/blog/ShareButtons'
import { Link } from '@/routing'
import { ArrowLeft, Calendar } from 'lucide-react'
import { buildBlogPostMetadata, blogPostingJsonLd, buildLocaleUrl } from '@/lib/seo'
import { estimateReadingMinutes } from '@/lib/reading-time'
import { AUTHOR_NAME, SITE_NAME } from '@/lib/site'

type Props = { params: { locale: string; slug: string } }

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  setRequestLocale(locale)
  const post = await getBlogPostBySlug(slug, locale)
  if (!post) return {}

  const slugLocales = await getBlogSlugLocales(slug)

  return buildBlogPostMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    locale,
    slug,
    slugLocales: slugLocales.length > 0 ? slugLocales : [locale],
  })
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'blog' })
  const post = await getBlogPostBySlug(slug, locale)

  if (!post) notFound()

  const { previous, next } = await getAdjacentBlogPosts(post.created_at, locale)
  const readingMinutes = estimateReadingMinutes(post.content)
  const shareUrl = buildLocaleUrl(locale, `/blog/${post.slug}`)

  const jsonLd = blogPostingJsonLd({
    title: post.title,
    description: post.excerpt || post.title,
    slug: post.slug,
    locale,
    createdAt: post.created_at,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostNav previous={previous} next={next} />
      <article className="pt-36 pb-24">
        <div className="max-w-[800px] mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {t('viewAll')}
          </Link>

          <div className="cosmic-panel rounded-3xl p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[var(--light-muted)] mb-4">
            <span className="inline-flex items-center gap-2">
              <AuthorAvatar size={36} />
              <Link
                href="/o-meni"
                className="font-medium text-[var(--light)] hover:text-[var(--primary)] transition-colors"
                rel="author"
              >
                {AUTHOR_NAME}
              </Link>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 text-[var(--primary)]">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(post.created_at, locale)}
            </span>
            <span aria-hidden="true">·</span>
            <ReadingTime minutes={readingMinutes} />
            <span aria-hidden="true">·</span>
            <span>{SITE_NAME}</span>
          </div>

          <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight mb-6 text-[var(--light)]">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="text-lg text-[var(--light-muted)] leading-relaxed mb-10 border-l-2 border-[var(--primary)] pl-4">
              {post.excerpt}
            </p>
          ) : null}

          {post.content ? <BlogPostContent content={post.content} /> : null}

          <div className="mt-10 pt-6 border-t border-[var(--border-card)]">
            <ShareButtons url={shareUrl} title={post.title} />
          </div>
          </div>
        </div>
      </article>
    </>
  )
}
