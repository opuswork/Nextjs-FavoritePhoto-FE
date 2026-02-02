'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Container from '@/components/layout/Container';
import Title from '@/components/atoms/Title/Title';
import ButtonPrimary from '@/components/atoms/Button/ButtonPrimary';
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

/** Map API row to display shape (id, rarity, category, description, imageSrc, quantity, etc.) for grid/cards. */
export function userCardRowToDisplay(row) {
  const quantity = Number(row?.quantity ?? 0);
  return {
    id: row?.user_card_id,
    user_card_id: row?.user_card_id,
    photo_card_id: row?.photo_card_id,
    quantity,
    rarity: row?.grade ?? 'COMMON',
    grade: row?.grade ?? 'COMMON',
    category: row?.genre ?? '풍경',
    genre: row?.genre ?? '풍경',
    description: row?.name ?? row?.description ?? '-',
    title: row?.name,
    imageSrc: row?.image_url || '/assets/products/photo-card.svg',
    owner: '나',
    price: `${row?.min_price ?? 0} P`,
  };
}

export default function MyGalleryShell({ children }) {
  const router = useRouter();
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

  const displayName = user?.nickname ?? user?.email ?? '유저';
  const totalCount = cards.reduce((sum, row) => sum + Number(row?.quantity ?? 0), 0);

  return (
    <MyGalleryContext.Provider value={{ user, cards, loading, error, refetchCards }}>
      <main className="min-h-screen bg-black text-white">
        <Container className="pt-[60px] pb-[20px]">
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

          <div className="mt-[20px] mb-[50px] h-[2px] w-full bg-[#EEEEEE]" />

          <div className="mt-[24px]">
            <div className="flex items-end gap-2">
              <span className="text-[24px] font-bold leading-[100%] text-white/80">
                {loading ? '…' : `${displayName}님이 보유한 포토카드`}
              </span>
              <span className="text-[20px] font-normal leading-[100%] text-white/50">
                ({loading ? '…' : totalCount}장)
              </span>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="mt-[24px]">{children}</div>
        </Container>
      </main>
    </MyGalleryContext.Provider>
  );
}
