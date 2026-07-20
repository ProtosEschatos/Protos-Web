/**
 * Registry of well-known providers surfaced in /admin/kljucevi dropdown.
 * `custom` is always allowed as a fallback so the admin can add anything.
 */
export type AdminApiKeyProviderId =
  | 'openai'
  | 'deepseek'
  | 'gemini'
  | 'anthropic'
  | 'stripe'
  | 'resend'
  | 'brevo'
  | 'zoho'
  | 'sendgrid'
  | 'github'
  | 'vercel'
  | 'cloudflare'
  | 'sentry'
  | 'posthog'
  | 'sketchfab'
  | 'meshy'
  | 'polypizza'
  | 'mapbox'
  | 'zapier'
  | 'slack'
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'linkedin'
  | 'x-twitter'
  | 'threads'
  | 'bluesky'
  | 'pinterest'
  | 'reddit'
  | 'mastodon'
  | 'medium'
  | 'substack'
  | 'blogger'
  | 'tumblr'
  | 'aboutme'
  | 'payhip'
  | 'ko-fi'
  | 'ghost'
  | 'hashnode'
  | 'devto'
  | 'gpt-oss'
  | 'openrouter'
  | 'groq'
  | 'cerebras'
  | 'fal'
  | 'custom'

export type AdminApiKeyProviderMeta = {
  id: AdminApiKeyProviderId
  label: string
  category:
    | 'ai'
    | 'payments'
    | 'email'
    | 'deploy'
    | 'observability'
    | 'assets-3d'
    | 'automations'
    | 'social'
    | 'publishing'
    | 'other'
  docsUrl: string
  /** Optional Vercel env var name where this key typically lives. Displayed as a hint. */
  envHint?: string
}

