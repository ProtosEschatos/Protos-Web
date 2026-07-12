# Cloudflare DNS — protosweb.eu

Domain DNS is managed in **Cloudflare**. Full email architecture: [email-setup.md](./email-setup.md).

## Cloudflare API token (ProtosWeb)

For agent/scripts to edit public DNS (`protosweb.eu`), the token needs:

| Permission | Level |
|------------|--------|
| **Zone → DNS → Edit** | Required (public zone records) |
| **Zone → Zone → Read** | Recommended |

**Not sufficient alone:** Account **DNS View Write** (Internal DNS views) or Cursor IDE `cfat_` agent tokens — these fail on `/zones/.../dns_records`.

Store token in `CLOUDFLARE_API_TOKEN` (e.g. `~/.config/kilo/.env`), then:

```bash
export CLOUDFLARE_ZONE_ID=<your-zone-id>  # Cloudflare dashboard → domain overview → API section
./scripts/fix-cloudflare-dns.sh
```

---

## Current status (verified 2026-07-06)

All email DNS records are configured. Public `dig` confirms:

| Check | Status |
|-------|--------|
| MX Zoho | ✅ |
| SPF apex (Zoho + Brevo) | ✅ |
| DMARC `rua` → `dario.admin@protosweb.eu` | ✅ |
| Single `brevo-code` on apex | ✅ |
| Resend `send` MX + SPF + `resend._domainkey` DKIM | ✅ |
| Resend dashboard `protosweb.eu` | Verified (eu-west-1) |

Apex A/CNAME stay **DNS only** (grey cloud) for Vercel — intentional.

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

Merge apex TXT into **one** SPF record (Zoho + Brevo):

```
v=spf1 include:zohomail.eu include:spf.brevo.com ~all
```

Brevo domain verification TXT on `@` (keep **one** record only):

```
brevo-code:360956dbf3c469b26dacf873722764d9
```

Remove any older `brevo-code:c2e6097f...` duplicate if still present.

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
| **Resend** | Domain `protosweb.eu` verified; API key in **Supabase** `RESEND_API_KEY` |
| **Brevo** | Domain verified; **API key** (`xkeysib-`) in **Supabase** `BREVO_API_KEY` — not SMTP key |
| **Supabase Edge secrets** | `RESEND_API_KEY`, `BREVO_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL` |
| **Vercel** | `NEXT_PUBLIC_SITE_URL`, `ADMIN_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_*` |
| **GitHub Actions** | `SUPABASE_URL`, `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN`, `KEEP_ALIVE_SECRET` — no email secrets needed |
| **Code** | `src/lib/site.ts` + edge function fallbacks |

---

## Test after DNS propagates (up to 24h)

1. Send email **to** `dario.admin@protosweb.eu` from any external mailbox → appears in Zoho inbox
2. Submit https://www.protosweb.eu/kontakt → admin mail in Zoho + auto-reply to submitter
3. Newsletter signup in footer → welcome email from `dario.admin@protosweb.eu`
