'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import CardBuyer from '@/components/organisms/CardBuyer/CardBuyer';
import Button from '@/components/atoms/Button/Button';
import Modal from '@/components/atoms/Modal/Modal';
import { sampleCards } from '../sampleCards';
import styles from './page.module.css';
import purchaseModalStyles from './PurchaseConfirmModal.module.css';

export default function MarketplaceCardPurchasePage() {
  const params = useParams();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Find card data from sampleCards based on cardId
  const cardId = parseInt(params?.cardId || '1');
  const cardData = useMemo(() => {
    return sampleCards.find(card => card.id === cardId) || sampleCards[0];
  }, [cardId]);
  
  // Sample data for the main card - using cardData from sampleCards directly
  const mainCardData = {
    ...cardData, // Use all fields from cardData directly
    // Additional fields for modal/exchange functionality (not in sampleCards)
    secondRarity: 'RARE',
    secondCategory: '풍경',
    secondDescription: '푸릇푸릇한 여름 풍경, 눈 많이 내린 겨울 풍경 사진에 관심이 많습니다.',
    title: cardData.description, // Use description as title
    maxQuantity: cardData.remaining,
    initialQuantity: 1,
    grade: 'COMMON',
    genre: cardData.category,
    exchangeDescription: '',
  };

  // Calculate total price
  const priceValue = parseInt(cardData.price.replace(' P', ''));
  const totalPrice = `${priceValue * quantity} P (${quantity}장)`;


  const handlePurchase = () => {
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseConfirm = () => {
    // 실제 구매 로직 처리
    console.log('Purchase confirmed', { cardId, quantity, cardData });
    setIsPurchaseModalOpen(false);
    // TODO: 구매 성공/실패 처리
  };

  const handleExchange = () => {
    console.log('Exchange clicked');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* 1. Page Title "마켓플레이스" */}
        <div className={styles.pageTitle}>마켓플레이스</div>

        {/* 2. Card Title Box "우리집 앞마당" */}
        <div className={styles.cardTitleBox}>
          <h1
            className={styles.cardTitle}
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: '100%',
              color: '#ffffff',
              margin: 0,
              paddingBottom: '20px',
            }}
          >
            {cardData.description}
          </h1>
        </div>

        {/* 3. Space between title and main content (50px) */}
        <div className={styles.spacing50}></div>

        {/* 4. Main Card Content Area (Two-Column Layout) */}
        <div className={styles.mainContentArea}>
          {/* Left Column - Photo Card Image */}
          <div className={styles.leftColumn}>
            <Image
              src={cardData.imageSrc || "/assets/products/photo-card.svg"}
              alt={`${cardData.description} 포토카드`}
              width={820}
              height={620}
              className={styles.cardImage}
            />
          </div>

          {/* Right Column - CardBuyer Component */}
          <div className={styles.rightColumn}>
            <CardBuyer
              rarity={cardData.rarity}
              category={cardData.category}
              owner={cardData.owner}
              description={`${cardData.description} 포토카드입니다. ${cardData.description} 포토카드입니다. ${cardData.description} 포토카드입니다.`}
              price={cardData.price}
              remaining={`${cardData.remaining} / ${cardData.outof}`}
              quantity={quantity}
              onQuantityChange={setQuantity}
              totalPrice={totalPrice}
              onPurchase={handlePurchase}
            />
          </div>
        </div>

        {/* 5. "교환 희망 정보" Title with Button */}
        <div className={styles.spacing50}></div>
        <div className={styles.exchangeTitleBox}>
          <h1
            className={styles.exchangeTitle}
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: '100%',
              color: '#ffffff',
              margin: 0,
              paddingBottom: '20px',
            }}
          >
            교환 희망 정보
          </h1>
          <Button
            onClick={handleExchange}
            className={styles.exchangeButton}
            style={{
              backgroundColor: '#FFD700',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif",
            }}
          >
            포토카드 교환하기
          </Button>
        </div>

        {/* Divider */}
        <div className={styles.exchangeDivider}></div>

        {/* Exchange Wish Description */}
        <div className={styles.exchangeDescription}>
          {mainCardData.secondDescription}
        </div>

        {/* Exchange Wish Rarity and Category */}
        <div className={styles.exchangeRarityCategory}>
          <span 
            className={styles.exchangeRarity}
            style={{
              color: mainCardData.secondRarity === 'LEGENDARY' ? '#FF1744' :
                     mainCardData.secondRarity === 'SUPER RARE' ? '#9D4EDD' :
                     mainCardData.secondRarity === 'RARE' ? '#60a5fa' :
                     '#FFD700',
              fontWeight: 700,
            }}
          >
            {mainCardData.secondRarity}
          </span>
          <span className={styles.exchangeSeparator}>|</span>
          <span className={styles.exchangeCategory}>{mainCardData.secondCategory}</span>
        </div>

      </div>

      {/* Purchase Confirmation Modal */}
      <Modal
        open={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        size="purchaseConfirm"
      >
        <div className={purchaseModalStyles.purchaseModalContainer}>
          <h2 className={purchaseModalStyles.title}>포토카드 구매</h2>
          <p className={purchaseModalStyles.message}>
            [{cardData.rarity} | {cardData.description}] {quantity}장을 구매하시겠습니까?
          </p>
          <Button
            onClick={handlePurchaseConfirm}
            className={purchaseModalStyles.purchaseButton}
            style={{
              backgroundColor: '#FFFF00',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              padding: '0',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '100%',
              fontFamily: "'Noto Sans KR', sans-serif",
              cursor: 'pointer',
              width: '170px',
              height: '60px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            구매하기
          </Button>
        </div>
      </Modal>
    </div>
  );
}
