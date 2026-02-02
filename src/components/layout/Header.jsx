'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { http, clearAuthToken } from '@/lib/http/client';

// =====================
// Profile dropdown content (from header-1)
// =====================
function ProfileDropdownContent({ userName, ownedPoint = 0, onClose }) {
  return (
    <div className="relative h-full w-full px-[20px] pt-[20px] pb-[21px]">
      <p className="text-[20px] font-bold leading-[1.2] text-white">안녕하세요, {userName}님!</p>

      <div className="mt-[18px] flex items-center justify-between">
        <span className="text-[12px] font-light text-white/40">보유 포인트</span>
        <span className="text-[12px] font-normal text-yellow-300">
          {Number(ownedPoint).toLocaleString()} P
        </span>
      </div>

      <div className="mt-[18px] h-px w-full bg-white/10" />

      <nav className="mt-[18px] flex flex-col gap-[15px]">
        <Link
          href="/marketplace"
          onClick={onClose}
          className="text-[14px] font-bold text-white hover:text-yellow-300"
        >
          마켓플레이스
        </Link>
        <Link
          href="/mygallery"
          onClick={onClose}
          className="text-[14px] font-bold text-white hover:text-yellow-300"
        >
          마이갤러리
        </Link>
        <Link
          href="/mygallery/selling-card"
          onClick={onClose}
          className="text-[14px] font-bold text-white hover:text-yellow-300"
        >
          판매 중인 포토카드
        </Link>
      </nav>
    </div>
  );
}

