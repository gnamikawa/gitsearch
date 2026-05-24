# GitSearch

A web application for searching GitHub repositories using the GitHub public search API. Results are paginated, deep-linkable via URL query parameters, and each result links out to the repository on GitHub.

> [!WARNING]
> This web application uses the public [Github API](https://docs.github.com/en/rest/search/search?apiVersion=2026-03-10#search-repositories). Navigating quickly through search results or paginating rapidly can exhaust the unauthenticated rate limit, causing searches to fail until the limit resets. If you run into this, wait a minute or two before attempting to navigate again.

## Features

- Search GitHub repositories by keyword
- Paginated results (up to 34 pages, reflecting GitHub's 1,000-result cap)
- URL-driven state — search queries and page numbers are stored in the URL

## Getting Started

### Prerequisites

- **Node.js** v20 or later
- **npm** v10 or later (bundled with Node.js)

If you use [Nix](https://nixos.org/), a `flake.nix` is included that provides a reproducible development shell with the correct Node.js version. Run `nix develop` to enter it.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/gnamikawa/gitsearch.git
cd gitsearch
npm install
```

### Running the Development Server

Run the below command, and then open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
npm run dev
```

## Running Tests

### All tests

This runs unit tests followed by end-to-end tests.

```bash
npm test
```

### Unit tests only

Unit tests use [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/).

```bash
npm run test:unit
```

### End-to-end tests only

End-to-end tests use [Playwright](https://playwright.dev/).

```bash
npm run test:e2e
```
