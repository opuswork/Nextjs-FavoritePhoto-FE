'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Modal from '@/components/atoms/Modal/Modal';
import { ButtonPrimary, ButtonSecondary, ResponsiveButton } from '@/components/atoms/Button';
import styles from './FilterBottomSheet.module.css';


const GENRE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '풍경', label: '풍경' },
  { value: '여행', label: '여행' },
  { value: '인물', label: '인물' },
  { value: '동물', label: '동물' },
];

const SOLD_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'soldout', label: '매진' },
  { value: 'available', label: '판매중' },
];

const RARITY_COLORS = {
  COMMON: '#FFD700',
  RARE: '#60a5fa',
  'SUPER RARE': '#9D4EDD',
  EPIC: '#9D4EDD',
  LEGENDARY: '#FF1744',
};

/** API/카드에서 오는 등급 문자열을 통일된 키로 정규화 (대소문자·공백·언더스코어 무관) */
function normalizeRarityKey(rarity) {
  if (rarity == null || rarity === '') return 'COMMON';
  const s = String(rarity).toUpperCase().trim().replace(/\s+/g, ' ').replace(/_/g, ' ');
  if (s === 'COMMON') return 'COMMON';
  if (s === 'RARE') return 'RARE';
  if (s === 'LEGENDARY') return 'LEGENDARY';
  if (s === 'EPIC') return 'EPIC';
  if (s === 'SUPER RARE' || s === 'SUPERRARE') return 'SUPER RARE';
  return 'COMMON';
}

const RARITY_MAP = { COMMON: 0, RARE: 0, 'SUPER RARE': 0, EPIC: 0, LEGENDARY: 0 };

function countByGrade(cards) {
  const map = { ...RARITY_MAP };
  cards.forEach((c) => {
    const key = normalizeRarityKey(c.rarity);
    if (map[key] !== undefined) map[key]++;
  });
  return map;
}

function countByGenre(cards) {
  const map = {};
  cards.forEach((c) => {
    const key = String(c.category ?? '').trim();
    if (key) map[key] = (map[key] || 0) + 1;
  });
  return map;
}

function countSold(cards) {
  let sold = 0;
  let available = 0;
  cards.forEach((c) => (c.remaining > 0 ? available++ : sold++));
  return { soldout: sold, available };
}

export default function FilterBottomSheet({
  open,
  onClose,
  initialRarity = 'all',
  initialGenre = 'all',
  initialSoldout = 'all',
  onApply,
  cards = [],
}) {
  const [activeTab, setActiveTab] = useState('grade');
  const [rarity, setRarity] = useState(initialRarity);
  const [genre, setGenre] = useState(initialGenre);
  const [soldout, setSoldout] = useState(initialSoldout);

  useEffect(() => {
    if (open) {
      setRarity(initialRarity);
      setGenre(initialGenre);
      setSoldout(initialSoldout);
    }
  }, [open, initialRarity, initialGenre, initialSoldout]);

  const gradeCounts = useMemo(() => countByGrade(cards), [cards]);
  const genreCounts = useMemo(() => countByGenre(cards), [cards]);
  const soldCounts = useMemo(() => countSold(cards), [cards]);

  const rarityToCard = { common: 'COMMON', rare: 'RARE', superRare: 'SUPER RARE', epic: 'EPIC', legendary: 'LEGENDARY' };
  const filteredCount = useMemo(() => {
    return cards.filter((c) => {
      if (rarity !== 'all') {
        const r = rarityToCard[rarity];
        return r ? normalizeRarityKey(c.rarity) === r : true;
      }
      if (genre !== 'all') return (c.category || '').trim() === (genre || '').trim();
      if (soldout === 'soldout') return c.remaining === 0;
      if (soldout === 'available') return c.remaining > 0;
      return true;
    }).length;
  }, [cards, rarity, genre, soldout]);

  const handleApply = () => {
    onApply?.({ rarity, genre, soldout });
    onClose?.();
  };

  const handleReset = () => {
    setRarity('all');
    setGenre('all');
    setSoldout('all');
  };

  const gradeOptionsWithCount = [
    { value: 'all', label: '전체', count: cards.length },
    { value: 'common', label: 'COMMON', count: gradeCounts.COMMON ?? 0 },
    { value: 'rare', label: 'RARE', count: gradeCounts.RARE ?? 0 },
    { value: 'superRare', label: 'SUPER RARE', count: gradeCounts['SUPER RARE'] ?? 0 },
    { value: 'epic', label: 'EPIC', count: gradeCounts.EPIC ?? 0 },
    { value: 'legendary', label: 'LEGENDARY', count: gradeCounts.LEGENDARY ?? 0 },
  ];

  const genreOptionsWithCount = [
    { value: 'all', label: '전체', count: cards.length },
    ...Object.entries(genreCounts).map(([value, count]) => ({ value, label: value, count })),
  ];

  const soldOptionsWithCount = [
    { value: 'all', label: '전체', count: cards.length },
    { value: 'soldout', label: '매진', count: soldCounts.soldout },
    { value: 'available', label: '판매중', count: soldCounts.available },
  ];

  return (
    <Modal open={open} onClose={onClose} size="bottomSheet" showCloseButton={false}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h2 className={styles.sheetTitle}>필터</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'grade' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('grade')}
          >
            등급
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'genre' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('genre')}
          >
            장르
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'soldout' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('soldout')}
          >
            매진 여부
          </button>
        </div>

        <div className={styles.options}>
          {activeTab === 'grade' &&
            gradeOptionsWithCount.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.optionRow}
                onClick={() => {
                  setRarity(opt.value);
                  setGenre('all');
                  setSoldout('all');
                }}
              >
                <span
                  className={styles.optionLabel}
                  style={{ color: opt.value === 'all' ? '#fff' : (RARITY_COLORS[opt.label] || '#fff') }}
                >
                  {opt.label}
                </span>
                <span className={styles.optionCount}>{opt.count}개</span>
              </button>
            ))}
          {activeTab === 'genre' &&
            genreOptionsWithCount.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.optionRow}
                onClick={() => {
                  setGenre(opt.value);
                  setRarity('all');
                  setSoldout('all');
                }}
              >
                <span className={styles.optionLabel}>{opt.label}</span>
                <span className={styles.optionCount}>{opt.count}개</span>
              </button>
            ))}
          {activeTab === 'soldout' &&
            soldOptionsWithCount.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.optionRow}
                onClick={() => {
                  setSoldout(opt.value);
                  setRarity('all');
                  setGenre('all');
                }}
              >
                <span className={styles.optionLabel}>{opt.label}</span>
                <span className={styles.optionCount}>{opt.count}개</span>
              </button>
            ))}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.refreshBtn} onClick={handleReset} aria-label="초기화">
            <Image src="/assets/icons/ic_refresh.svg" alt="초기화" width={24} height={24} />
          </button>
          <ResponsiveButton onClick={handleApply} className={styles.applyBtn}>
            {filteredCount}개 포토보기
          </ResponsiveButton>
        </div>
      </div>
    </Modal>
  );
}