// =====================
// Alarm dropdown content (from header-1)
// =====================
function AlarmDropdownContent({ items = [] }) {
  return (
    <div className="h-full w-full">
      <div className="h-full overflow-y-auto no-scrollbar">
        {items.map((it, idx) => (
          <div key={it.id ?? idx}>
            <div className="px-[20px] py-[20px]">
              <p className="text-[14px] font-normal leading-[1.4] text-white">{it.message}</p>
              <p className="mt-[10px] text-[12px] font-light text-white/40">{it.timeText}</p>
            </div>
            {idx !== items.length - 1 && <div className="h-px w-full bg-white/10" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Header({ onOpenAlarm }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Profile dropdown (from header-1)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileWrapRef = useRef(null);

  // Alarm dropdown (from header-1)
  const [isAlarmOn] = useState(true);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const alarmWrapRef = useRef(null);
  const alarmWrapRefMobile = useRef(null);

  const mockAlarms = [
    { id: 1, message: '김머누님이 [RARE] 우리집 앞마당을 1장 구매했습니다.', timeText: '1시간 전' },
    {
      id: 2,
      message: '예진쓰님이 [COMMON] 스페인 여행의 포토 카드 교환을 제안했습니다.',
      timeText: '1시간 전',
    },
    { id: 3, message: '[LEGENDARY] 우리집 앞마당이 품절되었습니다.', timeText: '1시간 전' },
    {
      id: 4,
      message: '[RARE] How Far I\'ll Go 3장을 성공적으로 구매했습니다.',
      timeText: '1시간 전',
    },
    {
      id: 5,
      message: '예진쓰님과의 [COMMON] 스페인 여행의 포토카드 교환이 성사되었습니다.',
      timeText: '1시간 전',
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await http.get('/users/me');
        setUser(data.user ?? null);
      } catch (err) {
        setUser(null);
        const redirectTo = err?.response?.data?.redirectTo;
        if (err?.response?.status === 401 && redirectTo) {
          router.replace(redirectTo);
        }
      } finally {
        setAuthLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  async function handleLogout() {
    try {
      await http.post('/users/logout');
    } finally {
      clearAuthToken();
      setUser(null);
      router.replace('/');
      router.refresh();
    }
    clearAuthToken();
    setUser(null);
    router.replace('/');
    router.refresh();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsAlarmOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) && triggerRef.current && !triggerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (profileWrapRef.current && !profileWrapRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      const inAlarm =
        alarmWrapRef.current?.contains(e.target) || alarmWrapRefMobile.current?.contains(e.target);
      if (isAlarmOpen && !inAlarm) setIsAlarmOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAlarmOpen, isProfileOpen, isMenuOpen]);

  useLayoutEffect(() => {
    if (!mounted || !isMenuOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, [mounted, isMenuOpen]);

  const displayName = user?.nickname ?? user?.email ?? '';
  const points = user?.points ?? 0;

  return (
    <header className="w-full bg-black">
      <Container className="flex h-[72px] items-center justify-between">
        {/* Desktop (>= 768px) */}
        <div className="hidden min-[768px]:flex min-[768px]:w-full min-[768px]:items-center min-[768px]:justify-between">
          <Link href="/" className="text-[24px] font-extrabold text-white no-underline">
            최애<span className="text-yellow-300">의</span>포토
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/80">
            {authLoading ? (
              <span className="text-white/50">...</span>
            ) : user ? (
              <>
                <div className="flex items-center gap-1">
                  <span>{Number(points).toLocaleString()}</span>
                  <span>P</span>
                </div>

                {/* Alarm dropdown (from header-1) */}
                <div ref={alarmWrapRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAlarmOpen((v) => !v);
                      setIsProfileOpen(false);
                      onOpenAlarm?.();
                    }}
                    className="relative rounded p-2 text-white/70 hover:bg-white/10 hover:text-white"
                    aria-label="알림"
                  >
                    <Image
                      src={isAlarmOn ? '/assets/icons/ic_alarm_on.svg' : '/assets/icons/ic_alarm.svg'}
                      alt=""
                      width={24}
                      height={24}
                    />
                    {isAlarmOn && (
                      <span className="absolute right-[9px] top-[9px] h-[6px] w-[6px] rounded-full bg-red-500" />
                    )}
                  </button>
                  {isAlarmOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+10px)] z-[9999] h-[535px] w-[300px] overflow-hidden rounded bg-[#2b2b2b] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                      role="menu"
                    >
                      <AlarmDropdownContent items={mockAlarms} />
                    </div>
                  )}
                </div>

                {/* Profile dropdown (from header-1) */}
                <div ref={profileWrapRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen((v) => !v);
                      setIsAlarmOpen(false);
                    }}
                    className="rounded px-2 py-1 text-white hover:bg-white/10 font-['BR_B']"
                  >
                    {displayName}
                  </button>
                  {isProfileOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+10px)] z-[9999] h-[231px] w-[260px] overflow-hidden rounded bg-[#161616] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                      role="menu"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                      <ProfileDropdownContent
                        userName={displayName}
                        ownedPoint={points}
                        onClose={() => setIsProfileOpen(false)}
                      />
                    </div>
                  )}
                </div>

                <span className="mx-1 h-4 w-px bg-white/20" />
                <button type="button" onClick={handleLogout} className="text-white/50 hover:text-white">
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="text-yellow-300 hover:underline">
                로그인
              </Link>
            )}
          </div>
        </div>

        {/* Mobile (< 768px) */}
        <div className="flex w-full min-[768px]:hidden items-center gap-2 px-2">
          <div className="relative flex min-w-0 flex-1 justify-start">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="rounded p-2 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="메뉴"
            >
              <Image src="/assets/icons/ic_menu.svg" alt="메뉴" width={24} height={24} />
            </button>
            {mounted &&
              isMenuOpen &&
              createPortal(
                <div
                  ref={menuRef}
                  className="fixed z-[9999] min-w-[160px] rounded border border-white/20 bg-[#1a1a1a] py-2 shadow-lg"
                  style={{ top: dropdownStyle.top, left: dropdownStyle.left }}
                  role="menu"
                >
                  {user ? (
                    <>
                      <div className="flex items-center gap-1 px-4 py-2 text-sm text-white/80">
                        <span>{Number(points).toLocaleString()}</span>
                        <span>P</span>
                      </div>
                      <div className="my-1 h-px w-full bg-white/20" />
                      <Link
                        href="/marketplace"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                      >
                        마켓플레이스
                      </Link>
                      <Link
                        href="/mygallery"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                      >
                        마이갤러리
                      </Link>
                      <Link
                        href="/mygallery/selling-card"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                      >
                        판매 중인 포토카드
                      </Link>
                      <div className="my-1 h-px w-full bg-white/20" />
                      <div className="px-4 py-2 text-sm text-white">{displayName}</div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-white/50 hover:bg-white/10 hover:text-white"
                      >
                        로그아웃
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 text-sm text-yellow-300 hover:bg-white/10 hover:underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      로그인
                    </Link>
                  )}
                </div>,
                document.body,
              )}
          </div>
          <Link
            href="/"
            className="flex flex-1 justify-center text-[20px] font-extrabold text-white no-underline min-[500px]:text-[24px]"
          >
            최애<span className="text-yellow-300">의</span>포토
          </Link>
          <div className="flex min-w-0 flex-1 justify-end">
            {user ? (
              <div ref={alarmWrapRefMobile} className="relative">
                <button
                  type="button"
                  onClick={() => setIsAlarmOpen((v) => !v)}
                  className="relative rounded p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="알림"
                >
                  <Image
                    src={isAlarmOn ? '/assets/icons/ic_alarm_on.svg' : '/assets/icons/ic_alarm.svg'}
                    alt=""
                    width={24}
                    height={24}
                  />
                  {isAlarmOn && (
                    <span className="absolute right-[9px] top-[9px] h-[6px] w-[6px] rounded-full bg-red-500" />
                  )}
                </button>
                {isAlarmOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] z-[9999] h-[535px] w-[300px] overflow-hidden rounded bg-[#2b2b2b] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                    role="menu"
                  >
                    <AlarmDropdownContent items={mockAlarms} />
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="rounded p-2 text-sm font-semibold text-yellow-300 hover:bg-white/10">
                로그인
              </Link>
            )}
          </div>
        </div>
      </Container>

      <div className="h-px w-full bg-white/20" />
    </header>
  );
}
