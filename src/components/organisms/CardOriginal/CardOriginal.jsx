'use client';
import styles from './CardOriginal.module.css';
import Image from 'next/image';

export default function CardOriginal() {
  return (
    <div className={styles.cardOriginal}>
      {/* Image Section */}
      <div className={styles.imageContainer}>
        <Image
          src="/assets/products/photo-card.svg"
          alt="Photo Card"
          width={400}
          height={400}
          className={styles.cardImage}
        />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Title */}
        <div className={styles.title}>우리집 앞마당 우리집 앞마당 우리집 ...</div>

        {/* Metadata */}
        <div className={styles.metadata}>
          <div className={styles.metadataLeft}>
            <span className={styles.rarity}>COMMON</span>
            <span className={styles.separator}>|</span>
            <span className={styles.category}>풍경</span>
          </div>
          <span className={styles.owner}>미쓰손</span>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Price and Remaining */}
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>가격</span>
            <span className={styles.infoValue}>4 P</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>잔여</span>
            <span className={styles.infoValue}>2 / 5</span>
          </div>
        </div>
      </div>

      {/* Footer Logo */}
      <div className={styles.footer}>
        <span className={styles.logo}>
          최애<span className={styles.logoAccent}>의</span>포토
        </span>
      </div>
    </div>
  );
}
