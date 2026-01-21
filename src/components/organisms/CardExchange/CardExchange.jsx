'use client';
import styles from './CardExchange.module.css';
import Image from 'next/image';
import Label from '../../atoms/Label/Label';
import Button from '../../atoms/Button/Button';

export default function CardExchange({
  title,
  rarity,
  category,
  price,
  owner,
  exchangeMessage,
  onDecline,
  onApprove,
}) {
  return (
    <div className={styles.cardExchange}>
      {/* Image Section */}
      <div className={styles.imageContainer}>
        <Image
          src="/assets/products/photo-card-exchange.svg"
          alt="Photo Card"
          width={400}
          height={400}
          className={styles.cardImage}
        />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Title */}
        <div className={styles.title}>{title}</div>

        {/* Metadata */}
        <div className={styles.metadata}>
          <div className={styles.metadataLeft}>
            <Label className={styles.rarity}>{rarity}</Label>
            <Label className={styles.separator}>|</Label>
            <Label className={styles.category}>{category}</Label>
            <Label className={styles.priceInfo}>{price} 에 구매</Label>
          </div>
          <Label className={styles.owner}>{owner}</Label>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Exchange Message */}
        <div className={styles.exchangeMessage}>{exchangeMessage}</div>
      </div>

      {/* Action Buttons */}
      <div className={styles.buttonContainer}>
        <Button className={styles.declineButton} onClick={onDecline}>
          거절하기
        </Button>
        <Button className={styles.approveButton} onClick={onApprove}>
          승인하기
        </Button>
      </div>
    </div>
  );
}
