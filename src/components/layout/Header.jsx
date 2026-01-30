'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { http } from '@/lib/http/client';

export default function Header({ onOpenAlarm }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await http.get('/users/me');
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    try {
      await http.post('/users/logout');
      setUser(null);
      router.refresh();
    } catch {
      setUser(null);
      router.refresh();
    }
    setIsMenuOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) && triggerRef.current && !triggerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

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
        {/* Desktop (>= 768px): 기존 레이아웃 */}
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
                <button
                  type="button"
                  onClick={onOpenAlarm}
                  className="rounded p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="알림"
                >
                  🔔
                </button>
                <span>{displayName}</span>
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

        {/* Mobile (< 768px): 메뉴 | 로고 가운데 | 알림 */}
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
            <button
              type="button"
              onClick={onOpenAlarm}
              className="rounded p-2 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="알림"
            >
              🔔
            </button>
          </div>
        </div>
      </Container>

      <div className="h-px w-full bg-white/20" />
    </header>
  );
}
