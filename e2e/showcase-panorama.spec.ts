import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const OUT_DIR = 'test-results/showcase-views'

async function startShowcase(page: import('@playwright/test').Page) {
  await page.goto('/portfolio-showcase')
  await page.getByRole('button', { name: /započni|start|erkundung|inizia|comenzar/i }).click()
  await page.waitForTimeout(2500)
}

// turnSpeed 0.05 rad/frame @ ~60fps → π/2 rad (90°) ≈ 530ms
const TURN_90_MS = 550

async function captureView(page: import('@playwright/test').Page, name: string, turnKeys: string[]) {
  for (const key of turnKeys) {
    await page.keyboard.down(key)
    await page.waitForTimeout(TURN_90_MS)
    await page.keyboard.up(key)
    await page.waitForTimeout(300)
  }
  const canvas = page.locator('canvas').first()
  await expect(canvas).toBeVisible()
  await page.waitForTimeout(500)
  await canvas.screenshot({ path: `${OUT_DIR}/showcase-${name}.png` })
}

test.describe('Synthwave 360 panorama views', () => {
  test.beforeAll(async () => {
    await mkdir(OUT_DIR, { recursive: true })
  })

  test('capture front, right, back, left views', async ({ page }) => {
    await startShowcase(page)

    // Front: heading 0, facing -Z (sun / grid road panel)
    await captureView(page, 'front', [])

    // Right: turn right with D (~90°)
    await captureView(page, 'right', ['KeyD'])

    // Back: another 180° total from front
    await captureView(page, 'back', ['KeyD', 'KeyD'])

    // Left: from back, turn left to complete circle check
    await captureView(page, 'left', ['KeyA'])
  })
})
