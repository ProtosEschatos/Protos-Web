#!/usr/bin/env node
/**
 * Generates src/messages/sr.json (Serbian, Cyrillic script) from hr.json.
 *
 * Method: Croatian and Serbian are extremely close (Shtokavian), so this is a
 * transliteration of the existing Croatian copy rather than a fresh
 * translation — with a small curated list of lexical fixes for the handful
 * of words that genuinely differ (month names, "tjedan"→"nedelja"), and a
 * protected list of brand/tech proper nouns that stay in Latin script (the
 * normal convention on Serbian Cyrillic tech sites).
 *
 * Re-run after editing hr.json: `node scripts/generate-sr-locale.mjs`
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const HR_PATH = path.join(__dirname, '../src/messages/hr.json')
const SR_PATH = path.join(__dirname, '../src/messages/sr.json')

/**
 * Curated Croatian → Serbian lexical fixes, applied (Latin-to-Latin) after
 * protected terms are masked out. Includes genuine HR/SR vocabulary
 * differences (month names, "tjedan"→"nedelja") and phonetic Serbian
 * spellings for English loanwords that Croatian keeps in original spelling
 * (web, wireframe, showcase…) — Serbian conventionally transliterates these
 * phonetically rather than leaving Latin letters like w/y stranded inside
 * otherwise-Cyrillic words.
 */
const LEXICAL_FIXES = [
  [/11\. srpnja 2026\./g, '11. jula 2026.'],
  [/tjedna/gi, 'nedelje'],
  [/tjedni/gi, 'nedelje'],
  [/tjedan/gi, 'nedelju'],
  [/\bwireframe/gi, 'vajerfrejm'],
  [/\bshowcase/gi, 'šoukejs'],
  [/\bjoystick/gi, 'džojstik'],
  [/\bcyber/gi, 'sajber'],
  [/\blightweight/gi, 'lajtvejt'],
  [/\bwebshop/gi, 'vebšop'],
  [/\bnewsletter/gi, 'njuzleter'],
  [/\bcrawling/gi, 'kroling'],
  [/\bgallery/gi, 'galerija'],
  [/\bweb/gi, 'veb'],
]

/** Preserves the case pattern of `original` when substituting `replacement`. */
function matchCase(original, replacement) {
  if (original === original.toUpperCase()) return replacement.toUpperCase()
  if (original[0] === original[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }
  return replacement
}

/**
 * Brand/tech proper nouns kept in Latin script inside otherwise-Cyrillic text
 * — standard convention on Serbian Cyrillic tech/business sites.
 */
const PROTECTED_TERMS = [
  'Protos Web Mark23',
  'Protos Web',
  'Bodulica Shop',
  'Bodulica',
  'Next.js',
  'React',
  'Three.js',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Framer Motion',
  'WebGL',
  'Stripe',
  'DeepSeek',
  'Gemini',
  'Supabase',
  'Vercel',
  'GitHub',
  'Cloudflare',
  'Zoho',
  'Resend',
  'Brevo',
  'Sentry',
  'WhatsApp',
  'Instagram',
  'Facebook',
  'TikTok',
  'Upwork',
  'goLance.com',
  'goLance',
  'Freelancer.com',
  'Malt.com',
  'Guru.com',
  'PeoplePerHour',
  'Hubstaff Talent',
  'Jobbers.io',
  'Cursor',
  'GDPR',
  'OIB',
  'UI/UX',
  'UI',
  'UX',
  'SEO',
  'AI',
  '3D',
  'CRM',
  'SaaS',
  'CTA',
  'JSON-LD',
  'protosweb.eu',
  'www.protosweb.eu',
]

// Digraphs first (longest match), then single-letter diacritics, then plain Latin.
const DIGRAPHS = [
  ['Dž', 'Џ'], ['DŽ', 'Џ'], ['dž', 'џ'],
  ['Lj', 'Љ'], ['LJ', 'Љ'], ['lj', 'љ'],
  ['Nj', 'Њ'], ['NJ', 'Њ'], ['nj', 'њ'],
]

const SINGLE_MAP = {
  Č: 'Ч', č: 'ч', Ć: 'Ћ', ć: 'ћ', Đ: 'Ђ', đ: 'ђ', Š: 'Ш', š: 'ш', Ž: 'Ж', ž: 'ж',
  A: 'А', a: 'а', B: 'Б', b: 'б', C: 'Ц', c: 'ц', D: 'Д', d: 'д', E: 'Е', e: 'е',
  F: 'Ф', f: 'ф', G: 'Г', g: 'г', H: 'Х', h: 'х', I: 'И', i: 'и', J: 'Ј', j: 'ј',
  K: 'К', k: 'к', L: 'Л', l: 'л', M: 'М', m: 'м', N: 'Н', n: 'н', O: 'О', o: 'о',
  P: 'П', p: 'п', R: 'Р', r: 'р', S: 'С', s: 'с', T: 'Т', t: 'т', U: 'У', u: 'у',
  V: 'В', v: 'в', Z: 'З', z: 'з',
}

const digraphPattern = new RegExp(DIGRAPHS.map(([latin]) => latin).join('|'), 'g')
const digraphMap = new Map(DIGRAPHS)

function transliterate(text) {
  const withDigraphs = text.replace(digraphPattern, (match) => digraphMap.get(match) ?? match)
  let out = ''
  for (const ch of withDigraphs) {
    out += SINGLE_MAP[ch] ?? ch
  }
  return out
}

const protectedSorted = [...PROTECTED_TERMS].sort((a, b) => b.length - a.length)
const protectedPattern = new RegExp(
  protectedSorted.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'g',
)

// Emails must never be transliterated — a Cyrillic mailto: address is dead.
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/g

function convertString(value) {
  // Mask emails and protected brand/tech terms first so lexical fixes and
  // transliteration never touch them (e.g. "Web" inside "Protos Web", or any
  // "name@domain" address).
  const placeholders = []
  const maskWith = (text, pattern) =>
    text.replace(pattern, (match) => {
      placeholders.push(match)
      return `\u0000${placeholders.length - 1}\u0000`
    })

  const masked = maskWith(maskWith(value, EMAIL_PATTERN), protectedPattern)

  let latin = masked
  for (const [pattern, replacement] of LEXICAL_FIXES) {
    latin = latin.replace(pattern, (match) => matchCase(match, replacement))
  }

  const transliterated = transliterate(latin)

  return transliterated.replace(/\u0000(\d+)\u0000/g, (_, idx) => placeholders[Number(idx)])
}

function convert(node) {
  if (typeof node === 'string') return convertString(node)
  if (Array.isArray(node)) return node.map(convert)
  if (node && typeof node === 'object') {
    const result = {}
    for (const [key, value] of Object.entries(node)) {
      result[key] = convert(value)
    }
    return result
  }
  return node
}

const hr = JSON.parse(readFileSync(HR_PATH, 'utf8'))
const sr = convert(hr)
writeFileSync(SR_PATH, JSON.stringify(sr, null, 2) + '\n', 'utf8')
console.log(`Wrote ${SR_PATH}`)
