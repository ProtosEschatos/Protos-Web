#!/usr/bin/env bash
# Preview env: Vercel CLI 54 may require Dashboard for branch-scoped Preview secrets.
# 1. Run this for public defaults (or set manually in Dashboard).
# 2. Vercel → protos-web → Settings → Environment Variables → for each Production-only
#    secret (ADMIN_SECRET, IMAP passwords, CRON_SECRET, GOOGLE_SITE_VERIFICATION):
#    Edit → check "Preview" → Save.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Public Preview defaults (set in Vercel Dashboard if CLI blocks):"
cat <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://laqnnzavwbojntfiqmxj.supabase.co
NEXT_PUBLIC_SITE_URL=https://protosweb.eu
NEXT_PUBLIC_GA_ID=G-HR9HK4SR7Q
ZOHO_IMAP_USER=dario.admin@protosweb.eu
ZOHO_IMAP_HOST=imappro.zoho.eu
ZOHO_IMAP_PORT=993
GMAIL_STUDIO_IMAP_USER=protoswebmark23@gmail.com
GMAIL_STUDIO_IMAP_HOST=imap.gmail.com
GMAIL_STUDIO_IMAP_PORT=993
VERCEL_PROJECT_ID=prj_m1CjIwl8V8rwtVEVDJxwUKBExMS4
VERCEL_TEAM_ID=team_Ag2YzbfKytHwYpcCRc18i26c
EOF
echo ""
echo "Enable Preview checkbox on existing Production secrets: ADMIN_SECRET, GMAIL_STUDIO_IMAP_PASSWORD, CRON_SECRET, NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"
