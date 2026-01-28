'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/atoms/Modal/Modal';
import InputSearch from '@/components/molecules/InputSearch/InputSearch';
import DropDown from '@/components/atoms/DropDown/DropDown';
import MyCard from '@/components/organisms/MyCard/MyCard';
import OpenModal from '@/components/organisms/OpenModal/OpenModal';
import MarketplaceSellSuccessPage from '@/app/(main)/marketplace/sell/success/page';
import SubHeaderExchange from '@/components/organisms/SubHeader/SubHeaderExchange';
import styles from './CardSellingListModal.module.css';

const STORAGE_SELL_CARD = 'marketplace_sell_card';

export default function CardSellingListModal({ open, onClose, modalTitle = '나의 포토카드 판매하기', onCardSelect, onSellCardSelect, mode = 'sell' }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('all');
  const [genre, setGenre] = useState('all');
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSellSuccessModalOpen, setIsSellSuccessModalOpen] = useState(false);
  const [soldCardData, setSoldCardData] = useState(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [exchangeCardData, setExchangeCardData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({ rarity: 'all', genre: 'all', soldout: 'all' });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 499);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const gradeOptions = [
    { value: 'all', label: '등급' },
    { value: 'COMMON', label: 'COMMON' },
    { value: 'RARE', label: 'RARE' },
    { value: 'SUPER RARE', label: 'SUPER RARE' },
    { value: 'LEGENDARY', label: 'LEGENDARY' },
  ];

  const genreOptions = [
    { value: 'all', label: '장르' },
    { value: '풍경', label: '풍경' },
    { value: '인물', label: '인물' },
    { value: '음식', label: '음식' },
    { value: '동물', label: '동물' },
  ];

  // Sample card data (10 cards for 2 columns x 5 rows) - using 3 images
  const imageSources = [
    '/assets/products/photo-card-yard-with-woman.svg',
    '/assets/products/photo-card-spain.svg',
    '/assets/products/photo-card-tree-with-lake.svg',
  ];

  const sampleCards = [
    { id: 1, rarity: 'RARE', category: '풍경', owner: '프로여행러', description: '스페인 여행', price: '4 P', quantity: 1, imageSrc: imageSources[1], title: '스페인 여행', maxQuantity: 3, initialQuantity: 1, grade: 'RARE', genre: '풍경', exchangeDescription: '' },
    { id: 2, rarity: 'COMMON', category: '풍경', owner: '미쓰손', description: '우리집 앞마당', price: '4 P', quantity: 1, imageSrc: imageSources[0], title: '우리집 앞마당', maxQuantity: 3, initialQuantity: 1, grade: 'COMMON', genre: '풍경', exchangeDescription: '' },
    { id: 3, rarity: 'SUPER RARE', category: '풍경', owner: '랍스타', description: 'How Far I\'ll Go', price: '4 P', quantity: 1, imageSrc: imageSources[2], title: 'How Far I\'ll Go', maxQuantity: 3, initialQuantity: 1, grade: 'SUPER RARE', genre: '풍경', exchangeDescription: '' },
    { id: 4, rarity: 'COMMON', category: '풍경', owner: '미쓰손', description: '우리집 앞마당', price: '4 P', quantity: 1, imageSrc: imageSources[0], title: '우리집 앞마당', maxQuantity: 3, initialQuantity: 1, grade: 'COMMON', genre: '풍경', exchangeDescription: '' },
    { id: 5, rarity: 'RARE', category: '풍경', owner: '프로여행러', description: '스페인 여행', price: '4 P', quantity: 1, imageSrc: imageSources[1], title: '스페인 여행', maxQuantity: 3, initialQuantity: 1, grade: 'RARE', genre: '풍경', exchangeDescription: '' },
    { id: 6, rarity: 'LEGENDARY', category: '풍경', owner: '미쓰손', description: '우리집 앞마당', price: '4 P', quantity: 1, imageSrc: imageSources[0], title: '우리집 앞마당', maxQuantity: 3, initialQuantity: 1, grade: 'LEGENDARY', genre: '풍경', exchangeDescription: '' },
    { id: 7, rarity: 'COMMON', category: '풍경', owner: '랍스타', description: 'How Far I\'ll Go', price: '4 P', quantity: 1, imageSrc: imageSources[2], title: 'How Far I\'ll Go', maxQuantity: 3, initialQuantity: 1, grade: 'COMMON', genre: '풍경', exchangeDescription: '' },
    { id: 8, rarity: 'SUPER RARE', category: '풍경', owner: '프로여행러', description: '스페인 여행', price: '4 P', quantity: 1, imageSrc: imageSources[1], title: '스페인 여행', maxQuantity: 3, initialQuantity: 1, grade: 'SUPER RARE', genre: '풍경', exchangeDescription: '' },
    { id: 9, rarity: 'RARE', category: '풍경', owner: '미쓰손', description: '우리집 앞마당', price: '4 P', quantity: 1, imageSrc: imageSources[0], title: '우리집 앞마당', maxQuantity: 3, initialQuantity: 1, grade: 'RARE', genre: '풍경', exchangeDescription: '' },
    { id: 10, rarity: 'COMMON', category: '풍경', owner: '랍스타', description: 'How Far I\'ll Go', price: '4 P', quantity: 1, imageSrc: imageSources[2], title: 'How Far I\'ll Go', maxQuantity: 3, initialQuantity: 1, grade: 'COMMON', genre: '풍경', exchangeDescription: '' },
  ];

  const handleCardClick = (card) => {
    if (mode === 'exchange' && onCardSelect) {
      setExchangeCardData(card);
      onCardSelect(card);
      onClose();
    } else if (mode === 'sell' && onSellCardSelect) {
      // Sell mode: go to full-page /marketplace/sell
      try {
        sessionStorage.setItem(STORAGE_SELL_CARD, JSON.stringify(card));
      } catch {}
      onClose();
      onSellCardSelect(card);
    } else {
      // Sell mode fallback: open OpenModal (e.g. when onSellCardSelect not provided)
      setSelectedCard(card);
      setIsOpenModalOpen(true);
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      size={isMobile ? "bottomSheetFull" : "custom"}
      showCloseButton={!isMobile}
    >
      <div className={styles.modalContainer}>
        {/* Scrollable content area */}
        <div className={styles.scrollableContent}>
          {/* Desktop: Original layout */}
          {!isMobile && (
            <>
              {/* "마이갤러리" Subtitle */}
              <div className={styles.subtitleBox}>
                <h2 className={styles.subtitle}>마이갤러리</h2>
              </div>

              {/* Main Title */}
              <div className={styles.titleBox}>
                <h1
                  className={styles.mainTitle}
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
                  {modalTitle}
                </h1>
              </div>

              {/* Search and Filter Section */}
              <div className={styles.filterSection}>
                <InputSearch
                  placeholder="검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={() => {}}
                  className={styles.searchInput}
                />
                <div className={styles.dropdownWrapper}>
                  <DropDown
                    options={gradeOptions}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    wrapperStyle={{ border: '0px solid #ffffff' }}
                    style={{ border: '0px solid #ffffff', backgroundColor: '#141414' }}
                  />
                </div>
                <div className={styles.dropdownWrapper}>
                  <DropDown
                    options={genreOptions}
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    wrapperStyle={{ border: '0px solid #ffffff' }}
                    style={{ border: '0px solid #ffffff', backgroundColor: '#141414' }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Mobile: SubHeaderExchange component */}
          {isMobile && (
            <SubHeaderExchange
              subtitle="마이갤러리"
              title={modalTitle}
              search={search}
              onSearchChange={(e) => setSearch(e.target.value)}
              filters={filters}
              onFiltersChange={setFilters}
              cards={sampleCards}
              onClose={onClose}
            />
          )}

          {/* MyCard Grid (2 columns x 5 rows) */}
          <div className={styles.cardsGrid}>
            {sampleCards.map((card) => (
              <div key={card.id} className={styles.cardItem}>
                <MyCard
                  rarity={card.rarity}
                  category={card.category}
                  owner={card.owner}
                  description={card.description}
                  price={card.price}
                  quantity={card.quantity}
                  imageSrc={card.imageSrc}
                  imageWidth={isMobile ? 170 : 400}
                  imageHeight={isMobile ? 150 : 400}
                  onClick={() => handleCardClick(card)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Modal for selling */}
      <OpenModal
        open={isOpenModalOpen}
        onClose={() => {
          setIsOpenModalOpen(false);
          setSelectedCard(null);
        }}
        cardData={selectedCard}
        mode="sell"
        onSellSuccess={() => {
          // Close OpenModal and show success modal
          setIsOpenModalOpen(false);
          setSelectedCard(null);
          setIsSellSuccessModalOpen(true);
        }}
      />

      {/* Sell Success Modal */}
      <Modal
        open={isSellSuccessModalOpen}
        onClose={() => {
          setIsSellSuccessModalOpen(false);
        }}
        size="custom"
        noBorder={true}
      >
        <MarketplaceSellSuccessPage 
          onButtonClick={() => {
            // Close success modal, keep CardSellingListModal open
            setIsSellSuccessModalOpen(false);
            setSoldCardData(null);
          }}
          cardData={soldCardData}
        />
      </Modal>
    </Modal>
  );
}
