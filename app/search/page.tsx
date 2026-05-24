'use client'

import { GitCommitVertical } from "lucide-react";
import styles from "./page.module.css";
import RepositorySearch from "./RepositorySearch";


export default function Search() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <GitCommitVertical />
        <h1>GitSearch</h1>
      </div>
      <RepositorySearch className={styles.search} />
    </div >
  );
}
