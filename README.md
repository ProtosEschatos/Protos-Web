# Protos Web (ARCHIVED — Next.js)

> **ZAMRZNUTO.** Produkcija je **Vue** repo:  
> **https://github.com/ProtosEschatos/Protos-Web-Vue**  
> Live: **https://protosweb.eu** (Cloudflare Pages)  
> Preview: **https://protos-web-vue.pages.dev**

Ovaj repo (`Protos-Web`) je stari **Next.js** stack. Ne deployaj ga. Vercel git je disconnected; domena više nije na Vercelu.

---

## Legacy (referenca only)

Agency site — historically deployed from this repo to Vercel.

**Repo:** https://github.com/ProtosEschatos/Protos-Web  
**Backend (shared):** Supabase `laqnnzavwbojntfiqmxj`

### Old stack

Next.js 16, React 19, TypeScript, Tailwind, Framer Motion, React Three Fiber, Lenis, next-intl 4.

### Where production lives now

| Što | Gdje |
|-----|------|
| Site (Vue) | Cloudflare Pages `protos-web-vue` |
| DNS | Cloudflare |
| Baza, Storage, Edge Functions | Supabase |
| Canonical repo | [Protos-Web-Vue](https://github.com/ProtosEschatos/Protos-Web-Vue) |

Do not push deploy hooks here. Do not reconnect Vercel to this repo for `protosweb.eu`.
