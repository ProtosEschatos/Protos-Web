import 'server-only'
import {
  articleRewriteRequest,
  articleRewriteResponse,
  seoBriefRequest,
  seoBriefResponse,
  type ArticleRewriteRequest,
  type ArticleRewriteResponse,
  type PublishingPlatform,
  type SeoBriefRequest,
  type SeoBriefResponse,
  type SocialPlatform,
} from '@/lib/schemas/seo-content'
import { callAiJsonCascade, type AiProviderId } from '@/lib/ai/providers'

const SOCIAL_META: Record<SocialPlatform, { label: string; length: string; style: string }> = {
  youtube: {
    label: 'YouTube (long)',
    length: '500–1200 znakova, do 15 hashtagova na kraju.',
    style: 'Hook u prve 2 rečenice, timestamp emojiji ako priča vodi, CTA za subscribe/komentar, poveznica na web u zadnjem paragraf.',
  },
  'youtube-shorts': {
    label: 'YouTube Shorts',
    length: 'do 300 znakova, ≤ 5 hashtagova',
    style: 'Ultra kratak hook + 1 CTA. #Shorts obavezan hashtag.',
  },
  instagram: {
    label: 'Instagram post',
    length: '150–500 znakova + prvi red je hook.',
    style: 'Story tone, emoji ok, 8–15 hashtagova na kraju u zasebnom bloku.',
  },
  'instagram-reels': {
    label: 'Instagram Reels',
    length: 'do 250 znakova, ≤ 8 hashtagova',
    style: 'Hook + audio credit hint, CTA "spremi za kasnije".',
  },
  facebook: {
    label: 'Facebook',
    length: '200–800 znakova, malo/bez hashtagova (2–3 max).',
    style: 'Neformalno, 1 pitanje na kraju da potakne komentare.',
  },
  tiktok: {
    label: 'TikTok',
    length: 'do 300 znakova, 4–6 hashtagova, trending kad je moguće.',
    style: 'Direktan hook, ne linkove u caption, CTA "link in bio".',
  },
  linkedin: {
    label: 'LinkedIn',
    length: '600–1500 znakova, break-linije nakon svake rečenice.',
    style: 'Autoritativan ton, insights + jedna praktična preporuka, 3–5 hashtagova.',
  },
  'x-twitter': {
    label: 'X (Twitter)',
    length: 'do 280 znakova (thread ok, 3–5 tweetova).',
    style: 'Ostri hook, 1–2 hashtaga, link u zadnjem tweetu.',
  },
}

const PLATFORM_META: Record<PublishingPlatform, { label: string; wordTarget: string; style: string }> = {
  medium: {
    label: 'Medium',
    wordTarget: '800–1500 riječi, H2/H3 podnaslovi.',
    style: 'Story-driven, insight-first, Markdown, ne agresivan SEO. Ostavi 1–2 tag-a povezana s tehnologijom.',
  },
  substack: {
    label: 'Substack',
    wordTarget: '600–1200 riječi, newsletter format.',
    style: 'Osobni ton, direktno se obraća čitatelju. Predviđa "reply-to-me" CTA, ne SEO-optimizirano.',
  },
  blogger: {
    label: 'Blogger',
    wordTarget: '500–900 riječi, klasični blog format.',
    style: 'Više SEO-heavy, keyword na prva 100 riječi, meta description u tags. Google indexira brzo.',
  },
  tumblr: {
    label: 'Tumblr',
    wordTarget: '150–500 riječi, vizualno.',
    style: 'Kratko, tag-heavy (do 20 tag-ova), aesthetic tone. GIF/image reference u tekstu.',
  },
  aboutme: {
    label: 'About.me',
    wordTarget: 'bio format, 100–250 riječi.',
    style: 'Prvo lice, jedan paragraf hook + 3–5 bullet postignuća, jedan CTA link.',
  },
  payhip: {
    label: 'Payhip (product/lead)',
    wordTarget: 'landing copy, 200–500 riječi.',
    style: 'Konverzijski format: hook → problem → rješenje → 3 bullet feature-a → cijena/CTA.',
  },
}

function socialGuideText(platforms: SocialPlatform[]): string {
  return platforms
    .map((p) => `- ${p} (${SOCIAL_META[p].label}): ${SOCIAL_META[p].length} | ${SOCIAL_META[p].style}`)
    .join('\n')
}

function platformGuideText(platforms: PublishingPlatform[]): string {
  return platforms
    .map((p) => `- ${p} (${PLATFORM_META[p].label}): ${PLATFORM_META[p].wordTarget} | ${PLATFORM_META[p].style}`)
    .join('\n')
}

