'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import MyCardDetail from '@/components/organisms/MyCardDetail/MyCardDetail';
import DropDown from '@/components/atoms/DropDown/DropDown';
import TextBox from '@/components/atoms/TextBox/TextBox';
import { ResponsiveButton } from '@/components/atoms/Button';

import styles from './CardSellingForm.module.css';

const STORAGE_SELL_SUCCESS = 'marketplace_sell_success_data';

export default function CardSellingForm({
  cardData,
  onBack,
  onSuccess,
  isInModal = false,
}) {
  /* =========================
     STATE
     ========================= */

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [grade, setGrade] = useState('COMMON');
  const [genre, setGenre] = useState('풍경');
  const [description, setDescription] = useState('');

  /* =========================
     EFFECTS
     ========================= */

  useEffect(() => {
    if (!cardData) return;

    setQuantity(cardData.initialQuantity ?? 1);
    setPrice(extractPrice(cardData.price));
    setGrade(cardData.grade ?? 'COMMON');
    setGenre(cardData.genre ?? '풍경');
    setDescription(cardData.exchangeDescription ?? '');
  }, [cardData]);

  /* =========================
     HANDLERS
     ========================= */

  const handleCancel = () => {
    onBack?.();
  };

  const handleSave = () => {
    if (!cardData) return;

    const payload = {
      ...cardData,
      quantity,
      rarity: grade,
      title: cardData.title || cardData.description || '우리집 앞마당',
    };

    try {
      sessionStorage.setItem(STORAGE_SELL_SUCCESS, JSON.stringify(payload));
    } catch {
      // storage is optional, life goes on
    }

    onSuccess?.(payload);
  };

  /* =========================
     OPTIONS
     ========================= */

  const gradeOptions = [
    { value: 'COMMON', label: 'COMMON' },
    { value: 'RARE', label: 'RARE' },
    { value: 'SUPER RARE', label: 'SUPER RARE' },
    { value: 'LEGENDARY', label: 'LEGENDARY' },
  ];

  const genreOptions = [
    { value: '풍경', label: '풍경' },
    { value: '인물', label: '인물' },
    { value: '음식', label: '음식' },
    { value: '동물', label: '동물' },
  ];

  if (!cardData) return null;

  /* =========================
     RENDER
     ========================= */

  return (
    <div className={`${styles.formContainer} ${isInModal ? styles.inModal : ''}`}>
      {isInModal && (
        <header className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleCancel}
            aria-label="뒤로가기"
          >
            <Image
              src="/assets/icons/ic_back.svg"
              alt="뒤로가기"
              width={22}
              height={22}
            />
          </button>

          <h1 className={styles.headerTitle}>나의 포토카드 판매하기</h1>
          <div className={styles.headerSpacer} />
        </header>
      )}

      <div className={styles.content}>
        {/* ===== Card Title ===== */}
        <div className={styles.cardTitleBox}>
          <h2 className={styles.cardTitle}>
            {cardData.title || cardData.description || '우리집 앞마당'}
          </h2>
        </div>

        {/* ===== Main Content ===== */}
        <div className={styles.mainContentArea}>
          <div className={styles.leftColumn}>
            <div className={styles.photoSection}>
              <Image
                src={cardData.imageSrc || '/assets/products/photo-card.svg'}
                alt={cardData.title || '포토카드'}
                width={480}
                height={360}
                className={styles.photoImage}
              />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.detailsSection}>
              <MyCardDetail
                rarity={cardData.rarity || 'LEGENDARY'}
                category={cardData.category || '풍경'}
                owner={cardData.owner || '유디'}
                maxQuantity={cardData.maxQuantity ?? 3}
                initialQuantity={quantity}
                price={price}
                onQuantityChange={setQuantity}
                onPriceChange={setPrice}
              />
            </div>
          </div>
        </div>

        {/* ===== Exchange Info ===== */}
        <div className={styles.cardTitleBox}>
          <h2 className={styles.sectionTitle}>교환 희망 정보</h2>
        </div>

        <div className={styles.filterRow}>
          <div className={styles.gradeSection}>
            <h3 className={styles.label}>등급</h3>
            <DropDown
              options={gradeOptions}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          <div className={styles.genreSection}>
            <h3 className={styles.label}>장르</h3>
            <DropDown
              options={genreOptions}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <h3 className={styles.label}>교환 희망 설명</h3>
          <TextBox
            value={description}
            placeholder="--- ---"
            onChange={setDescription}
            wrapperStyle={{ width: '100%' }}
            textareaStyle={{ width: '100%', minHeight: '120px' }}
          />
        </div>

        {/* ===== Actions ===== */}
        <div className={styles.actionButtons}>
          <div className={styles.buttonCol}>
            <ResponsiveButton onClick={handleCancel}>
              취소하기
            </ResponsiveButton>
          </div>

          <div className={styles.buttonCol}>
            <ResponsiveButton onClick={handleSave}>
              판매하기
            </ResponsiveButton>
          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================
   HELPERS
   ========================= */

function extractPrice(value) {
  if (!value) return '';
  const match = String(value).match(/\d+/);
  return match ? match[0] : '';
}
