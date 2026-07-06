# Cloudflare DNS — protosweb.eu

Domain DNS is managed in **Cloudflare**. Email uses **Zoho Mail** (inbox) + **Resend** (transactional send from the website).

## Current gaps (check in Cloudflare dashboard)

As of 2026-07-06, public DNS lookup shows:

| Issue | Fix |
|-------|-----|
| **No MX records** on `protosweb.eu` | Add Zoho MX below — without these, `dario.admin@protosweb.eu` cannot receive mail |
| **DMARC `rua`** still `contact@protos-design.net` | Update to `dario.admin@protosweb.eu` |
| **Legacy `brevo-code` TXT** on apex | Safe to remove if not using Brevo |

Resend sending records on `send.protosweb.eu` and DKIM on `resend._domainkey` are already present.

---

## Required records

### 1. Zoho Mail — receive (MX on apex)

| Type | Name | Content | Priority | Proxy |
|------|------|---------|----------|-------|
| MX | `@` | `mx.zoho.eu` | 10 | DNS only |
| MX | `@` | `mx2.zoho.eu` | 20 | DNS only |
| MX | `@` | `mx3.zoho.eu` | 50 | DNS only |

Confirm exact values in Zoho Admin → Domains → `protosweb.eu` → DNS (EU datacenter uses `.eu` hosts).

### 2. Zoho Mail — SPF (apex TXT)

Merge with existing TXT records on `@` into **one** SPF TXT (only one SPF per hostname):

```
v=spf1 include:zoho.eu ~all
```

If you also send from Resend on the apex (not recommended), use:

```
v=spf1 include:zoho.eu include:amazonses.com ~all
```

Resend is already configured on subdomain `send.protosweb.eu` — apex SPF for Zoho only is fine.

### 3. Zoho verification (keep if present)

```
zoho-verification=zb87502431.zmverify.zoho.eu
```

### 4. Resend — send subdomain (already configured)

| Type | Name | Content |
|------|------|---------|
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| TXT | `resend._domainkey` | (DKIM key from Resend dashboard) |

Verify domain status: [resend.com/domains](https://resend.com/domains) → `protosweb.eu` must show **Verified**.

### 5. DMARC (update)

| Type | Name | Content |
|------|------|---------|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dario.admin@protosweb.eu` |

### 6. Website — Vercel (do not change if working)

| Type | Name | Content |
|------|------|---------|
| CNAME | `www` | `cname.vercel-dns.com` |
| A / CNAME | `@` | Vercel apex redirect per Vercel domain settings |

Google site verification TXT can stay.

---

## Remove (optional cleanup)

| Name | Reason |
|------|--------|
| `brevo-code:...` TXT on `@` | Brevo not used as primary; edge fn has optional fallback only |
| Old `protos-design.net` references in DMARC | Replaced by protosweb.eu |

---

## Platform checklist (all must match `dario.admin@protosweb.eu`)

| Platform | What to set |
|----------|-------------|
| **Cloudflare** | MX, SPF, DMARC (this doc) |
| **Zoho Mail** | Mailbox `dario.admin@protosweb.eu` |
| **Resend** | Domain `protosweb.eu` verified; API key in Supabase |
| **Supabase Edge secrets** | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL` |
| **Vercel** | `NEXT_PUBLIC_SITE_URL=https://www.protosweb.eu` (Production + Preview); remove unused Stripe/Brevo/Resend if desired |
| **GitHub Actions** | `SUPABASE_URL`, `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN`, `KEEP_ALIVE_SECRET` — no email secrets needed |
| **Code** | `src/lib/site.ts` + edge function fallbacks |

---

## Test after DNS propagates (up to 24h)

1. Send email **to** `dario.admin@protosweb.eu` from Gmail → appears in Zoho inbox
2. Submit https://www.protosweb.eu/kontakt → admin mail in Zoho + auto-reply to submitter
3. Newsletter signup in footer → welcome email from `dario.admin@protosweb.eu`