function buildSeoBriefPrompt(input: SeoBriefRequest): string {
  return [
    `Ti si Protos Web SEO copywriter. Zadatak: generiraj SEO paket za temu ispod.`,
    `Ciljni jezik: ${input.locale}. Ton: ${input.tone}.`,
    input.audience ? `Publika: ${input.audience}.` : '',
    input.cta ? `CTA: ${input.cta}.` : '',
    input.keywords?.length ? `Preferirani keywordi (koristi + proširi): ${input.keywords.join(', ')}.` : '',
    ``,
    `TEMA/PROMPT:`,
    input.topic,
    ``,
    `Vrati ISKLJUČIVO JSON (bez fenceova) u točno ovoj strukturi:`,
    `{`,
    `  "title": "SEO title (max 60 znakova, prirodan, s ključnom riječju blizu početka)",`,
    `  "metaDescription": "meta description 140-160 znakova, jasan value prop + soft CTA",`,
    `  "ogTitle": "OpenGraph title (može biti malo kreativniji, do 90 znakova)",`,
    `  "ogDescription": "OG description za social share, 120-200 znakova",`,
    `  "slug": "url-friendly-slug-samo-lowercase-crtice",`,
    `  "keywords": ["8-15 keywordi", "long-tail dobrodošli"],`,
    `  "hashtags": ["10-20 hashtagova bez # prefixa, mješavina brand + niša + trend"],`,
    `  "socialCaptions": {`,
    input.socialPlatforms.map((p) => `    "${p}": "caption za ${p}"`).join(',\n'),
    `  },`,
    `  "ctaLine": "jedna rečenica CTA za sve platforme"`,
    `}`,
    ``,
    `Pravila po platformi:`,
    socialGuideText(input.socialPlatforms),
  ]
    .filter(Boolean)
    .join('\n')
}

function buildRewritePrompt(input: ArticleRewriteRequest): string {
  return [
    `Ti si Protos Web content adapter. Preformuliraj članak ispod za više platformi.`,
    `Izvorni jezik: ${input.sourceLocale}. Ciljni jezik: ${input.targetLocale}. Ton: ${input.tone}.`,
    input.keepLinkTo ? `Zadrži canonical link na: ${input.keepLinkTo}` : '',
    ``,
    `IZVORNI NASLOV: ${input.sourceTitle}`,
    ``,
    `IZVORNI SADRŽAJ:`,
    input.sourceContent,
    ``,
    `KLJUČNO — NE kopiraj članak 1:1. Za svaku platformu:`,
    `- napiši potpuno NOVI naslov (ne isti kao izvor)`,
    `- restrukturiraj sadržaj (drugi redoslijed, drugi hookovi, drugi primjeri gdje moguće)`,
    `- prilagodi dužinu i format platformi (vidi guide ispod)`,
    ``,
    `Guide po platformi:`,
    platformGuideText(input.platforms),
    ``,
    `Vrati ISKLJUČIVO JSON (bez fenceova):`,
    `{`,
    `  "variants": {`,
    input.platforms
      .map(
        (p) =>
          `    "${p}": { "title": "...", "subtitle": "optional", "body": "Markdown", "tags": ["..."], "excerpt": "150-200 char", "publishingHints": "gdje/kada objaviti, best practice" }`,
      )
      .join(',\n'),
    `  }`,
    `}`,
  ]
    .filter(Boolean)
    .join('\n')
}

function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
}

export type SeoBriefResult =
  | { ok: true; brief: SeoBriefResponse; provider: AiProviderId }
  | { ok: false; error: string }

export async function generateSeoBrief(raw: unknown): Promise<SeoBriefResult> {
  const parsed = seoBriefRequest.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Neispravan zahtjev' }
  }

  try {
    const { content, provider } = await callAiJsonCascade(buildSeoBriefPrompt(parsed.data), 2000)
    const json = JSON.parse(stripFences(content))
    const validated = seoBriefResponse.safeParse(json)
    if (!validated.success) {
      return {
        ok: false,
        error: `AI vratio neispravan format: ${validated.error.issues.slice(0, 2).map((i) => i.message).join('; ')}`,
      }
    }
    return { ok: true, brief: validated.data, provider }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export type ArticleRewriteResult =
  | { ok: true; response: ArticleRewriteResponse; provider: AiProviderId }
  | { ok: false; error: string }

export async function rewriteArticle(raw: unknown): Promise<ArticleRewriteResult> {
  const parsed = articleRewriteRequest.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Neispravan zahtjev' }
  }

  try {
    const { content, provider } = await callAiJsonCascade(buildRewritePrompt(parsed.data), 6000)
    const json = JSON.parse(stripFences(content))
    const validated = articleRewriteResponse.safeParse(json)
    if (!validated.success) {
      return {
        ok: false,
        error: `AI vratio neispravan format: ${validated.error.issues.slice(0, 2).map((i) => i.message).join('; ')}`,
      }
    }
    return { ok: true, response: validated.data, provider }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
