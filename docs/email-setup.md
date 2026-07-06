# Email — Zoho + Resend + Brevo

Single mailbox: **`dario.admin@protosweb.eu`**

## Architecture

| Direction | Provider | How |
|-----------|----------|-----|
| **Receive** (inbox) | **Zoho Mail** | Cloudflare MX → `mx.zoho.eu` |
| **Send — contact form** | **Resend** (primary) | Supabase edge fn `submit-form` |
| **Send — contact fallback** | **Brevo** | Same fn if Resend fails |
| **Send — newsletter welcome** | **Brevo** (primary) | Supabase edge fn `subscribe` |
| **Send — newsletter fallback** | **Resend** | Same fn if Brevo fails |

Zoho does **not** need an API key in Supabase. Open inbox at [mail.zoho.eu](https://mail.zoho.eu) or via admin panel link.

## Secret placement

| Secret | Platform | Used by |
|--------|----------|---------|
| `RESEND_API_KEY` | **Supabase Edge secrets** | `submit-form`, `subscribe` |
| `BREVO_API_KEY` | **Supabase Edge secrets** | `submit-form` (fallback), `subscribe` (primary) |
| `RESEND_FROM_EMAIL` | **Supabase Edge secrets** | `dario.admin@protosweb.eu` |
| `CONTACT_EMAIL` | **Supabase Edge secrets** | Admin notification recipient |
| `ADMIN_SECRET` | **Vercel only** | `/admin` login |
| `SUPABASE_SERVICE_ROLE_KEY` | **Vercel** | Admin CMS CRUD |

**Do not** use Brevo SMTP keys (`xsmtpsib-...`) in `BREVO_API_KEY`. Use the REST API key (`xkeysib-...`) from Brevo → SMTP & API → API Keys.

**Do not** put `ADMIN_SECRET` in Supabase.

## Resend domain setup

1. [resend.com/domains](https://resend.com/domains) → Add `protosweb.eu`
2. Region: **Ireland (eu-west-1)**
3. Custom return-path: **`send`**
4. Tracking subdomain: **`links`** (optional)
5. Copy DNS records to **Cloudflare** (DNS only, no proxy)
6. Wait for **Verified**
7. API key → Supabase `RESEND_API_KEY`

## Brevo setup

1. **Senders & Domains** → verify `protosweb.eu` (`brevo-code` TXT on Cloudflare `@`)
2. **API Keys** (`xkeysib-...`) → Supabase `BREVO_API_KEY`
3. SMTP keys are for mail clients only — not used by this project

## Zoho setup

1. Mailbox `dario.admin@protosweb.eu` in Zoho Admin
2. Cloudflare MX records (see [cloudflare-dns.md](./cloudflare-dns.md))
3. Apex SPF includes Zoho: `include:zohomail.eu`

## DNS checklist (Cloudflare)

See [cloudflare-dns.md](./cloudflare-dns.md). Critical:

- MX → Zoho (receive)
- SPF apex → Zoho + Brevo
- `send` TXT → Resend SPF
- `resend._domainkey` → Resend DKIM
- `_dmarc` → `rua=mailto:dario.admin@protosweb.eu`

## Test

1. Send mail **to** `dario.admin@protosweb.eu` from any external mailbox (npr. Proton) → Zoho inbox
2. Submit [kontakt](https://www.protosweb.eu/kontakt) → admin mail in Zoho + visitor auto-reply
3. Newsletter signup in footer → one welcome email (Brevo)
4. Admin `/admin/inbox` → contact form rows in Supabase `contacts`

## Rotate keys if exposed

If API keys were pasted in chat or logs, rotate in Resend/Brevo dashboards and update Supabase secrets.
