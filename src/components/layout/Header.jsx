'use client';

import Link from 'next/link';
import Container from '@/components/layout/Container';

export default function Header({ userName = '유디', points = 1540, onLogout, onOpenAlarm }) {
  return (
    <header className="w-full bg-black">
      <Container className="flex h-[72px] items-center justify-between">
        {/* 왼쪽: 로고 */}
        <Link href="/" className="text-[24px] font-extrabold text-white no-underline">
          최애<span className="text-yellow-300">의</span>포토
        </Link>

        {/* 오른쪽: 액션 영역 */}
        <div className="flex items-center gap-4 text-sm text-white/80">
          {/* 포인트 */}
          <div className="flex items-center gap-1">
            <span>{points.toLocaleString()}</span>
            <span>P</span>
          </div>

          {/* 알림 */}
          <button
            type="button"
            onClick={onOpenAlarm}
            className="rounded p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="알림"
          >
            🔔
          </button>

          {/* 유저 이름 */}
          <span>{userName}</span>

          {/* 구분선 */}
          <span className="mx-1 h-4 w-px bg-white/20" />

          {/* 로그아웃 */}
          <button type="button" onClick={onLogout} className="text-white/50 hover:text-white">
            로그아웃
          </button>
        </div>
      </Container>

      {/* 하단 구분선 */}
      <div className="h-px w-full bg-white/20" />
    </header>
  );
}
