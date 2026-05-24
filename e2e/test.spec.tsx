import { test, expect } from '@playwright/test'
import mockData from '@/mocks/mockGithubResponse.json';

test.describe('Page', () => {
  test('can search from the homepage and navigate to an external website (github) in a new tab', async ({ page, context }) => {
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('http://localhost:3000')) {
        // Allow internal reroutes
        route.continue();
      } else if (url.includes("https://api.github.com/search/repositories")) {
        // Replace request with real github data
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockData),
        });
      } else if (url.includes(mockData.items[0].html_url)) {
        // Replace request to github with a simple "success"
        route.fulfill({
          status: 200,
          body: "success"
        });
      } else {
        // Prevent external web-requests to prevent flaky tests
        route.abort();
      }
    });

    await page.goto('/')

    const homepageSearchInput = page.getByRole("searchbox");
    await homepageSearchInput.fill("mock");
    await homepageSearchInput.press("Enter");
    const firstSearchResult = page.getByRole("listitem").first();

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      firstSearchResult.click({ button: "left" })
    ]);

    await newPage.waitForLoadState();
    const interceptPage = newPage.getByText("success");

    await expect(interceptPage).toHaveText("success");
  })

  test('can search from the search page and navigate to an external website (github) in a new tab', async ({ page, context }) => {
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('http://localhost:3000')) {
        // Allow internal reroutes
        route.continue();
      } else if (url.includes("https://api.github.com/search/repositories")) {
        // Replace request with real github data
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockData),
        });
      } else if (url.includes(mockData.items[0].html_url)) {
        // Replace request to github with a simple "success"
        route.fulfill({
          status: 200,
          body: "success"
        });
      } else {
        // Prevent external web-requests to prevent flaky tests
        route.abort();
      }
    });

    await page.goto('/search')

    const homepageSearchInput = page.getByRole("searchbox");
    await homepageSearchInput.fill("mock");
    await homepageSearchInput.press("Enter");
    const firstSearchResult = page.getByRole("listitem").first();

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      firstSearchResult.click({ button: "left" })
    ]);

    await newPage.waitForLoadState();
    const interceptPage = newPage.getByText("success");

    await expect(interceptPage).toHaveText("success");
  })
})
