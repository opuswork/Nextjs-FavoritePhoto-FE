'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MyCardDetail from '@/components/organisms/MyCardDetail/MyCardDetail';
import DropDown from '@/components/atoms/DropDown/DropDown';
import TextBox from '@/components/atoms/TextBox/TextBox';
import Button from '@/components/atoms/Button/Button';
import styles from './page.module.css';

const STORAGE_SELL_CARD = 'marketplace_sell_card';
const STORAGE_SELL_SUCCESS = 'marketplace_sell_success_data';

export default function MarketplaceSellPage() {
  const router = useRouter();
  const [cardData, setCardData] = useState(null);
  const [mounted, setMounted] = useState(false);
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
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_SELL_CARD) : null;
    if (!raw) {
      router.replace('/marketplace');
      return;
    }
    try {
      const data = JSON.parse(raw);
      setCardData(data);
      setQuantity(data.initialQuantity ?? 1);
      setPrice(extractPrice(data.price) ?? '');
      setGrade(data.grade ?? 'COMMON');
      setGenre(data.genre ?? '풍경');
      setDescription(data.exchangeDescription ?? '');
    } catch {
      router.replace('/marketplace');
    }
    setMounted(true);
  }, [router]);

  const handleBack = () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_SELL_CARD);
    router.push('/marketplace');
  };

  const handleCancel = () => {
    handleBack();
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
    sessionStorage.removeItem(STORAGE_SELL_CARD);
    router.push('/marketplace/sell/success');
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

  if (!mounted || !cardData) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={handleBack} aria-label="뒤로가기">
          <Image src="/assets/icons/ic_back.svg" alt="뒤로가기" width={22} height={22} />
        </button>
        <h1 className={styles.headerTitle}>나의 포토카드 판매하기</h1>
        <div className={styles.headerSpacer} aria-hidden />
      </div>

      <div className={styles.content}>
        <div className={styles.cardTitleBox}>
          <h2 className={styles.cardTitle}>{cardData.title || cardData.description || '우리집 앞마당'}</h2>
        </div>

        {/* 1. photoSection first */}
        <div className={styles.photoSection}>
          <Image
            src={cardData.imageSrc || '/assets/products/photo-card.svg'}
            alt={cardData.title || '포토카드'}
            width={480}
            height={360}
            className={styles.photoImage}
          />
        </div>

        {/* 2. detailsSection below photoSection */}
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

        <div className={styles.cardTitleBox}>
          <h2 className={styles.sectionTitle}>교환 희망 정보</h2>
        </div>

        {/* 3. gradeSection first */}
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

        {/* 4. genreSection below gradeSection */}
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
          <Button onClick={handleCancel} className={styles.cancelButton}>
            취소하기
          </Button>
          <Button onClick={handleSave} className={styles.saveButton}>
            판매하기
          </Button>
        </div>
      </div>
    </div>
  );
}
