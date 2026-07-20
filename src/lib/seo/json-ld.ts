/**
 * Safe JSON-LD serializer for embedding inside `<script type="application/ld+json">`.
 *
 * `JSON.stringify` by itself does NOT escape `</script>`, `<!--`, or U+2028/U+2029.
 * If any of those appear inside our schema.org graph — either from user-generated
 * data (blog post title/description) or a copy-pasted quote — a browser can
 * break out of the script tag and execute arbitrary JavaScript (XSS).
 *
 * Every JSON-LD `<script>` in the app MUST route its payload through
 * `serializeJsonLd()` instead of raw `JSON.stringify(...)`.
 *
 * Reference: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
