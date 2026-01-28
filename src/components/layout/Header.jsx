'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/layout/Container';

export default function Header({ userName = '유디', points = 1540, onLogout, onOpenAlarm }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <header className="w-full bg-black">
      <Container className="flex h-[72px] items-center justify-between">
        {/* Desktop (>= 768px): 기존 레이아웃 */}
        <div className="hidden min-[768px]:flex min-[768px]:w-full min-[768px]:items-center min-[768px]:justify-between">
          <Link href="/" className="text-[24px] font-extrabold text-white no-underline">
            최애<span className="text-yellow-300">의</span>포토
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <span>{points.toLocaleString()}</span>
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
            <span>{userName}</span>
            <span className="mx-1 h-4 w-px bg-white/20" />
            <button type="button" onClick={onLogout} className="text-white/50 hover:text-white">
              로그아웃
            </button>
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
                  <div className="flex items-center gap-1 px-4 py-2 text-sm text-white/80">
                    <span>{points.toLocaleString()}</span>
                    <span>P</span>
                  </div>
                  <div className="my-1 h-px w-full bg-white/20" />
                  <div className="px-4 py-2 text-sm text-white">{userName}</div>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout?.();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-white/50 hover:bg-white/10 hover:text-white"
                  >
                    로그아웃
                  </button>
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
