# Stripe donacije — Protos Web

Varijabilni iznosi **1–1000 EUR** s `/o-meni` → Stripe Checkout → webhook → `donations` tablica → `/admin/donacije`.

## Što ti treba od Stripe (jednom)

1. **Stripe račun** na [dashboard.stripe.com](https://dashboard.stripe.com) (EU, EUR).
2. **Secret key** — Developers → API keys → `sk_test_...` (test) ili `sk_live_...` (produkcija).
3. **Webhook** — Developers → Webhooks → Add endpoint:
   - URL: `https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/stripe-webhook` (točan project ref vidi u Supabase dashboardu → Project Settings)
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
| `donation-confirm` | `POST /api/donate/confirm` (backup nakon Stripe redirecta) | `--no-verify-jwt` |
| `stripe-webhook` | Stripe webhook | `--no-verify-jwt` |

Deploy: push `supabase/functions/**` na `main` ili ručno:

```bash
supabase functions deploy donation-checkout --no-verify-jwt --project-ref <SUPABASE_PROJECT_REF>
supabase functions deploy donation-confirm --no-verify-jwt --project-ref <SUPABASE_PROJECT_REF>
supabase functions deploy stripe-webhook --no-verify-jwt --project-ref <SUPABASE_PROJECT_REF>
```

## Migracija

```bash
supabase db push --project-ref <SUPABASE_PROJECT_REF>
```

Ili primijeni `20260711150000_donations_stripe_integration.sql` u SQL Editoru.

## Cilj donacije

Jedan gumb na `/o-meni` → cause slug `resources` (bez javnih ciljeva / progress barova).

## Ko-fi (paralelno)

Javni tip jar: https://ko-fi.com/protoswebmark23

- Tipka **Doniraj preko Ko-fi** na `/o-meni` + link u Stripe modalu + social/admin hub
- Ko-fi: manje platformskih naknada za tipove; **ne** ide automatski u `donations` tablicu / `/admin/donacije`
- Stripe: formalne donacije koje webhook bilježi u bazu

Ako većina podrške ide preko Ko-fi, Stripe Checkout ima manje transakcija → manje Stripe fee-a.

## Produkcija (live)

Koristi `sk_live_...` i live webhook `whsec_...` u Supabase secrets. Test kartice ne rade u live modu.

## Zoho IMAP

IMAP na `dario.admin@protosweb.eu` služi za čitanje maila u klijentu (Thunderbird, telefon). **Site ne koristi IMAP** — inbound mail i dalje ide preko DNS MX, outbound preko Resend edge fn.
