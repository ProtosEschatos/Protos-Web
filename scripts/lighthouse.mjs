#!/usr/bin/env node
/**
 * Lighthouse audit helper — requires `npx lighthouse` and a running site.
 * Usage: TEST_BASE_URL=https://www.protosweb.eu node scripts/lighthouse.mjs
 */
import { spawn } from 'node:child_process'

const url = process.env.TEST_BASE_URL || 'http://localhost:3000'
const out = process.env.LIGHTHOUSE_OUTPUT || 'lighthouse-report.html'

const child = spawn(
  'npx',
  ['lighthouse', url, '--output=html', `--output-path=${out}`, '--chrome-flags=--headless'],
  { stdio: 'inherit', shell: true },
)

child.on('exit', (code) => {
  process.exit(code ?? 1)
})
