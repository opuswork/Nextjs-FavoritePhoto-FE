'use client';

import Button from '@/components/atoms/Button/Button';
import styles from './page.module.css';

export default function MarketplaceSellSuccessPage({ onButtonClick, cardData }) {
    const quantity = cardData?.quantity || cardData?.initialQuantity || 1;
    const rarity = cardData?.rarity || cardData?.grade || 'LEGENDARY';
    const title = cardData?.title || cardData?.description || '우리집 앞마당';
    
    return (
      <div className={styles.successContainer}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            판매 등록 <span className={styles.highlight}>성공</span>
          </h1>
          <p className={styles.description}>
            [{rarity} | {title}] {quantity}장 판매 등록에 성공했습니다!
          </p>
          <div className={styles.buttonContainer}>
            <Button 
              onClick={onButtonClick} 
              className={styles.button}
              style={{ 
                backgroundColor: '#000000', 
                color: '#ffffff', 
                border: '1px solid #ffffff',
                width: '100%',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '4px',
                cursor: 'pointer',
              }}>
              나의 판매 포토카드에서 확인하기
            </Button>
          </div>
        </div>
      </div>
    );
  }