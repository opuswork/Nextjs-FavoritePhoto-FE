'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Container from '@/components/layout/Container';
import Title from '@/components/atoms/Title/Title';
import ButtonPrimary from '@/components/atoms/Button/ButtonPrimary';
import useBreakpoint from '@/hooks/useBreakpoint';
import { http } from '@/lib/http/client';

/** API row from GET /users/me/cards (user_card + photo_card). */
export const MyGalleryContext = createContext({
  user: null,
  cards: [],
  loading: true,
  error: null,
  refetchCards: () => {},
});

export function useMyGallery() {
  const ctx = useContext(MyGalleryContext);
  if (!ctx) throw new Error('useMyGallery must be used within MyGalleryShell');
  return ctx;
}

const API_BASE = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_BASE_URL || '') : '';

/** Resolve image URL: use as-is if absolute (http/https), else prepend API base for backend paths. */
function resolveImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return '/assets/products/photo-card.svg';
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (API_BASE && trimmed.startsWith('/')) return API_BASE.replace(/\/$/, '') + trimmed;
  return trimmed || '/assets/products/photo-card.svg';
}

/** Map API grade (common, rare, epic, legendary) to display grade (COMMON, RARE, SUPER RARE, LEGENDARY). */
export function apiGradeToDisplay(grade) {
  if (grade == null || String(grade).trim() === '') return 'COMMON';
  const s = String(grade).trim();
  const g = s.toLowerCase();
  if (s === 'COMMON' || g === 'common') return 'COMMON';
  if (s === 'RARE' || g === 'rare') return 'RARE';
  if (s === 'SUPER RARE' || g === 'epic') return 'SUPER RARE';
  if (s === 'LEGENDARY' || g === 'legendary') return 'LEGENDARY';
  return 'COMMON';
}

/** Map API row to display shape (id, rarity, category, description, imageSrc, quantity, etc.) for grid/cards. */
export function userCardRowToDisplay(row) {
  const quantity = Number(row?.quantity ?? 0);
  const rawGrade = row?.grade ?? row?.photo_card?.grade ?? row?.photoCard?.grade;
  const displayGrade = apiGradeToDisplay(rawGrade);
  return {
    id: row?.user_card_id,
    user_card_id: row?.user_card_id,
    photo_card_id: row?.photo_card_id,
    quantity,
    rarity: displayGrade,
    grade: displayGrade,
    category: row?.genre ?? '풍경',
    genre: row?.genre ?? '풍경',
    description: row?.name ?? row?.description ?? '-',
    title: row?.name,
    imageSrc: resolveImageUrl(row?.image_url),
    owner: '나',
    price: `${row?.min_price ?? 0} P`,
  };
}

const MYGALLERY_REFETCH_KEY = 'mygallery-refetch';

export default function MyGalleryShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const bp = useBreakpoint();
  const isMobile = bp === 'sm';
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await http.get('/users/me');
      setUser(data?.user ?? null);
      return data?.user ?? null;
    } catch (err) {
      if (err?.response?.status === 401) {
        const redirectTo = err?.response?.data?.redirectTo;
        if (redirectTo) router.replace(redirectTo);
        else router.replace('/auth/login');
      }
      setUser(null);
      return null;
    }
  }, [router]);

  const fetchCards = useCallback(async () => {
    try {
      const res = await http.get('/users/me/cards');
      const data = res.data?.data ?? [];
      setCards(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      if (err?.response?.status === 401) {
        const redirectTo = err?.response?.data?.redirectTo;
        if (redirectTo) router.replace(redirectTo);
        else router.replace('/auth/login');
      }
      setCards([]);
      setError(err?.response?.data?.message ?? err?.message ?? '보유 카드를 불러오지 못했습니다.');
    }
  }, [router]);

  const refetchCards = useCallback(() => {
    return fetchCards();
  }, [fetchCards]);

  // Initial load
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const u = await fetchUser();
      if (cancelled) return;
      if (u) await fetchCards();
      if (cancelled) return;
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [fetchUser, fetchCards]);

  // Refetch when landing on /mygallery after creating a card (create-card sets sessionStorage flag)
  // Also refetch user so points (e.g. +20 for new photo) are updated in the UI
  useEffect(() => {
    if (pathname !== '/mygallery') return;
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem(MYGALLERY_REFETCH_KEY)) {
        sessionStorage.removeItem(MYGALLERY_REFETCH_KEY);
        fetchUser();
        fetchCards();
      }
    } catch (_) {}
  }, [pathname, fetchUser, fetchCards]);

  const displayName = user?.nickname ?? user?.email ?? '유저';
  const totalCount = cards.reduce((sum, row) => sum + Number(row?.quantity ?? 0), 0);

  return (
    <MyGalleryContext.Provider value={{ user, cards, loading, error, refetchCards }}>
      <main className="min-h-screen bg-black text-white overflow-x-hidden">
        <Container className="pt-6 pb-4 md:pt-10 md:pb-6 lg:pt-[60px] lg:pb-[20px] min-w-0">
          {/* Title + button: stack on mobile/tablet, row on desktop (lg+) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 lg:gap-6">
            <div className="text-[28px] md:text-[36px] lg:text-[48px] xl:text-[62px] leading-[100%] shrink-0 [&_h1]:!text-inherit">
              <Title text="마이갤러리" as="h1" showLine={false} />
            </div>
            <ButtonPrimary
              size="l"
              thickness="thick"
              fullWidth={isMobile}
              className="min-w-0 w-full md:w-[70px] md:w-1/3 lg:w-auto lg:min-w-[170px] xl:w-[440px] h-[48px] md:h-[52px] lg:h-[60px] shrink-0"
              onClick={() => router.push('/mygallery/create')}
            >
              포토카드 생성하기
            </ButtonPrimary>
          </div>

          <div className="mt-4 md:mt-[20px] mb-6 md:mb-[50px] h-[2px] w-full bg-[#EEEEEE]" />

          {pathname === '/mygallery' && (
            <div className="mt-4 md:mt-[24px] min-w-0">
              <div className="flex flex-wrap items-end gap-2">
                <span className="text-[16px] md:text-[20px] lg:text-[24px] font-bold leading-[100%] text-white/80 break-words">
                  {loading ? '…' : `${displayName}님이 보유한 포토카드`}
                </span>
                <span className="text-[14px] md:text-[16px] lg:text-[20px] font-normal leading-[100%] text-white/50 shrink-0">
                  ({loading ? '…' : totalCount}장)
                </span>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>
          )}

          <div className={pathname === '/mygallery' ? 'mt-4 md:mt-[24px] min-w-0' : 'min-w-0'}>{children}</div>
        </Container>
      </main>
    </MyGalleryContext.Provider>
  );
}
