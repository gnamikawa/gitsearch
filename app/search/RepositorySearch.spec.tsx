import { vi, describe, it, afterEach, expect } from "vitest";
import { screen, render, waitFor, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { useSearchParams, useRouter } from 'next/navigation';
import RepositorySearch, { RepositoryItem } from "./RepositorySearch";
import mockData from './mockGithubResponse.json';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

describe("RepositoryItem", () => {
  const mockRepo = {
    id: "1",
    header: `Test Repo 1`,
    description: "A test repository",
    url: "https://example.test"
  };

  it("renders without crashing", () => {
    render(< RepositoryItem {...mockRepo} />);
  });

  it("renders description", () => {
    render(< RepositoryItem {...mockRepo} />);
    expect(screen.getByText(mockRepo.description)).toBeTruthy()
  });

  it("renders title", () => {
    render(< RepositoryItem {...mockRepo} />);
    expect(screen.getByText(mockRepo.header)).toBeTruthy()
  });

  it("resolves to the correct url", () => {
    render(< RepositoryItem {...mockRepo} />);

    const searchCard = screen.getByText(mockRepo.header);
    userEvent.click(searchCard);
    const link = screen.getByRole('link', { name: mockRepo.header });

    expect(link.getAttribute('href')).toBe(mockRepo.url);
  });
});

describe("RepositorySearch", () => {
  const mockPush = vi.fn();

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as any);
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    render(<RepositorySearch />);
  });

  it("renders the correct number of repositories from mock data", async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams({ q: 'mock', page: '1' }) as any
    );
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    }));

    render(<RepositorySearch />);

    await waitFor(() => {
      const repositoryList = screen.getByRole("list", { name: "Search Results" });
      const repositoryItems = within(repositoryList).getAllByRole('listitem');
      expect(repositoryItems).toHaveLength(mockData.items.length);
    });
  });

  it("renders the empty state", async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams({ q: 'test', page: '1' }) as any
    );
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], total_count: 0 }),
    }));

    render(<RepositorySearch />);

    await waitFor(() => {
      expect(screen.getByText('No Results')).toBeTruthy();
    });
  });

  it("navigates with updated query params on Enter", async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as any);
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    const user = userEvent.setup();

    render(<RepositorySearch />);

    await user.click(screen.getByRole('searchbox'));
    await user.keyboard('test');
    await user.keyboard('{Enter}');

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('q=test')
    );
  });
});
