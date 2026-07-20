#!/usr/bin/env node
/**
 * i18n sync: propagate changes from `messages/hr.json` (and `messages/_legal/hr.json`)
 * to every target locale using DeepSeek Chat.
 *
 * Behavior
 * - Walks each source JSON tree, collects leaf strings with their JSON path.
 * - For each target locale, translates ONLY the leaves that are either
 *     (a) missing in the target file, or
 *     (b) present in the target but whose HR source value changed since the last sync
 *         (tracked via `messages/.hr-sync.json` fingerprint file).
 * - Preserves existing translations for unchanged keys — nothing is retranslated
 *   unless HR changed or the target key is missing.
 * - Serbian output is emitted in Cyrillic with Serbian vocabulary.
 *
 * Env
 * - DEEPSEEK_API_KEY — required
 *
 * Flags
 * - --dry-run          : compute plan, do not write files or call API
 * - --force            : ignore fingerprint and retranslate everything present in HR
 * - --locale <code>    : only run for one target locale (en|de|es|it|sr)
 * - --file <name>      : only run for one source file (`messages/hr.json` or `messages/_legal/hr.json`)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const MESSAGES_DIR = resolve(ROOT, 'src/messages')
const LEGAL_DIR = resolve(MESSAGES_DIR, '_legal')
const FINGERPRINT_PATH = resolve(MESSAGES_DIR, '.hr-sync.json')

const SOURCE_LOCALE = 'hr'
const TARGET_LOCALES = ['en', 'de', 'es', 'it', 'sr']

const LOCALE_META = {
  en: { language: 'English', script: 'Latin', notes: '' },
  de: { language: 'German', script: 'Latin', notes: 'Formal register (Sie).' },
  es: { language: 'Spanish', script: 'Latin', notes: 'Neutral Spanish, formal register (usted).' },
  it: { language: 'Italian', script: 'Latin', notes: 'Formal register (Lei).' },
  sr: {
    language: 'Serbian',
    script: 'Cyrillic',
    notes:
      'Cyrillic script only. Serbian vocabulary and month names (jul, avgust, poslednji, uvek, itd.). ' +
      'Preserve Croatian jurisdiction references (Republika Hrvatska, AZOP, OIB) — translate the surrounding language, not the legal entities.',
  },
}

const SOURCE_FILES = [
  { source: 'src/messages/hr.json', targetFor: (loc) => `src/messages/${loc}.json` },
  { source: 'src/messages/_legal/hr.json', targetFor: (loc) => `src/messages/_legal/${loc}.json` },
]

const args = new Set(process.argv.slice(2))
const flag = (name) => args.has(name)
function argValue(name) {
  const idx = process.argv.indexOf(name)
  return idx >= 0 && idx < process.argv.length - 1 ? process.argv[idx + 1] : null
}

const DRY_RUN = flag('--dry-run')
const FORCE = flag('--force')
const ONLY_LOCALE = argValue('--locale')
const ONLY_FILE = argValue('--file')

const targetLocales = ONLY_LOCALE
  ? TARGET_LOCALES.filter((l) => l === ONLY_LOCALE)
  : TARGET_LOCALES

if (targetLocales.length === 0) {
  console.error(`Unknown --locale ${ONLY_LOCALE}. Available: ${TARGET_LOCALES.join(', ')}`)
  process.exit(1)
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n')
}

function hash(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 16)
}

function collectLeaves(node, path = []) {
  if (typeof node === 'string') {
    return [{ path, value: node }]
  }
  if (Array.isArray(node)) {
    return node.flatMap((item, index) => collectLeaves(item, [...path, index]))
  }
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([key, value]) => collectLeaves(value, [...path, key]))
  }
  return []
}

function pathKey(path) {
  return path.map((segment) => (typeof segment === 'number' ? `[${segment}]` : segment)).join('.')
}

function getByPath(node, path) {
  let cursor = node
  for (const segment of path) {
    if (cursor === null || cursor === undefined) return undefined
    cursor = cursor[segment]
  }
  return cursor
}

function setByPath(node, path, value) {
  let cursor = node
  for (let i = 0; i < path.length - 1; i += 1) {
    const segment = path[i]
    const nextSegment = path[i + 1]
    if (cursor[segment] === undefined || cursor[segment] === null) {
      cursor[segment] = typeof nextSegment === 'number' ? [] : {}
    }
    cursor = cursor[segment]
  }
  cursor[path[path.length - 1]] = value
}

function chunk(array, size) {
  const out = []
  for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size))
  return out
}

async function callDeepSeek(system, user) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY is not set')

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`DeepSeek API ${response.status}: ${body.slice(0, 500)}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error(`DeepSeek returned no content: ${JSON.stringify(data).slice(0, 500)}`)
  }

  let parsed
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error(`DeepSeek returned non-JSON content: ${content.slice(0, 500)}`)
  }

  if (!Array.isArray(parsed.translations)) {
    throw new Error(`DeepSeek response missing "translations" array: ${content.slice(0, 500)}`)
  }
  return parsed.translations
}

async function translateStrings(values, targetLocale) {
  const meta = LOCALE_META[targetLocale]
  const scriptNote = meta.script === 'Cyrillic' ? ' (Cyrillic script)' : ''

  const system = [
    `You are a professional Croatian → ${meta.language}${scriptNote} translator for a Croatian web-agency site (Protos Web).`,
    'Domain: marketing UI copy, legal terms (GDPR, IP), general web copy.',
    'Register: professional, clear, business-appropriate. Match the tone of the source.',
    '',
    'Hard rules:',
    '- Return STRICT JSON with shape {"translations": string[]}. The array length MUST equal the input length and order MUST match.',
    '- Do NOT translate: proper nouns (Protos Web, Dario Imsirović, Martina Markulin, Mark23), OIB numbers, email addresses, URLs, HTML/Markdown tags, code identifiers, JSON escape sequences, technical acronyms (GDPR, JSON-LD, R3F, UI, UX, DNS, IMAP, SEO, CMS, API, SDK).',
    '- Preserve punctuation, quotation marks, escape characters (\\", \\n), and line breaks exactly.',
    '- Adapt date formats to the target language conventions (e.g., "11. srpnja 2026." → English "July 11, 2026").',
    '- Preserve Croatian legal jurisdiction references verbatim as legal entities: "Republika Hrvatska", "AZOP", "OIB", street/city names in Croatia.',
    meta.notes ? `- Locale note: ${meta.notes}` : '',
    '',
    'Do NOT add commentary, headers, or code fences. Return ONLY the JSON object.',
  ]
    .filter(Boolean)
    .join('\n')

  const user = [
    `Translate each Croatian string to ${meta.language}${scriptNote}.`,
    'Return {"translations": [<same order and length as input>]}.',
    '',
    'Input:',
    JSON.stringify({ strings: values }, null, 2),
  ].join('\n')

  return callDeepSeek(system, user)
}

async function translateInBatches(values, targetLocale, batchSize = 24) {
  const batches = chunk(values, batchSize)
  const results = []
  for (const [index, batch] of batches.entries()) {
    process.stdout.write(`    batch ${index + 1}/${batches.length} (${batch.length} strings)... `)
    const translated = await translateStrings(batch, targetLocale)
    if (translated.length !== batch.length) {
      throw new Error(
        `Batch length mismatch: expected ${batch.length}, got ${translated.length}. Retry with smaller batch.`,
      )
    }
    results.push(...translated)
    process.stdout.write('ok\n')
  }
  return results
}

function loadFingerprint() {
  if (!existsSync(FINGERPRINT_PATH)) return {}
  try {
    return JSON.parse(readFileSync(FINGERPRINT_PATH, 'utf8'))
  } catch {
    return {}
  }
}

function saveFingerprint(fp) {
  if (DRY_RUN) return
  mkdirSync(dirname(FINGERPRINT_PATH), { recursive: true })
  writeJson(FINGERPRINT_PATH, fp)
}

async function syncFile({ source, targetFor }) {
  const absSource = resolve(ROOT, source)
  if (!existsSync(absSource)) {
    console.log(`  ${source}: source not found, skipping.`)
    return { changed: false }
  }

  console.log(`\n${source}`)
  const sourceJson = readJson(absSource)
  const sourceLeaves = collectLeaves(sourceJson)

  const fingerprint = loadFingerprint()
  const fileFp = fingerprint[source] ?? {}
  const newFileFp = {}
  for (const leaf of sourceLeaves) {
    newFileFp[pathKey(leaf.path)] = hash(leaf.value)
  }

  let overallChanged = false

  for (const targetLocale of targetLocales) {
    const relTarget = targetFor(targetLocale)
    const absTarget = resolve(ROOT, relTarget)
    const targetJson = existsSync(absTarget) ? readJson(absTarget) : Array.isArray(sourceJson) ? [] : {}

    const toTranslate = []
    for (const leaf of sourceLeaves) {
      const key = pathKey(leaf.path)
      const targetValue = getByPath(targetJson, leaf.path)
      const hasTarget = typeof targetValue === 'string' && targetValue.length > 0
      const previousHash = fileFp[key]
      const currentHash = newFileFp[key]
      const changedInSource = previousHash !== undefined && previousHash !== currentHash
      const missingInTarget = !hasTarget
      const shouldTranslate = FORCE || missingInTarget || changedInSource
      if (shouldTranslate) toTranslate.push(leaf)
    }

    if (toTranslate.length === 0) {
      console.log(`  ${targetLocale}: up to date`)
      continue
    }

    console.log(`  ${targetLocale}: translating ${toTranslate.length} string(s)`)
    if (DRY_RUN) {
      for (const leaf of toTranslate) {
        console.log(`    ${pathKey(leaf.path)}: ${JSON.stringify(leaf.value).slice(0, 80)}`)
      }
      continue
    }

    const translated = await translateInBatches(
      toTranslate.map((leaf) => leaf.value),
      targetLocale,
    )
    for (const [index, leaf] of toTranslate.entries()) {
      setByPath(targetJson, leaf.path, translated[index])
    }

    writeJson(absTarget, targetJson)
    overallChanged = true
  }

  fingerprint[source] = newFileFp
  saveFingerprint(fingerprint)
  return { changed: overallChanged }
}

async function main() {
  const files = ONLY_FILE
    ? SOURCE_FILES.filter((entry) => entry.source === ONLY_FILE || entry.source.endsWith(ONLY_FILE))
    : SOURCE_FILES

  if (files.length === 0) {
    console.error(`Unknown --file ${ONLY_FILE}`)
    process.exit(1)
  }

  console.log(
    `i18n sync — source: ${SOURCE_LOCALE}, targets: ${targetLocales.join(', ')}${DRY_RUN ? ' (dry run)' : ''}${FORCE ? ' (force)' : ''}`,
  )

  let anyChange = false
  for (const file of files) {
    const result = await syncFile(file)
    if (result.changed) anyChange = true
  }

  if (!anyChange) {
    console.log('\nNothing to update.')
  } else {
    console.log('\nDone.')
  }
}

main().catch((error) => {
  console.error(error?.stack ?? error?.message ?? String(error))
  process.exit(1)
})
