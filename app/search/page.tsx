'use client'

import { GitCommitVertical } from "lucide-react";
import styles from "./page.module.css";
import RepositorySearch from "./RepositorySearch";
import { useRouter } from "next/navigation";


export default function Search() {
  const { bfcacheId } = useRouter()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <GitCommitVertical />
        <h1>GitSearch</h1>
      </div>
      <RepositorySearch key={bfcacheId} className={styles.search} />
    </div >
  );
}
