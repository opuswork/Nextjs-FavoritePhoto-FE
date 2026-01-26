'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '@/components/atoms/Modal/Modal';
import MyCardDetail from '@/components/organisms/MyCardDetail/MyCardDetail';
import DropDown from '@/components/atoms/DropDown/DropDown';
import TextBox from '@/components/atoms/TextBox/TextBox';
import Button from '@/components/atoms/Button/Button';
import styles from './OpenModal.module.css';

export default function OpenModal({ open, onClose, cardData, mode = 'edit', onSellSuccess }) {
  // Extract numeric price from "4 P" format
  const extractPrice = (priceStr) => {
    if (!priceStr) return '';
    const match = priceStr.match(/(\d+)/);
    return match ? match[1] : '';
  };

  const [quantity, setQuantity] = useState(cardData?.initialQuantity || 1);
  const [price, setPrice] = useState(extractPrice(cardData?.price) || '');
  const [grade, setGrade] = useState(cardData?.grade || 'COMMON');
  const [genre, setGenre] = useState(cardData?.genre || '풍경');
  const [description, setDescription] = useState(cardData?.exchangeDescription || '');

  // Update state when cardData changes
  useEffect(() => {
    if (cardData) {
      setQuantity(cardData.initialQuantity || 1);
      setPrice(extractPrice(cardData.price) || '');
      setGrade(cardData.grade || 'COMMON');
      setGenre(cardData.genre || '풍경');
      setDescription(cardData.exchangeDescription || '');
    }
  }, [cardData]);

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

  const handleSave = () => {
    if (mode === 'sell') {
      // Call onSellSuccess callback to show success modal in parent component
      if (onSellSuccess) {
        onSellSuccess({
          ...cardData,
          quantity: quantity,
          rarity: grade,
          title: cardData?.title || '우리집 앞마당',
        });
      }
    } else {
      // Handle edit logic here
      console.log('Save clicked', { quantity, price, grade, genre, description, mode });
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // Determine title and button text based on mode
  const modalTitle = mode === 'sell' ? '나의 포토카드 판매하기' : '수정하기';
  const saveButtonText = mode === 'sell' ? '판매하기' : '수정하기';

  return (
    <Modal open={open} onClose={onClose} size="custom">
      <div className={styles.openModalContainer}>
        {/* Header with title */}
        <div className={styles.header}>
          <h2 className={styles.modalTitle}>{modalTitle}</h2>
        </div>

        {/* Scrollable content area */}
        <div className={styles.scrollableContent}>
          {/* Card Title Section */}
          <div className={styles.cardTitleBox}>
            <h1
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
              {cardData?.title || '우리집 앞마당'}
            </h1>
          </div>

          {/* Photo and Card Details Section */}
          <div className={styles.photoAndDetailsSection}>
            {/* Left: Photo */}
            <div className={styles.photoSection}>
              <Image
                src={cardData?.imageSrc || "/assets/products/photo-card.svg"}
                alt={cardData?.title || "포토카드"}
                width={480}
                height={360}
                className={styles.photoImage}
              />
            </div>

            {/* Right: MyCardDetail Component */}
            <div className={styles.detailsSection}>
              <MyCardDetail
                rarity={cardData?.rarity || 'LEGENDARY'}
                category={cardData?.category || '풍경'}
                owner={cardData?.owner || '유디'}
                maxQuantity={cardData?.maxQuantity || 3}
                initialQuantity={quantity}
                price={price}
                onQuantityChange={setQuantity}
                onPriceChange={setPrice}
              />
            </div>
          </div>

          {/* Exchange Wish Information Section */}
          <div className={styles.cardTitleBox}>
            <h1
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
              교환 희망 정보
            </h1>
          </div>

          {/* Grade and Genre Selection */}
          <div className={styles.gradeGenreSection}>
            {/* Left: Grade */}
            <div className={styles.gradeSection}>
              <h3 className={styles.sectionTitle}>등급</h3>
              <DropDown
                className={styles.gradeDropdown}
                options={gradeOptions}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                wrapperStyle={{ border: '1px solid #ffffff' }}
                style={{ border: '1px solid #ffffff' }}
              />
            </div>

            {/* Right: Genre */}
            <div className={styles.genreSection}>
              <h3 className={styles.sectionTitle}>장르</h3>
              <DropDown
                className={styles.genreDropdown}
                options={genreOptions}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                wrapperStyle={{ border: '1px solid #ffffff' }}
                style={{ border: '1px solid #ffffff' }}
              />
            </div>
          </div>

          {/* Exchange Wish Description */}
          <div className={styles.descriptionSection}>
            <h3 className={styles.sectionTitle}>교환 희망 설명</h3>
            <TextBox
              label=""
              value={description}
              placeholder="--- ---"
              onChange={setDescription}
              className={styles.descriptionTextBox}
              wrapperStyle={{ width: '920px', gap: 0 }}
              textareaStyle={{ width: '920px' }}
            />
          </div>

          {/* Divider */}
          <span className={styles.divider}></span>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Button
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className={styles.saveButton}
            >
              {saveButtonText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
