'use client';

import { useMemo, useState } from 'react';
import Title from '@/components/atoms/Title/Title';
import Button from '@/components/atoms/Button/Button';
import DropDown from '@/components/atoms/DropDown/DropDown';
import InputSearch from '@/components/molecules/InputSearch/InputSearch';

export default function SubHeader() {
  const [search, setSearch] = useState('');
  const [rarity, setRarity] = useState('all');
  const [genre, setGenre] = useState('all');
  const [soldout, setSoldout] = useState('all');
  const [sort, setSort] = useState('lowPrice');

  const rarityOptions = useMemo(
    () => [
      { value: 'all', label: '등급' },
      { value: 'common', label: 'COMMON' },
      { value: 'rare', label: 'RARE' },
      { value: 'epic', label: 'EPIC' },
    ],
    [],
  );

  const genreOptions = useMemo(
    () => [
      { value: 'all', label: '장르' },
      { value: 'landscape', label: '풍경' },
      { value: 'portrait', label: '인물' },
      { value: 'animal', label: '동물' },
    ],
    [],
  );

  const soldoutOptions = useMemo(
    () => [
      { value: 'all', label: '매진여부' },
      { value: 'soldout', label: '매진' },
      { value: 'available', label: '판매중' },
    ],
    [],
  );

  const sortOptions = useMemo(
    () => [
      { value: 'lowPrice', label: '낮은 가격순' },
      { value: 'highPrice', label: '높은 가격순' },
      { value: 'newest', label: '최신순' },
    ],
    [],
  );

  return (
    <section className="w-full bg-black text-white">
      <div className="mx-auto w-full max-w-[1480px] px-5 pt-10">
        <div className="flex items-center justify-between">
          <Title text="마켓플레이스" as="h1" showLine={false} />

          <Button
            href="/marketplace"
            style={{
              width: '440px',
              height: '60px',
              borderRadius: '2px',
              backgroundColor: '#EFFF04',
              color: '#000000',
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            나의 포토카드 판매하기
          </Button>
        </div>

        <div className="mt-6 w-full border-t-2 border-[#EEEEEE]" />

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <InputSearch
              placeholder="검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => {}}
            />

            <div className="w-[120px]">
              <DropDown options={rarityOptions} value={rarity} onChange={(e) => setRarity(e.target.value)} />
            </div>
            <div className="w-[120px]">
              <DropDown options={genreOptions} value={genre} onChange={(e) => setGenre(e.target.value)} />
            </div>
            <div className="w-[140px]">
              <DropDown options={soldoutOptions} value={soldout} onChange={(e) => setSoldout(e.target.value)} />
            </div>
          </div>

          <div className="w-[220px]">
            <DropDown options={sortOptions} value={sort} onChange={(e) => setSort(e.target.value)} />
          </div>
        </div>
      </div>
    </section>
  );
}

