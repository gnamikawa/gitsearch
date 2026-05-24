import { test, expect } from '@playwright/test'
import mockDataPage1 from '@/mocks/mockGithubResponsePage1.json';
import mockDataPage2 from '@/mocks/mockGithubResponsePage2.json';
import mockDataPage35 from '@/mocks/mockGithubResponsePage35.json';

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
          body: JSON.stringify(mockDataPage1),
        });
      } else if (url.includes(mockDataPage1.items[0].html_url)) {
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

    await page.goto('/');

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
          body: JSON.stringify(mockDataPage1),
        });
      } else if (url.includes(mockDataPage1.items[0].html_url)) {
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

    await page.goto('/search');

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

  test('can navigate to next page via pagination', async ({ page, context }) => {
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('http://localhost:3000')) {
        // Allow internal reroutes
        route.continue();
      } else if (url.includes("https://api.github.com/search/repositories")) {
        // Replace request with real github data
        const urlObject = new URL(url);
        const pageNumber = urlObject.searchParams.get("page");
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(pageNumber === "2" ? mockDataPage2 : mockDataPage1),
        });
      } else {
        // Prevent external web-requests to prevent flaky tests
        route.abort();
      }
    });

    await page.goto('/');

    const homepageSearchInput = page.getByRole("searchbox");
    await homepageSearchInput.fill("mock");
    await homepageSearchInput.press("Enter");

    // Page 1
    const firstPageFirstItem = page.getByRole("listitem").first();
    const firstPageFirstItemHeading = firstPageFirstItem.getByText(mockDataPage1.items[0].full_name);
    await expect(firstPageFirstItemHeading).toBeVisible();

    const activePageFirstPage = page.locator('[aria-current="page"]');
    await expect(activePageFirstPage).toHaveText('1');

    // Navigate
    const pagination = page.getByRole("navigation");
    const nextPageButton = pagination.getByText("Next");
    await nextPageButton.click();

    // Page 2
    const secondPageFirstItem = page.getByRole("listitem").first();
    const secondPageFirstItemHeading = secondPageFirstItem.getByText(mockDataPage2.items[0].full_name);
    await expect(secondPageFirstItemHeading).toBeVisible();

    const activePageSecondPage = page.locator('[aria-current="page"]');
    await expect(activePageSecondPage).toHaveText('2');
  })

  test('can navigate to previous page via pagination', async ({ page, context }) => {
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('http://localhost:3000')) {
        // Allow internal reroutes
        route.continue();
      } else if (url.includes("https://api.github.com/search/repositories")) {
        // Replace request with real github data
        const urlObject = new URL(url);
        const pageNumber = urlObject.searchParams.get("page");
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(pageNumber === "2" ? mockDataPage2 : mockDataPage1),
        });
      } else {
        // Prevent external web-requests to prevent flaky tests
        route.abort();
      }
    });

    await page.goto('/search?q=mock&page=2');

    // Page 2
    const secondPageFirstItem = page.getByRole("listitem").first();
    const secondPageFirstItemHeading = secondPageFirstItem.getByText(mockDataPage2.items[0].full_name);
    await expect(secondPageFirstItemHeading).toBeVisible();

    const activePageSecondPage = page.locator('[aria-current="page"]');
    await expect(activePageSecondPage).toHaveText('2');

    // Navigate
    const pagination = page.getByRole("navigation");
    const nextPageButton = pagination.getByText("Previous");
    await nextPageButton.click();

    // Page 1
    const firstPageFirstItem = page.getByRole("listitem").first();
    const firstPageFirstItemHeading = firstPageFirstItem.getByText(mockDataPage1.items[0].full_name);
    await expect(firstPageFirstItemHeading).toBeVisible();

    const activePageFirstPage = page.locator('[aria-current="page"]');
    await expect(activePageFirstPage).toHaveText('1');
  })

  test('will only render up to 34 pages', async ({ page, context }) => {
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('http://localhost:3000')) {
        // Allow internal reroutes
        route.continue();
      } else if (url.includes("https://api.github.com/search/repositories")) {
        // Replace request with real github data
        const urlObject = new URL(url);
        const pageNumber = urlObject.searchParams.get("page");
        const page34 = {
          "total_count": 1000, // 1000 is the max number of items that github will serve
          "incomplete_results": false,
          "items": [ // We dont need items except 1. We simply need to check that page 35 does not render without having no items.
            mockDataPage1.items[0]
          ]
        };
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(pageNumber === "34" ? page34 : mockDataPage35),
        });
      } else {
        // Prevent external web-requests to prevent flaky tests
        route.abort();
      }
    });


    // Page 34
    await page.goto('/search?q=mock&page=34');
    const activePageFirstPage = page.locator('[aria-current="page"]');
    await expect(page.getByText('Next')).not.toBeVisible();
    await expect(page.getByText('Prev')).toBeVisible();
    await expect(activePageFirstPage).toHaveText('34');

    // Page 35
    await page.goto('/search?q=mock&page=35');
    const errorText = page.getByText('error');
    await expect(errorText).toBeVisible();
  })

  test('will not render pages under page 1', async ({ page, context }) => {
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('http://localhost:3000')) {
        // Allow internal reroutes
        route.continue();
      } else if (url.includes("https://api.github.com/search/repositories")) {
        // Replace request with real github data
        const urlObject = new URL(url);
        const pageNumber = urlObject.searchParams.get("page");
        const page34 = {
          "total_count": 1000, // 1000 is the max number of items that github will serve
          "incomplete_results": false,
          "items": [ // We dont need items except 1. We simply need to check that page 35 does not render without having no items.
            mockDataPage1.items[0]
          ]
        };
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(pageNumber === "34" ? page34 : mockDataPage35),
        });
      } else {
        // Prevent external web-requests to prevent flaky tests
        route.abort();
      }
    });


    // Page 34
    await page.goto('/search?q=mock&page=34');
    const activePageFirstPage = page.locator('[aria-current="page"]');
    await expect(page.getByText('Next')).not.toBeVisible();
    await expect(page.getByText('Prev')).toBeVisible();
    await expect(activePageFirstPage).toHaveText('34');

    // Page 35
    await page.goto('/search?q=mock&page=35');
    const errorText = page.getByText('error');
    await expect(errorText).toBeVisible();
  })

})
