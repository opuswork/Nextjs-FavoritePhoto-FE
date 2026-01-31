'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useBreakpoint from '@/hooks/useBreakpoint';

import { sampleCards } from './_data/sampleCards';
import CardOriginal from '@/components/organisms/CardOriginal/CardOriginal';
import GradeChips from './_components/GradeChips';
import Pagination from './_components/Pagination';
import MyGalleryFilterBar from './_components/MyGalleryFilterBar';
import MyGalleryMobileHeader from './_components/MyGalleryMobileHeader';

import styles from './page.module.css';

const PAGE_SIZE = 15;

export default function MyGalleryPage() {
  const router = useRouter();
  const bp = useBreakpoint();
  const isMobile = bp === 'sm';

  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('ALL');
  const [genre, setGenre] = useState('ALL');
  const [page, setPage] = useState(1);

  /* 등급별 개수 */
  const gradeCounts = useMemo(() => {
    return sampleCards.reduce(
      (acc, card) => {
        acc.total += 1;
        if (card.rarity === 'COMMON') acc.common += 1;
        if (card.rarity === 'RARE') acc.rare += 1;
        if (card.rarity === 'SUPER RARE') acc.superRare += 1;
        if (card.rarity === 'LEGENDARY') acc.legendary += 1;
        return acc;
      },
      { total: 0, common: 0, rare: 0, superRare: 0, legendary: 0 },
    );
  }, []);

  /* 필터 */
  const filteredCards = useMemo(() => {
    return sampleCards.filter((c) => {
      const okSearch = search
        ? `${c.description} ${c.owner} ${c.category}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const okGrade = grade === 'ALL' ? true : c.rarity === grade;
      const okGenre = genre === 'ALL' ? true : c.category === genre;
      return okSearch && okGrade && okGenre;
    });
  }, [search, grade, genre]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));
  const pagedCards = filteredCards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [search, grade, genre]);

  return (
    <div className={styles.listWrapper}>
      {isMobile && <MyGalleryMobileHeader title="마이갤러리" onBack={() => router.back()} />}

      {!isMobile && <GradeChips counts={gradeCounts} />}

      {!isMobile && <div className="mt-[60px] h-px w-full bg-white/20" />}

      <MyGalleryFilterBar
        isMobile={isMobile}
        search={search}
        onChangeSearch={setSearch}
        grade={grade}
        onChangeGrade={setGrade}
        genre={genre}
        onChangeGenre={setGenre}
      />

      <div className={styles.cardGrid}>
        {pagedCards.map((card) => (
          <CardOriginal key={card.id} {...card} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
