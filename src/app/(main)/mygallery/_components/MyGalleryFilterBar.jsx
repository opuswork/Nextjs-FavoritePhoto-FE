'use client';

import Image from 'next/image';
import { ICONS } from '@/constants/icons';
import Dropdown from '@/components/atoms/DropDown/DropDown';

const GRADE_OPTIONS = [
  { label: '등급', value: 'ALL' },
  { label: 'COMMON', value: 'COMMON' },
  { label: 'RARE', value: 'RARE' },
  { label: 'SUPER RARE', value: 'SUPER RARE' },
  { label: 'LEGENDARY', value: 'LEGENDARY' },
];

const GENRE_OPTIONS = [
  { label: '장르', value: 'ALL' },
  { label: '풍경', value: '풍경' },
  { label: '여행', value: '여행' },
];

export default function MyGalleryFilterBar({
  isMobile,
  search,
  onChangeSearch,
  grade,
  onChangeGrade,
  genre,
  onChangeGenre,
  onOpenMobileFilter,
}) {
  // ✅ Dropdown이 value(string) 또는 event 둘 다 줄 수 있어서 여기서 통일 처리
  const handleGradeChange = (eOrValue) => {
    const next =
      typeof eOrValue === 'string'
        ? eOrValue
        : (eOrValue?.target?.value ??
          eOrValue?.currentTarget?.value ??
          eOrValue?.target?.dataset?.value ??
          eOrValue?.currentTarget?.dataset?.value);

    if (next == null) return;
    onChangeGrade(next);
  };

  const handleGenreChange = (eOrValue) => {
    const next =
      typeof eOrValue === 'string'
        ? eOrValue
        : (eOrValue?.target?.value ??
          eOrValue?.currentTarget?.value ??
          eOrValue?.target?.dataset?.value ??
          eOrValue?.currentTarget?.dataset?.value);

    if (next == null) return;
    onChangeGenre(next);
  };

  // =====================
  // Mobile
  // =====================
  if (isMobile) {
    return (
      <div className="mt-[16px] flex items-center gap-[12px]">
        <button
          type="button"
          onClick={onOpenMobileFilter}
          aria-label="필터 열기"
          className="w-[50px] h-[50px] flex items-center justify-center border border-white/40 rounded-[6px]"
        >
          <Image src={ICONS.DROPDOWN} alt="" width={24} height={24} />
        </button>

        <div className="flex-1 h-[50px] flex items-center px-[16px] border border-white/40 rounded-[6px]">
          <input
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="검색"
            className="w-full bg-transparent outline-none text-white placeholder:text-white/40"
          />
          <Image src="/assets/icons/ic_search.svg" alt="검색" width={24} height={24} />
        </div>
      </div>
    );
  }

  // =====================
  // Desktop / Tablet (stack on mobile & tablet, row on desktop lg+)
  // =====================
  return (
    <div className="mt-4 md:mt-[24px] lg:mt-[30px] flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-0 min-w-0">
      {/* 검색 - full width on mobile/tablet, fixed on desktop */}
      <div className="w-full lg:w-[320px] h-[48px] md:h-[50px] shrink-0 flex items-center px-4 md:px-[20px] border border-white/40 rounded-[6px]">
        <input
          value={search}
          onChange={(e) => onChangeSearch(e.target.value)}
          placeholder="검색"
          className="w-full bg-transparent outline-none text-white placeholder:text-white/40 min-w-0 text-sm md:text-base"
        />
        <Image src="/assets/icons/ic_search.svg" alt="검색" width={24} height={24} />
      </div>

      {/* 간격 - desktop only */}
      <div className="hidden lg:block w-[60px] shrink-0" />

      {/* 드롭다운 2개 - row that can wrap on very narrow tablet */}
      <div className="flex flex-wrap items-center gap-2 lg:gap-[10px] shrink-0">
        <div className="w-[100px] md:w-[120px] h-[48px] md:h-[50px] shrink-0">
          <Dropdown
            label="등급"
            value={grade}
            options={GRADE_OPTIONS}
            onChange={handleGradeChange}
          />
        </div>
        <div className="w-[100px] md:w-[128px] h-[48px] md:h-[50px] shrink-0">
          <Dropdown
            label="장르"
            value={genre}
            options={GENRE_OPTIONS}
            onChange={handleGenreChange}
          />
        </div>
      </div>
    </div>
  );
}