export const ADMIN_API_KEY_PROVIDERS: AdminApiKeyProviderMeta[] = [
  { id: 'openai',     label: 'OpenAI',                    category: 'ai',            docsUrl: 'https://platform.openai.com/api-keys',            envHint: 'OPENAI_API_KEY' },
  { id: 'deepseek',   label: 'DeepSeek',                  category: 'ai',            docsUrl: 'https://platform.deepseek.com/api_keys',          envHint: 'DEEPSEEK_API_KEY' },
  { id: 'gemini',     label: 'Google Gemini',             category: 'ai',            docsUrl: 'https://aistudio.google.com/app/apikey',          envHint: 'GEMINI_API_KEY' },
  { id: 'anthropic',  label: 'Anthropic Claude',          category: 'ai',            docsUrl: 'https://console.anthropic.com/settings/keys',     envHint: 'ANTHROPIC_API_KEY' },
  { id: 'gpt-oss',    label: 'GPT-OSS-120B (self-host)',  category: 'ai',            docsUrl: 'https://huggingface.co/openai-community/gpt-oss-120b', envHint: 'GPT_OSS_BASE_URL' },
  { id: 'groq',       label: 'Groq (GPT-OSS-120B host)',  category: 'ai',            docsUrl: 'https://console.groq.com/keys',                   envHint: 'GROQ_API_KEY' },
  { id: 'cerebras',   label: 'Cerebras (GPT-OSS-120B)',   category: 'ai',            docsUrl: 'https://cloud.cerebras.ai/platform/keys',         envHint: 'CEREBRAS_API_KEY' },
  { id: 'openrouter', label: 'OpenRouter (multi-model)',  category: 'ai',            docsUrl: 'https://openrouter.ai/keys',                      envHint: 'OPENROUTER_API_KEY' },
  { id: 'fal',        label: 'fal.ai (GPU/image/models)', category: 'ai',            docsUrl: 'https://fal.ai/dashboard/keys',                   envHint: 'FAL_KEY' },

  { id: 'stripe',     label: 'Stripe',              category: 'payments',      docsUrl: 'https://dashboard.stripe.com/apikeys',            envHint: 'STRIPE_SECRET_KEY' },

  { id: 'resend',     label: 'Resend',              category: 'email',         docsUrl: 'https://resend.com/api-keys',                     envHint: 'RESEND_API_KEY' },
  { id: 'brevo',      label: 'Brevo',               category: 'email',         docsUrl: 'https://app.brevo.com/settings/keys/api',         envHint: 'BREVO_API_KEY' },
  { id: 'sendgrid',   label: 'SendGrid',            category: 'email',         docsUrl: 'https://app.sendgrid.com/settings/api_keys',      envHint: 'SENDGRID_API_KEY' },
  { id: 'zoho',       label: 'Zoho Mail (IMAP)',    category: 'email',         docsUrl: 'https://mail.zoho.eu/zm/#settings/all/mailaccounts', envHint: 'ZOHO_IMAP_PASSWORD' },

  { id: 'vercel',     label: 'Vercel',              category: 'deploy',        docsUrl: 'https://vercel.com/account/tokens',               envHint: 'VERCEL_TOKEN' },
  { id: 'cloudflare', label: 'Cloudflare',          category: 'deploy',        docsUrl: 'https://dash.cloudflare.com/profile/api-tokens',  envHint: 'CLOUDFLARE_API_TOKEN' },
  { id: 'github',     label: 'GitHub (PAT)',        category: 'deploy',        docsUrl: 'https://github.com/settings/tokens',              envHint: 'GITHUB_TOKEN' },

  { id: 'sentry',     label: 'Sentry',              category: 'observability', docsUrl: 'https://sentry.io/settings/account/api/auth-tokens/', envHint: 'SENTRY_AUTH_TOKEN' },
  { id: 'posthog',    label: 'PostHog',             category: 'observability', docsUrl: 'https://app.posthog.com/settings/project#variables', envHint: 'POSTHOG_API_KEY' },

  { id: 'sketchfab',  label: 'Sketchfab',           category: 'assets-3d',     docsUrl: 'https://sketchfab.com/settings/password',         envHint: 'SKETCHFAB_API_TOKEN' },
  { id: 'meshy',      label: 'Meshy',               category: 'assets-3d',     docsUrl: 'https://www.meshy.ai/settings/api',               envHint: 'MESHY_API_KEY' },
  { id: 'polypizza',  label: 'Poly.Pizza',          category: 'assets-3d',     docsUrl: 'https://poly.pizza/api',                          envHint: 'POLY_PIZZA_API_KEY' },
  { id: 'mapbox',     label: 'Mapbox',              category: 'assets-3d',     docsUrl: 'https://account.mapbox.com/access-tokens/',       envHint: 'MAPBOX_TOKEN' },

  { id: 'zapier',     label: 'Zapier',              category: 'automations',   docsUrl: 'https://zapier.com/app/settings/mcp',             envHint: 'ZAPIER_MCP_URL' },
  { id: 'slack',      label: 'Slack (webhook)',     category: 'automations',   docsUrl: 'https://api.slack.com/apps',                      envHint: 'SLACK_WEBHOOK_URL' },

  { id: 'youtube',    label: 'YouTube Data API',          category: 'social',        docsUrl: 'https://console.cloud.google.com/apis/credentials', envHint: 'YOUTUBE_API_KEY' },
  { id: 'instagram',  label: 'Instagram Graph',           category: 'social',        docsUrl: 'https://developers.facebook.com/apps',            envHint: 'INSTAGRAM_ACCESS_TOKEN' },
  { id: 'facebook',   label: 'Facebook Graph',            category: 'social',        docsUrl: 'https://developers.facebook.com/apps',            envHint: 'FACEBOOK_PAGE_ACCESS_TOKEN' },
  { id: 'threads',    label: 'Threads Graph (Meta)',      category: 'social',        docsUrl: 'https://developers.facebook.com/docs/threads',    envHint: 'THREADS_ACCESS_TOKEN' },
  { id: 'tiktok',     label: 'TikTok for Developers',     category: 'social',        docsUrl: 'https://developers.tiktok.com/apps',              envHint: 'TIKTOK_ACCESS_TOKEN' },
  { id: 'linkedin',   label: 'LinkedIn',                  category: 'social',        docsUrl: 'https://www.linkedin.com/developers/apps',        envHint: 'LINKEDIN_ACCESS_TOKEN' },
  { id: 'x-twitter',  label: 'X (Twitter)',               category: 'social',        docsUrl: 'https://developer.x.com/en/portal/dashboard',     envHint: 'X_BEARER_TOKEN' },
  { id: 'bluesky',    label: 'Bluesky (AT Protocol)',     category: 'social',        docsUrl: 'https://bsky.app/settings/app-passwords',         envHint: 'BLUESKY_APP_PASSWORD' },
  { id: 'pinterest',  label: 'Pinterest API',             category: 'social',        docsUrl: 'https://developers.pinterest.com/apps/',          envHint: 'PINTEREST_ACCESS_TOKEN' },
  { id: 'reddit',     label: 'Reddit (script app)',       category: 'social',        docsUrl: 'https://www.reddit.com/prefs/apps',               envHint: 'REDDIT_CLIENT_SECRET' },
  { id: 'mastodon',   label: 'Mastodon (instance token)', category: 'social',        docsUrl: 'https://docs.joinmastodon.org/client/token/',     envHint: 'MASTODON_ACCESS_TOKEN' },

  { id: 'medium',     label: 'Medium (integration)',      category: 'publishing',    docsUrl: 'https://medium.com/me/settings/security',         envHint: 'MEDIUM_INTEGRATION_TOKEN' },
  { id: 'substack',   label: 'Substack (RSS/webhook)',    category: 'publishing',    docsUrl: 'https://substack.com/settings',                   envHint: 'SUBSTACK_PUBLICATION_URL' },
  { id: 'blogger',    label: 'Blogger v3 (Google)',       category: 'publishing',    docsUrl: 'https://console.cloud.google.com/apis/library/blogger.googleapis.com', envHint: 'BLOGGER_API_KEY' },
  { id: 'tumblr',     label: 'Tumblr OAuth',              category: 'publishing',    docsUrl: 'https://www.tumblr.com/oauth/apps',               envHint: 'TUMBLR_OAUTH_TOKEN' },
  { id: 'aboutme',    label: 'About.me (manual)',         category: 'publishing',    docsUrl: 'https://about.me/edit',                           envHint: 'ABOUTME_PROFILE_URL' },
  { id: 'payhip',     label: 'Payhip',                    category: 'publishing',    docsUrl: 'https://payhip.com/account/api',                  envHint: 'PAYHIP_API_KEY' },
  { id: 'ko-fi',      label: 'Ko-fi',                     category: 'publishing',    docsUrl: 'https://ko-fi.com/manage/api',                    envHint: 'KO_FI_API_KEY' },
  { id: 'ghost',      label: 'Ghost (Admin API)',         category: 'publishing',    docsUrl: 'https://ghost.org/docs/admin-api/',               envHint: 'GHOST_ADMIN_API_KEY' },
  { id: 'hashnode',   label: 'Hashnode',                  category: 'publishing',    docsUrl: 'https://hashnode.com/settings/developer',         envHint: 'HASHNODE_PERSONAL_TOKEN' },
  { id: 'devto',      label: 'DEV.to',                    category: 'publishing',    docsUrl: 'https://dev.to/settings/extensions',              envHint: 'DEVTO_API_KEY' },

  { id: 'custom',     label: 'Custom / other',      category: 'other',         docsUrl: 'https://protosweb.eu' },
]

export const ADMIN_API_KEY_PROVIDER_IDS = ADMIN_API_KEY_PROVIDERS.map((p) => p.id)

export function findApiKeyProvider(id: string): AdminApiKeyProviderMeta {
  return ADMIN_API_KEY_PROVIDERS.find((p) => p.id === id) ?? ADMIN_API_KEY_PROVIDERS[ADMIN_API_KEY_PROVIDERS.length - 1]
}

export const ADMIN_API_KEY_CATEGORIES: Record<AdminApiKeyProviderMeta['category'], string> = {
  ai: 'AI',
  payments: 'Plaćanja',
  email: 'Email',
  deploy: 'Deploy & repo',
  observability: 'Praćenje',
  'assets-3d': '3D & assetsi',
  automations: 'Automatizacije',
  social: 'Društvene mreže',
  publishing: 'Publikacije',
  other: 'Ostalo',
}
