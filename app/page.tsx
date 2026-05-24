"use client"

import { GitCommitVertical, SearchIcon } from "lucide-react";
import styles from "./page.module.css";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.centeringContainer}>
      <div className={styles.content}>
        <div className={styles.header}>
          <GitCommitVertical />
          <h1>GitSearch</h1>
        </div>
        <ButtonGroup className={styles.searchBar}>
          <Input placeholder="Search Github..." type="search" inputMode="search" onChange={e => setSearchQuery(e.target.value)} onKeyDown={(e) => {
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
      </div>
    </div>
  );
}
