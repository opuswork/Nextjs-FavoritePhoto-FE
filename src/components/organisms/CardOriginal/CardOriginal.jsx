'use client';
import styles from './CardOriginal.module.css';
import Image from 'next/image';
import Label from '../../atoms/Label/Label';

export default function CardOriginal({
  rarity = 'COMMON',
  category = '풍경',
  owner = '미쓰손',
  description = '우리집 앞마당 우리집 앞마당 우리집 ...',
  price = '4 P',
  remaining = 2,
  outof = 5,
  imageSrc = '/assets/products/photo-card.svg',
  onClick,
}) {
  return (
    <div className={styles.cardOriginal} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {/* Image Section */}
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt="Photo Card"
          width={400}
          height={400}
          className={styles.cardImage}
        />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Title */}
        <div className={styles.title}>{description}</div>

        {/* Metadata */}
        <div className={styles.metadata}>
          <div className={styles.metadataLeft}>
            <Label className={styles.rarity}>{rarity}</Label>
            <Label className={styles.separator}>|</Label>
            <Label className={styles.category}>{category}</Label>
          </div>
          <Label className={styles.owner}>{owner}</Label>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Price and Remaining */}
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <Label className={styles.infoLabel}>가격</Label>
            <Label className={styles.infoValue}>{price}</Label>
          </div>
          <div className={styles.infoRow}>
            <Label className={styles.infoLabel}>잔여</Label>
            <div className={styles.infoValue}>
                <Label className={styles.remaining}>{remaining}</Label>
                <Label className={styles.outof}> / {outof}</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Logo */}
      <div className={styles.footer}>
        <span className={styles.logo}>
          <Image src="/assets/logos/logo.svg" alt="Logo" width={100} height={100} className={styles.logo} />
        </span>
      </div>
    </div>
  );
}
