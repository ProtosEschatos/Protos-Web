/**
 * API smoke tests — run with: npm test
 * Requires dev server or TEST_BASE_URL (default http://localhost:3000)
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'

const base = process.env.TEST_BASE_URL || 'http://localhost:3000'

test('GET / returns 200', async () => {
  const res = await fetch(base)
  assert.equal(res.status, 200)
})

test('POST /api/contact rejects empty body', async () => {
  const res = await fetch(`${base}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  assert.ok(res.status === 400 || res.status === 429)
})

test('POST /api/subscribe rejects invalid email', async () => {
  const res = await fetch(`${base}/api/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email' }),
  })
  assert.ok(res.status === 400 || res.status === 429)
})

test('GET /admin redirects or returns login', async () => {
  const res = await fetch(`${base}/admin`, { redirect: 'manual' })
  assert.ok([200, 307, 308].includes(res.status))
})

test('GET /robots.txt includes sitemap', async () => {
  const res = await fetch(`${base}/robots.txt`)
  const text = await res.text()
  assert.equal(res.status, 200)
  assert.match(text, /Sitemap:/i)
})
