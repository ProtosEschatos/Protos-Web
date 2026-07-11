import { expect, test } from '@playwright/test'

test.describe('Protos Web homepage', () => {
  test('renders styled hero and services grid after boot', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('protos-boot-gate-v11', '1')
      localStorage.setItem(
        'protos-site-consent-v1',
        JSON.stringify({
          termsAccepted: true,
          essential: true,
          termsVersion: '2026-07-11-v3',
        }),
      )
    })

    await page.goto('/hr', { waitUntil: 'networkidle' })

    await expect(page.locator('h1')).toContainText('Web stranice s dušom')

    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header).toHaveCSS('position', 'fixed')

    const servicesSection = page.locator('section').filter({ hasText: 'Što nudimo' })
    await expect(servicesSection).toBeVisible()

    const serviceCards = servicesSection.locator('.cosmic-panel')
    await expect(serviceCards.first()).toBeVisible()
    expect(await serviceCards.count()).toBeGreaterThanOrEqual(4)

    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(bodyBg).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('does not leave hero content at zero opacity', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('protos-boot-gate-v11', '1')
    })

    await page.goto('/hr', { waitUntil: 'domcontentloaded' })

    const heroHeading = page.locator('h1').first()
    await expect(heroHeading).toBeVisible()
    const opacity = await heroHeading.evaluate((el) => getComputedStyle(el).opacity)
    expect(Number(opacity)).toBeGreaterThan(0.5)
  })
})
