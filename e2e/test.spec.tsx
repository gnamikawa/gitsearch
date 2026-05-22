import { test, expect } from '@playwright/test'

test.describe('Page', () => {
  test('loads', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('To get started, edit the page.tsx file.')).toBeVisible()
  })
})
