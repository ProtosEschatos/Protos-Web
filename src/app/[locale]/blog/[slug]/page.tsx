import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getBlogPostBySlug, getAllBlogSlugs, getAdjacentBlogPosts } from '@/lib/queries/blog'
import BlogPostContent from '@/components/features/blog/BlogPostContent'
import { Link } from '@/routing'
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import { buildBlogPostMetadata, blogPostingJsonLd, normalizeAuthorSlug } from '@/lib/config/seo'

type Props = { params: { locale: string; slug: string } }

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((post) => ({
    locale: post.language,
    slug: post.slug,
  }))
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  setRequestLocale(locale)
  const post = await getBlogPostBySlug(slug, locale)
  if (!post) return {}

  return buildBlogPostMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    locale,
    slug,
  })
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function authorLabel(
  authorSlug: ReturnType<typeof normalizeAuthorSlug>,
  t: Awaited<ReturnType<typeof getTranslations>>,
) {
  if (authorSlug === 'martina') return t('authorMartina')
  if (authorSlug === 'both') return t('authorBoth')
  return t('authorDario')
}

export default async function BlogPostPage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'blog' })
  const post = await getBlogPostBySlug(slug, locale)

  if (!post) notFound()

  const { previous, next } = await getAdjacentBlogPosts(slug, locale)

  const authorSlug = normalizeAuthorSlug(post.author_slug)
  const jsonLd = blogPostingJsonLd({
    title: post.title,
    description: post.excerpt || post.title,
    slug: post.slug,
    locale,
    createdAt: post.created_at,
    authorSlug,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="pt-36 pb-24">
        <div className="max-w-[800px] mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {t('viewAll')}
          </Link>

          <div className="cosmic-panel rounded-3xl p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--primary)] mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(post.created_at, locale)}
            </span>
            <span className="text-[var(--light-muted)]">
              {t('authorBy', { author: authorLabel(authorSlug, t) })}
            </span>
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
          </div>

          {(previous || next) ? (
            <nav
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4"
              aria-label={t('postNavLabel')}
            >
              {previous ? (
                <Link
                  href={`/blog/${previous.slug}`}
                  className="group cosmic-panel rounded-2xl p-5 text-left hover:border-[var(--primary)]/40 transition-colors"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--light-muted)] mb-2">
                    <ArrowLeft className="w-3.5 h-3.5" /> {t('prevPost')}
                  </span>
                  <span className="block text-sm font-semibold text-[var(--light)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                    {previous.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group cosmic-panel rounded-2xl p-5 text-right hover:border-[var(--primary)]/40 transition-colors sm:col-start-2"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--light-muted)] mb-2">
                    {t('nextPost')} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="block text-sm font-semibold text-[var(--light)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </article>
    </>
  )
}
