'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MyCardDetail from '@/components/organisms/MyCardDetail/MyCardDetail';
import DropDown from '@/components/atoms/DropDown/DropDown';
import TextBox from '@/components/atoms/TextBox/TextBox';
import { ResponsiveButton } from '@/components/atoms/Button';
import styles from './CardSellingForm.module.css';

const STORAGE_SELL_SUCCESS = 'marketplace_sell_success_data';

export default function CardSellingForm({ cardData, onBack, onSuccess, isInModal = false }) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [grade, setGrade] = useState('COMMON');
  const [genre, setGenre] = useState('풍경');
  const [description, setDescription] = useState('');

  const extractPrice = (priceStr) => {
    if (!priceStr) return '';
    const match = String(priceStr).match(/(\d+)/);
    return match ? match[1] : '';
  };

  useEffect(() => {
    if (cardData) {
      setQuantity(cardData.initialQuantity ?? 1);
      setPrice(extractPrice(cardData.price) ?? '');
      setGrade(cardData.grade ?? 'COMMON');
      setGenre(cardData.genre ?? '풍경');
      setDescription(cardData.exchangeDescription ?? '');
    }
  }, [cardData]);

  const handleCancel = () => {
    if (onBack) {
      onBack();
    }
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
    } catch {}
    if (onSuccess) {
      onSuccess(payload);
    }
  };

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

  if (!cardData) {
    return null;
  }

  return (
    <div className={`${styles.formContainer} ${isInModal ? styles.inModal : ''}`}>
      {isInModal && (
        <div className={styles.header}>
          <button type="button" className={styles.backButton} onClick={handleCancel} aria-label="뒤로가기">
            <Image src="/assets/icons/ic_back.svg" alt="뒤로가기" width={22} height={22} />
          </button>
          <h1 className={styles.headerTitle}>나의 포토카드 판매하기</h1>
          <div className={styles.headerSpacer} aria-hidden />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.cardTitleBox}>
          <h2 className={styles.cardTitle}>{cardData.title || cardData.description || '우리집 앞마당'}</h2>
        </div>

        {/* Main Content Area - Two Column Layout */}
        <div className={styles.mainContentArea}>
          {/* Left Column - Photo Section */}
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

          {/* Right Column - Details Section */}
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

        <div className={styles.cardTitleBox}>
          <h2 className={styles.sectionTitle}>교환 희망 정보</h2>
        </div>

        {/* Grade & Genre - same row on desktop */}
        <div className={styles.filterRow}>
          <div className={styles.gradeSection}>
            <h3 className={styles.label}>등급</h3>
            <DropDown
              options={gradeOptions}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              wrapperStyle={{ border: '1px solid #ffffff' }}
              style={{ border: '1px solid #ffffff' }}
            />
          </div>

          <div className={styles.genreSection}>
            <h3 className={styles.label}>장르</h3>
            <DropDown
              options={genreOptions}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              wrapperStyle={{ border: '1px solid #ffffff' }}
              style={{ border: '1px solid #ffffff' }}
            />
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <h3 className={styles.label}>교환 희망 설명</h3>
          <TextBox
            label=""
            value={description}
            placeholder="--- ---"
            onChange={setDescription}
            wrapperStyle={{ width: '100%', gap: 0 }}
            textareaStyle={{ width: '100%', minHeight: '120px' }}
          />
        </div>

        <div className={styles.actionButtons}>
          <ResponsiveButton
            fullWidth={true}
            onClick={handleCancel} 
            className={styles.cancelButton}
            style={{ display: 'flex', width: '100%' }}
          >
            취소하기
          </ResponsiveButton>
          <ResponsiveButton 
            fullWidth={true}
            onClick={handleSave} 
            className={styles.saveButton}
            style={{ display: 'flex', width: '100%' }}
          >
            판매하기
          </ResponsiveButton>
        </div>
      </div>
    </div>
  );
}
