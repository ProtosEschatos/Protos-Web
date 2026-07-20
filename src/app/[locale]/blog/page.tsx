import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getBlogPosts } from '@/lib/queries/blog'
import BlogGrid from '@/components/features/blog/BlogGrid'
import { blogIndexJsonLd } from '@/lib/config/seo'
import { serializeJsonLd } from '@/lib/seo/json-ld'

type Props = { params: Promise<{ locale: string }> }

export default async function BlogPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = await getBlogPosts(50, locale)
  const jsonLd = blogIndexJsonLd(
    locale,
    t('title'),
    t('subtitle'),
    posts.map((post) => ({
      title: post.title,
      slug: post.slug,
      createdAt: post.created_at,
    })),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <section className="pt-36 pb-16 text-center relative overflow-hidden cosmic-hero-band">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">
            {t('label')}
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-tight mb-5">
            {t('title')}
          </h1>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <BlogGrid posts={posts} locale={locale} />
        </div>
      </section>
    </>
  )
}
