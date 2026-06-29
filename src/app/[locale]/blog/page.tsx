import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getBlogPosts } from '@/actions/blog'
import BlogGrid from '@/components/blog/BlogGrid'

type Props = { params: { locale: string } }

export default async function BlogPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = await getBlogPosts(50, locale)

  return (
    <>
      <section className="pt-36 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,102,0,0.08)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 animate-[twinkle_8s_ease-in-out_infinite_alternate]"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 10% 20%,rgba(255,255,255,0.4),transparent),radial-gradient(1px 1px at 50% 10%,rgba(255,255,255,0.5),transparent),radial-gradient(1px 1px at 90% 80%,rgba(255,255,255,0.4),transparent)`,
          }}
        />
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
