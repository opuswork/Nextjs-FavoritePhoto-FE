'use client';

import styles from './Title.module.css';

export default function Title({ text, as = 'h1' }) {
  const Heading = as;

  return (
    <div className={styles.wrapper}>
      <Heading className={styles.title}>{text}</Heading>
      <div className={styles.line} />
    </div>
  );
}
