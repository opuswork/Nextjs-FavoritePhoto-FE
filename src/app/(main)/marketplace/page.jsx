// src/app/(main)/marketplace/page.jsx

import SubHeader from '@/components/organisms/SubHeader/SubHeader';

export default function MarketplacePage() {
  return (
    <div className="w-full bg-black text-white">
      <SubHeader />

      <div className="mx-auto w-full max-w-[1480px] px-5 py-10">
        <div className="text-white/60">카드 리스트 영역(추가 구현 예정)</div>
      </div>
    </div>
  );
}