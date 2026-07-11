# Stripe donacije — Protos Web

Varijabilni iznosi **1–1000 EUR** s `/o-meni` → Stripe Checkout → webhook → `donations` tablica → `/admin/donacije`.

## Što ti treba od Stripe (jednom)

1. **Stripe račun** na [dashboard.stripe.com](https://dashboard.stripe.com) (EU, EUR).
2. **Secret key** — Developers → API keys → `sk_test_...` (test) ili `sk_live_...` (produkcija).
3. **Webhook** — Developers → Webhooks → Add endpoint:
   - URL: `https://laqnnzavwbojntfiqmxj.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`
   - Kopiraj **Signing secret** (`whsec_...`).
4. Za **live** način: aktiviraj business profil u Stripeu (verifikacija firme/OIB).

## Gdje staviti tajne

| Secret | Platforma | Napomena |
|--------|-----------|----------|
| `STRIPE_SECRET_KEY` | **Supabase Edge secrets** | `sk_test_` ili `sk_live_` |
| `STRIPE_WEBHOOK_SECRET` | **Supabase Edge secrets** | `whsec_` iz webhooka |
| `SITE_URL` | **Supabase Edge secrets** | `https://www.protosweb.eu` (success/cancel URL) |

**Ne na Vercel** — Stripe API pozivi idu iz edge funkcija. Vercel samo proxy `/api/donate` → edge.

## Edge funkcije

| Funkcija | Trigger | JWT |
|----------|---------|-----|
| `donation-checkout` | `POST /api/donate` | `--no-verify-jwt` |
| `stripe-webhook` | Stripe webhook | `--no-verify-jwt` |

Deploy: push `supabase/functions/**` na `main` ili ručno:

```bash
supabase functions deploy donation-checkout --no-verify-jwt --project-ref laqnnzavwbojntfiqmxj
supabase functions deploy stripe-webhook --no-verify-jwt --project-ref laqnnzavwbojntfiqmxj
```

## Migracija

```bash
supabase db push --project-ref laqnnzavwbojntfiqmxj
```

Ili primijeni `20260711150000_donations_stripe_integration.sql` u SQL Editoru.

## Cilj donacije

Jedan gumb na `/o-meni` → cause slug `resources` (bez javnih ciljeva / progress barova).

## Produkcija (live)

Koristi `sk_live_...` i live webhook `whsec_...` u Supabase secrets. Test kartice ne rade u live modu.

## Zoho IMAP

IMAP na `dario.admin@protosweb.eu` služi za čitanje maila u klijentu (Thunderbird, telefon). **Site ne koristi IMAP** — inbound mail i dalje ide preko DNS MX, outbound preko Resend edge fn.
