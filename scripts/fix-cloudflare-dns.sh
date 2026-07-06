#!/usr/bin/env bash
# Fix protosweb.eu email DNS records via Cloudflare API.
# Requires CLOUDFLARE_API_TOKEN with Zone.DNS Edit on protosweb.eu.
set -euo pipefail

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN (Zone DNS Edit for protosweb.eu)}"
ZONE_ID="${CLOUDFLARE_ZONE_ID:-76b7e8a0944ccdbca556b65956747930}"
API="https://api.cloudflare.com/client/v4"

cf_api() {
  local method="$1" path="$2" data="${3:-}"
  if [[ -n "$data" ]]; then
    curl -sS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      -X "$method" "${API}${path}" --data "$data"
  else
    curl -sS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      -X "$method" "${API}${path}"
  fi
}

echo "Verifying token can access DNS..."
resp="$(cf_api GET "/zones/${ZONE_ID}/dns_records?type=TXT&per_page=100")"
if ! echo "$resp" | python3 -c "import json,sys; d=json.load(sys.stdin); sys.exit(0 if d.get('success') else 1)"; then
  echo "ERROR: Cannot list DNS records. Use a dedicated Zone DNS Edit token." >&2
  echo "$resp" | python3 -m json.tool >&2 || echo "$resp" >&2
  exit 1
fi

export ZONE_ID API CLOUDFLARE_API_TOKEN
echo "$resp" | python3 << 'PY'
import json, os, subprocess, sys

data = json.load(sys.stdin)
records = data.get("result", [])
zone_id = os.environ["ZONE_ID"]
api = os.environ["API"]
token = os.environ["CLOUDFLARE_API_TOKEN"]

def cf(method, path, body=None):
    cmd = [
        "curl", "-sS",
        "-H", f"Authorization: Bearer {token}",
        "-H", "Content-Type: application/json",
        "-X", method,
        f"{api}{path}",
    ]
    if body is not None:
        cmd += ["--data", json.dumps(body)]
    out = subprocess.check_output(cmd)
    result = json.loads(out)
    if not result.get("success"):
        print(result, file=sys.stderr)
        raise SystemExit(1)
    return result

for r in records:
    name = r["name"]
    if name.endswith("_dmarc.protosweb.eu") or name == "_dmarc":
        want = "v=DMARC1; p=none; rua=mailto:dario.admin@protosweb.eu"
        if r["content"] != want:
            print(f"PATCH DMARC {r['id']}")
            cf("PATCH", f"/zones/{zone_id}/dns_records/{r['id']}", {"type": "TXT", "content": want})
        else:
            print("DMARC already correct")

brevo = [r for r in records if r["type"] == "TXT" and "brevo-code" in r["content"]]
keep = "brevo-code:360956dbf3c469b26dacf873722764d9"
for r in brevo:
    if r["content"] != keep:
        print(f"DELETE duplicate brevo {r['id']}")
        cf("DELETE", f"/zones/{zone_id}/dns_records/{r['id']}")

for r in records:
    if (name := r["name"]) in ("protosweb.eu", "protosweb.eu.") and r["type"] == "TXT" and r["content"].startswith("v=spf1"):
        want = "v=spf1 include:zohomail.eu include:spf.brevo.com ~all"
        if r["content"] != want:
            print(f"PATCH SPF {r['id']}")
            cf("PATCH", f"/zones/{zone_id}/dns_records/{r['id']}", {"type": "TXT", "content": want})
        else:
            print("SPF already correct")

print("Done.")
PY

echo "Verify: dig +short TXT _dmarc.protosweb.eu @1.1.1.1"
