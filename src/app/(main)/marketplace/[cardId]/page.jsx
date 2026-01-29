'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CardBuyer from '@/components/organisms/CardBuyer/CardBuyer';
import { ButtonPrimary } from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal/Modal';
import CardSellingListModal from '@/components/organisms/CardSellingListModal/CardSellingListModal';
import CardExchangeModal from '@/components/organisms/CardExchangeModal';
import MyCardExchangeCancel from '@/components/organisms/MyCard/MyCardExchangeCancel';
import ExchangeFormContent from './exchange/ExchangeFormContent';
import { sampleCards } from '../sampleCards';
import styles from './page.module.css';
import purchaseModalStyles from './PurchaseConfirmModal.module.css';
import cancelModalStyles from './CancelExchangeConfirmModal.module.css';
import exchangePageStyles from './exchange/page.module.css';

const STORAGE_PENDING_EXCHANGE = 'marketplace_pending_exchange';

function storageKey(cardId) {
  return `marketplace_proposed_exchanges_${cardId}`;
}

export default function MarketplaceCardPurchasePage() {
  const params = useParams();
  const router = useRouter();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isExchangeListModalOpen, setIsExchangeListModalOpen] = useState(false);
  const [proposedExchanges, setProposedExchanges] = useState([]);
  const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] = useState(false);
  const [exchangeToCancel, setExchangeToCancel] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [exchangeFormOpen, setExchangeFormOpen] = useState(false);
  const [exchangeFormCard, setExchangeFormCard] = useState(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [exchangeModalCard, setExchangeModalCard] = useState(null);

  // Find card data from sampleCards based on cardId
  const cardId = params?.cardId ?? '1';
  const cardIdNum = parseInt(cardId, 10);

  // Load persisted list on mount; merge pending exchange when returning from /exchange
  useEffect(() => {
    try {
      const key = storageKey(cardId);
      const existingRaw = sessionStorage.getItem(key);
      let existing = existingRaw ? JSON.parse(existingRaw) : [];

      // Deduplicate existing items: ensure all IDs are unique
      const seenIds = new Set();
      existing = existing.map((item, index) => {
        let id = item.id;
        if (!id || seenIds.has(id)) {
          id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`;
        }
        seenIds.add(id);
        return { ...item, id };
      });

      const pendingRaw = sessionStorage.getItem(STORAGE_PENDING_EXCHANGE);
      if (pendingRaw) {
        sessionStorage.removeItem(STORAGE_PENDING_EXCHANGE);
        const pending = JSON.parse(pendingRaw);
        // Generate unique ID: use pending.id if unique, otherwise create new unique ID
        let newId = pending.id;
        if (!newId || seenIds.has(newId)) {
          newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${existing.length}`;
        }
        const next = [...existing, { ...pending, id: newId }];
        sessionStorage.setItem(key, JSON.stringify(next));
        setProposedExchanges(next);
      } else {
        setProposedExchanges(existing);
      }
    } catch {
      setProposedExchanges([]);
    }
  }, [cardId]);

  useEffect(() => {
    const checkViewport = () => setIsMobileOrTablet(window.innerWidth <= 1199);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const cardData = useMemo(() => {
    return sampleCards.find(card => card.id === cardIdNum) || sampleCards[0];
  }, [cardIdNum]);
  
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
    setIsExchangeListModalOpen(true);
  };

  const handleExchangeCardSelect = (selectedCard) => {
    setIsExchangeListModalOpen(false);
    if (isMobileOrTablet) {
      setExchangeFormCard(selectedCard);
      setExchangeFormOpen(true);
    } else {
      setExchangeModalCard(selectedCard);
      setIsExchangeModalOpen(true);
    }
  };

  const handleExchangeFormCancel = () => {
    setExchangeFormOpen(false);
    setExchangeFormCard(null);
  };

  const handleExchangeFormSuccess = (payload) => {
    const key = storageKey(cardId);
    setProposedExchanges((prev) => {
      // Generate unique ID: use payload.id if unique, otherwise create new unique ID
      let newId = payload.id;
      const existingIds = new Set(prev.map(item => item.id));
      if (!newId || existingIds.has(newId)) {
        // Generate unique ID using timestamp + random + index
        newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${prev.length}`;
      }
      const next = [...prev, { ...payload, id: newId }];
      try {
        sessionStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
    setExchangeFormOpen(false);
    setExchangeFormCard(null);
  };

  const handleExchangeModalClose = () => {
    setIsExchangeModalOpen(false);
    setExchangeModalCard(null);
  };

  const handleExchangeModalSuccess = (payload) => {
    const key = storageKey(cardId);
    setProposedExchanges((prev) => {
      // Generate unique ID: use payload.id if unique, otherwise create new unique ID
      let newId = payload.id;
      const existingIds = new Set(prev.map(item => item.id));
      if (!newId || existingIds.has(newId)) {
        // Generate unique ID using timestamp + random + index
        newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${prev.length}`;
      }
      const next = [...prev, { ...payload, id: newId }];
      try {
        sessionStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
    setIsExchangeModalOpen(false);
    setExchangeModalCard(null);
  };

  const handleCancelExchange = (exchange) => {
    // 취소 확인 모달 열기
    setExchangeToCancel(exchange);
    setIsCancelConfirmModalOpen(true);
  };

  const handleConfirmCancel = () => {
    // 교환 제시 취소 확인
    if (exchangeToCancel) {
      const key = storageKey(cardId);
      setProposedExchanges((prev) => {
        const next = prev.filter((item) => item.id !== exchangeToCancel.id);
        try {
          sessionStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
    setIsCancelConfirmModalOpen(false);
    setExchangeToCancel(null);
  };

  return (
    <div
      className={styles.pageContainer}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Mobile Header (499px 이하) */}
      <div className={styles.mobileHeader}>
        <button 
          type="button" 
          className={styles.backButton}
          onClick={() => router.push('/marketplace')}
          aria-label="목록으로"
        >
          <Image src="/assets/icons/ic_back.svg" alt="목록으로" width={22} height={22} />
        </button>
        <h1 className={styles.mobileHeaderTitle}>마켓플레이스</h1>
        <div style={{ width: '22px' }}></div> {/* Spacer for centering */}
      </div>

      <div className={styles.contentWrapper}>
        {/* Desktop Layout */}
        <div
          className={styles.desktopLayout}
          style={{
            width: '100%',
            maxWidth: '1280px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* Right Main Content */}
          <div className={styles.rightMainContent}>
            {/* 1. Marketplace link above Card Title (desktop) */}
            <Link href="/marketplace" className={styles.marketplaceLinkAboveTitle}>
              <span>마켓플레이스</span>
            </Link>
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

        {/* 5. "교환 희망 정보" Title + "포토카드 교환하기" button on right (desktop) */}
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
          <div className={styles.desktopExchangeButton}>
            <ButtonPrimary onClick={handleExchange} className={styles.exchangeButton}>
              포토카드 교환하기
            </ButtonPrimary>
          </div>
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

        {/* Mobile Exchange Button (499px 이하) */}
        <div className={styles.mobileExchangeButton}>
          <ButtonPrimary onClick={handleExchange} className={styles.exchangeButton}>
            포토카드 교환하기
          </ButtonPrimary>
        </div>

        {/* My Proposed Exchange List */}
        {proposedExchanges.length > 0 && (
          <>
            <div className={styles.spacing50}></div>
            <div className={styles.proposedExchangeTitleBox}>
              <h1
                className={styles.proposedExchangeTitle}
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
                내가 제시한 교환 목록
              </h1>
            </div>
            <div className={styles.proposedExchangeList}>
              {proposedExchanges.map((exchange, index) => (
                <div key={exchange.id || `exchange-${cardId}-${index}`} className={styles.proposedExchangeItem}>
                  <MyCardExchangeCancel
                    rarity={exchange.rarity}
                    category={exchange.category}
                    owner={exchange.owner}
                    description={exchange.description}
                    price={exchange.price}
                    purchaseInfo={exchange.purchaseInfo}
                    proposalMessage={exchange.proposalMessage}
                    imageSrc={exchange.imageSrc}
                    onCancel={() => handleCancelExchange(exchange)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
          </div>
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
          <ButtonPrimary
            onClick={handlePurchaseConfirm}
            className={purchaseModalStyles.purchaseButton}
          >
            구매하기
          </ButtonPrimary>
        </div>
      </Modal>

      {/* Exchange List Modal – on card select → close and open CardExchangeModal (desktop) or exchange bottom sheet (tablet/mobile) */}
      <CardSellingListModal
        open={isExchangeListModalOpen}
        onClose={() => setIsExchangeListModalOpen(false)}
        modalTitle="포토카드 교환하기"
        mode="exchange"
        onCardSelect={handleExchangeCardSelect}
      />

      {/* Desktop: CardExchangeModal – opens when user selects a card from CardSellingListModal */}
      <CardExchangeModal
        open={isExchangeModalOpen}
        onClose={handleExchangeModalClose}
        targetCardData={cardData}
        exchangeCardData={exchangeModalCard}
        onExchangeSuccess={handleExchangeModalSuccess}
      />

      {/* Exchange Form Bottom Sheet (tablet/mobile only) */}
      <Modal
        open={exchangeFormOpen}
        onClose={handleExchangeFormCancel}
        size="bottomSheetFull"
        showCloseButton={false}
      >
        <div className={exchangePageStyles.pageContainer} style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className={exchangePageStyles.header}>
            <button
              type="button"
              className={exchangePageStyles.backButton}
              onClick={handleExchangeFormCancel}
              aria-label="뒤로가기"
            >
              <Image src="/assets/icons/ic_back.svg" alt="뒤로가기" width={22} height={22} />
            </button>
            <h1 className={exchangePageStyles.headerTitle}>포토카드 교환하기</h1>
            <div className={exchangePageStyles.headerSpacer} aria-hidden />
          </div>
          <ExchangeFormContent
            cardData={exchangeFormCard}
            onCancel={handleExchangeFormCancel}
            onExchange={handleExchangeFormSuccess}
          />
        </div>
      </Modal>

      {/* Cancel Exchange Confirm Modal */}
      <Modal
        open={isCancelConfirmModalOpen}
        onClose={() => {
          setIsCancelConfirmModalOpen(false);
          setExchangeToCancel(null);
        }}
        size="exchangeCancelConfirm"
      >
        <div className={cancelModalStyles.cancelModalContainer}>
          <h2 className={cancelModalStyles.title}>
            교환 제시 취소
          </h2>
          <p className={cancelModalStyles.message}>
            [{exchangeToCancel?.rarity || 'COMMON'} | {exchangeToCancel?.description || '스페인 여행'}] 교환 제시를 취소하시겠습니까?
          </p>
          <ButtonPrimary
            onClick={handleConfirmCancel}
            className={cancelModalStyles.cancelButton}
          >
            취소하기
          </ButtonPrimary>
        </div>
      </Modal>
    </div>
  );
}
