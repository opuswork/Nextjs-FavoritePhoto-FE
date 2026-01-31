'use client';

import { useRouter } from 'next/navigation';

import Container from '@/components/layout/Container';
import Title from '@/components/atoms/Title/Title';
import ButtonPrimary from '@/components/atoms/Button/ButtonPrimary';

export default function MyGalleryShell({ children }) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white">
      <Container className="pt-[60px] pb-[20px]">
        {/* title + button */}
        <div className="flex items-center justify-between gap-6">
          <Title
            text="마이갤러리"
            as="h1"
            showLine={false}
            style={{ fontSize: '62px', lineHeight: '100%' }}
          />

          <ButtonPrimary
            size="l"
            thickness="thick"
            className="w-[440px] h-[60px]"
            onClick={() => router.push('/mygallery/create')}
          >
            포토카드 생성하기
          </ButtonPrimary>
        </div>

        {/* line */}
        <div className="mt-[20px] mb-[50px] h-[2px] w-full bg-[#EEEEEE]" />

        {/* 보유 포토카드 영역 */}
        <div className="mt-[24px]">
          <div className="flex items-end gap-2">
            <span className="text-[24px] font-bold leading-[100%] text-white/80">
              유디님이 보유한 포토카드
            </span>
            <span className="text-[20px] font-normal leading-[100%] text-white/50">(40장)</span>
          </div>
        </div>

        {/* page.jsx에서 FilterBar + Grid + Pagination 렌더링 */}
        <div className="mt-[24px]">{children}</div>
      </Container>
    </main>
  );
}
