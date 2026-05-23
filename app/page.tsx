import { GitCommitVertical, SearchIcon } from "lucide-react";
import styles from "./page.module.css";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className={styles.centeringContainer}>
      <div className={styles.content}>
        <div className={styles.header}>
          <GitCommitVertical />
          <h1>GitSearch</h1>
        </div>
        <ButtonGroup className={styles.searchBar}>
          <Input placeholder="Search Github..." />
          <Button variant="outline" aria-label="Search">
            <SearchIcon />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
