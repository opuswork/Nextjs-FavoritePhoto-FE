'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import MyCard from '@/components/organisms/MyCard/MyCard';
import TextBox from '@/components/atoms/TextBox/TextBox';
import Button from '@/components/atoms/Button/Button';
import styles from './page.module.css';

const STORAGE_OFFER_KEY = 'marketplace_exchange_offer_card';
const STORAGE_PENDING_KEY = 'marketplace_pending_exchange';

export default function MarketplaceExchangeInputPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params?.cardId;
  const [exchangeMessage, setExchangeMessage] = useState('');
  const [exchangeCardData, setExchangeCardData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_OFFER_KEY) : null;
    if (!raw) {
      if (cardId) router.replace(`/marketplace/${cardId}`);
      return;
    }
    try {
      setExchangeCardData(JSON.parse(raw));
    } catch {
      if (cardId) router.replace(`/marketplace/${cardId}`);
    }
    setMounted(true);
  }, [cardId, router]);

  const handleBack = () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_OFFER_KEY);
    router.push(`/marketplace/${cardId}`);
  };

  const handleCancel = () => {
    setExchangeMessage('');
    handleBack();
  };

  const handleExchange = () => {
    if (!exchangeCardData) return;
    const payload = {
      ...exchangeCardData,
      proposalMessage: exchangeMessage,
      purchaseInfo: `${exchangeCardData.price}에 구매`,
      id: Date.now(),
    };
    try {
      sessionStorage.setItem(STORAGE_PENDING_KEY, JSON.stringify(payload));
    } catch {}
    setExchangeMessage('');
    sessionStorage.removeItem(STORAGE_OFFER_KEY);
    router.push(`/marketplace/${cardId}`);
  };

  if (!mounted || !exchangeCardData) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header: back + "포토카드 교환하기" */}
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <Image src="/assets/icons/ic_back.svg" alt="뒤로가기" width={22} height={22} />
        </button>
        <h1 className={styles.headerTitle}>포토카드 교환하기</h1>
        <div className={styles.headerSpacer} aria-hidden />
      </div>

      <div className={styles.content}>
        {/* Card Title */}
        <div className={styles.cardTitleBox}>
          <h2
            className={styles.cardTitle}
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '40px',
              lineHeight: '100%',
              color: '#ffffff',
              margin: 0,
              paddingBottom: '20px',
            }}
          >
            {exchangeCardData.description || 'How Far I\'ll Go'}
          </h2>
        </div>

        {/* Main: leftColumn (MyCard) + rightColumn (form + buttons) */}
        <div className={styles.mainContentArea}>
          <div className={styles.leftColumn}>
            <MyCard
              rarity={exchangeCardData.rarity || 'SUPER RARE'}
              category={exchangeCardData.category || '풍경'}
              owner={exchangeCardData.owner || '랍스타'}
              description={exchangeCardData.description || 'How Far I\'ll Go'}
              price={exchangeCardData.price || '4 P'}
              quantity={exchangeCardData.quantity ?? 2}
              imageSrc={exchangeCardData.imageSrc || '/assets/products/photo-card-tree-with-lake.svg'}
            />
          </div>

          <div className={styles.rightColumn}>
            <h3 className={styles.proposalTitle}>교환 제시 내용</h3>
            <TextBox
              label=""
              value={exchangeMessage}
              placeholder="내용을 입력해 주세요"
              onChange={setExchangeMessage}
              className={styles.proposalTextBox}
              wrapperStyle={{ width: '100%', gap: 0 }}
              textareaStyle={{ width: '100%', minHeight: '200px' }}
            />
            <div className={styles.actionButtons}>
              <Button onClick={handleCancel} className={styles.cancelButton}>
                취소하기
              </Button>
              <Button onClick={handleExchange} className={styles.exchangeButton}>
                교환하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
