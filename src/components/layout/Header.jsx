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
        <Link
          href="/mygallery/purchase-history"
          onClick={onClose}
          className="text-[14px] font-bold text-white hover:text-yellow-300"
        >
          구매 내역
        </Link>
      </nav>
    </div>
  );
}

// =====================
// Alarm dropdown content
// =====================
function AlarmDropdownContent({ items = [], loading = false }) {
  if (loading) {
    return (
      <div className="flex h-full min-h-[200px] w-full items-center justify-center px-5">
        <p className="text-[14px] text-white/50">불러오는 중...</p>
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="flex h-full min-h-[200px] w-full items-center justify-center px-5">
        <p className="text-[14px] text-white/50">알림이 없습니다.</p>
      </div>
    );
  }
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

  // Alarm dropdown (notifications from API)
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alarmsLoading, setAlarmsLoading] = useState(false);
  const alarmWrapRef = useRef(null);
  const alarmWrapRefMobile = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function fetchNotifications() {
    if (!user?.id) return;
    setAlarmsLoading(true);
    try {
      const { data } = await http.get('/users/me/notifications');
      setAlarms(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? (data.notifications?.length ?? 0));
    } catch {
      setAlarms([]);
      setUnreadCount(0);
    } finally {
      setAlarmsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id) fetchNotifications();
    else {
      setAlarms([]);
      setUnreadCount(0);
    }
  }, [user?.id]);

  async function fetchUser(silent = false) {
    if (!silent) setAuthLoading(true);
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
      if (!silent) setAuthLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [router]);

  // Refetch user when points change (e.g. after purchase) so header/menu show updated points
  useEffect(() => {
    function onUserPointsUpdated() {
      fetchUser(true);
    }
    window.addEventListener('user-points-updated', onUserPointsUpdated);
    return () => window.removeEventListener('user-points-updated', onUserPointsUpdated);
  }, [router]);

  async function handleLogout() {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsAlarmOpen(false);
    try {
      await http.post('/users/logout');
    } catch (_) {}
    clearAuthToken();
    setUser(null);
    router.replace('/');
    router.refresh();
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

                {/* Alarm dropdown */}
                <div ref={alarmWrapRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isAlarmOpen;
                      setIsAlarmOpen(next);
                      setIsProfileOpen(false);
                      if (next) setUnreadCount(0);
                      onOpenAlarm?.();
                    }}
                    className="relative rounded p-2 text-white/70 hover:bg-white/10 hover:text-white"
                    aria-label="알림"
                  >
                    <Image
                      src={unreadCount > 0 ? '/assets/icons/ic_alarm_on.svg' : '/assets/icons/ic_alarm.svg'}
                      alt=""
                      width={24}
                      height={24}
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-black bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {isAlarmOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+10px)] z-[9999] h-[535px] w-[300px] overflow-hidden rounded bg-[#2b2b2b] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                      role="menu"
                    >
                      <AlarmDropdownContent items={alarms} loading={alarmsLoading} />
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
                      //className="absolute right-0 top-[calc(100%+10px)] z-[9999] w-[260px] max-h-[min(80vh,420px)] overflow-y-auto overflow-x-hidden rounded bg-[#161616] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                      className="absolute right-0 top-[calc(100%+10px)] z-[9999] w-[260px] rounded bg-[#161616] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
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
                      <Link
                        href="/mygallery/purchase-history"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                      >
                        포토카드 구매내역
                      </Link>
                      <Link
                        href="/mygallery/edit-card"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                      >
                        포토카드 수정/삭제
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
                  onClick={() => {
                    const next = !isAlarmOpen;
                    setIsAlarmOpen(next);
                    if (next) setUnreadCount(0);
                  }}
                  className="relative rounded p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="알림"
                >
                  <Image
                    src={unreadCount > 0 ? '/assets/icons/ic_alarm_on.svg' : '/assets/icons/ic_alarm.svg'}
                    alt=""
                    width={24}
                    height={24}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-black bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                {isAlarmOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] z-[9999] h-[535px] w-[300px] overflow-hidden rounded bg-[#2b2b2b] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                    role="menu"
                  >
                    <AlarmDropdownContent items={alarms} loading={alarmsLoading} />
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
