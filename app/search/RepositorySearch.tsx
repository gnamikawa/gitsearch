"use client"

import { Empty } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./RepositorySearch.module.css";
import { ExternalLinkIcon, Ghost, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

function isGithubRepositoryRawData(data: unknown): data is {
  id: number;
  full_name: string;
  description: string | null;
  html_url: string;
} {
  if (typeof data !== 'object' || data === null) return false;

  const d = data as Record<string, unknown>;

  return (
    typeof d.id === 'number' &&
    typeof d.full_name === 'string' &&
    (typeof d.description === 'string' || d.description === null) &&
    typeof d.html_url === 'string'
  );
}

function mapToRepositoryItemProps(rawData: unknown): RepositoryItemProps {
  if (!isGithubRepositoryRawData(rawData)) {
    throw new Error(`Invalid repository json: ${JSON.stringify(rawData)}`);
  }

  return {
    id: String(rawData.id),
    header: rawData.full_name,
    description: rawData.description ?? '',
    url: rawData.html_url,
  };
}

export interface RepositoryItemProps {
  id: string;
  header: string;
  description: string;
  url: string;
}
export function RepositoryItem(props: RepositoryItemProps) {
  return (
    <li>
      <Item variant="outline" render={
        <a href={props.url} aria-label={props.header}>
          <ItemContent>
            <ItemTitle children={props.header} />
            <ItemDescription children={props.description} />
          </ItemContent>
          <ItemActions>
            <ExternalLinkIcon className="size-4" />
          </ItemActions>
        </a>
      } />
    </li >
  );
}

export interface RepositorySearchProps {
  className?: string;
}
export default function RepositorySearch(props: RepositorySearchProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const currentPage = useMemo(() => {
    const rawParam = searchParams.get("page");
    const output = rawParam ? Number.parseInt(rawParam) : undefined;
    return output;
  }, []);

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RepositoryItemProps[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const computeNewUrl = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/search?${params.toString()}`;
  }, [searchParams]);

  const fetchData = useCallback(async (searchQuery: string, page: number) => {
    const apiUrl = new URL("https://api.github.com/search/repositories");
    apiUrl.searchParams.append("q", searchQuery);
    apiUrl.searchParams.append("page", `${page}`);
    const data = await fetch(apiUrl);
    const json = await data.json();

    setSearchResults(json.items.map((item: unknown) => mapToRepositoryItemProps(item)));
    setTotalPages(json.total_count);
  }, [setSearchResults, setTotalPages]);

  useEffect(() => {
    if (query) {
      setSearchQuery(query)
    }
  }, []);

  useEffect(() => {
    if (query) {
      fetchData(query, currentPage ?? 1);
    }
    else {
      setSearchResults([]);
      setTotalPages(0);
    };
  }, [query, currentPage]);

  return (
    <div className={cn(props.className, styles.repositorySearch)}>
      <ButtonGroup className={styles.input}>
        <Input value={searchQuery} placeholder="Search Github..." type="search" inputMode="search" onChange={e => setSearchQuery(e.target.value)} onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const params = new URLSearchParams(searchParams.toString());
            params.set('q', searchQuery);
            params.set('page', "1");
            router.push(`/search?${params.toString()}`);
          }
        }} />
        <Button variant="outline" aria-label="Search">
          <SearchIcon />
        </Button>
      </ButtonGroup>
      {searchResults.length === 0 ? <Empty className={styles.emptyState}>
        <Ghost size={48} />
        No Results</Empty> : <ol className={styles.repositoryList} aria-label="Search Results">
        {searchResults.map(searchResult => <RepositoryItem key={searchResult.id} {...searchResult} />)}
      </ol>}
      <Pagination>
        {currentPage && totalPages !== 0 && (
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem key="previous">
                <PaginationPrevious href={computeNewUrl(currentPage - 1)} />
              </PaginationItem>
            )}

            <PaginationItem key="previouspage">
              {currentPage > 1 && (
                <PaginationLink href={computeNewUrl(currentPage - 1)}>
                  {currentPage - 1}
                </PaginationLink>
              )}
            </PaginationItem>

            <PaginationItem key="currentpage">
              <PaginationLink href={computeNewUrl(currentPage)} isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem key="nextpage">
              {currentPage < totalPages && (
                <PaginationLink href={computeNewUrl(currentPage + 1)}>
                  {currentPage + 1}
                </PaginationLink>
              )}
            </PaginationItem>

            <PaginationItem key="ellipsis">
              {currentPage < totalPages - 1 && <PaginationEllipsis />}
            </PaginationItem>

            {currentPage < totalPages && (
              <PaginationItem key="next">
                <PaginationNext href={computeNewUrl(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        )}
      </Pagination>
    </div >
  );
}
