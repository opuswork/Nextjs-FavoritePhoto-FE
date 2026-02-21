'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubHeader from '@/components/organisms/SubHeader/SubHeader';
import CardOriginal from '@/components/organisms/CardOriginal/CardOriginal';
import CardSellingListModal from '@/components/organisms/CardSellingListModal/CardSellingListModal';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

const LISTINGS_LIMIT = 10;
const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;

function listingToCard(item) {
  const pc = item?.photoCard ?? {};
  const quantity = Number(item?.quantity ?? 0);
  const pricePerUnit = item?.pricePerUnit ?? 0;
  return {
    id: item?.listingId,
    rarity: pc?.grade ?? 'COMMON',
    category: pc?.genre ?? '풍경',
    owner: item?.sellerNickname ?? '판매자',
    description: pc?.description || pc?.name || '-',
    price: `${pricePerUnit} P`,
    remaining: quantity,
    outof: quantity,
    imageSrc: pc?.imageUrl || '/assets/products/photo-card.svg',
  };
}

function filterCards(cards, filters, searchQuery = '') {
  const { rarity, genre, soldout } = filters || {};
  const query = (searchQuery || '').trim().toLowerCase();
  return cards.filter((c) => {
    if (query) {
      const description = (c.description ?? '').toLowerCase();
      const owner = (c.owner ?? '').toLowerCase();
      const category = (c.category ?? '').toLowerCase();
      const rarityLabel = (c.rarity ?? '').toLowerCase();
      const price = (c.price ?? '').toLowerCase();
      const match =
        description.includes(query) ||
        owner.includes(query) ||
        category.includes(query) ||
        rarityLabel.includes(query) ||
        price.includes(query);
      if (!match) return false;
    }
    if (rarity && rarity !== 'all') {
      const r = { common: 'COMMON', rare: 'RARE', superRare: 'SUPER RARE', legendary: 'LEGENDARY' }[rarity];
      if (r && c.rarity !== r) return false;
    }
    if (genre && genre !== 'all' && c.category !== genre) return false;
    if (soldout === 'soldout' && c.remaining > 0) return false;
    if (soldout === 'available' && c.remaining === 0) return false;
    return true;
  });
}

export default function MarketplacePage() {
  const router = useRouter();
  
  // --- AUTH & INITIAL LOADING STATE ---
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true); 

  // --- OTHER STATES ---
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ rarity: 'all', genre: 'all', soldout: 'all' });
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  const loadMoreRef = useRef(null);

  const [listings, setListings] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch current user (optional — marketplace is viewable without login)
  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const { data } = await http.get('/users/me');
        if (isMounted) setCurrentUser(data?.user ?? null);
      } catch (err) {
        if (err?.response?.status === 401) {
          if (isMounted) setCurrentUser(null);
        }
      } finally {
        if (isMounted) setUserLoading(false);
      }
    }

    fetchUser();
    return () => { isMounted = false; };
  }, []);

  // 2. Data Fetching Effect
  const fetchListings = useCallback(async (cursor = null, append = false) => {
    const isLoadMore = append && cursor != null;
    if (isLoadMore) setLoadMoreLoading(true);
    else setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: String(LISTINGS_LIMIT) });
      if (cursor != null) params.set('cursor', String(cursor));
      const res = await http.get(`/api/listings?${params.toString()}`);
      const data = res.data?.data;
      const items = data?.items ?? [];
      const next = data?.nextCursor ?? null;
      const cards = items.map(listingToCard);
      if (append) {
        setListings((prev) => [...prev, ...cards]);
      } else {
        setListings(cards);
      }
      setNextCursor(next);
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? '리스팅을 불러오지 못했습니다.');
      if (!append) setListings([]);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // --- MEMOIZED VALUES ---
  const cards = useMemo(() => listings, [listings]);
  const filteredCards = useMemo(
    () => filterCards(cards, filters, searchQuery),
    [cards, filters, searchQuery],
  );
  const visibleCards = useMemo(() => filteredCards.slice(0, displayCount), [filteredCards, displayCount]);
  const hasMore = displayCount < filteredCards.length || nextCursor != null;

  useEffect(() => {
    setDisplayCount(INITIAL_COUNT);
  }, [filters, searchQuery]);

  const loadMore = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry?.isIntersecting || loadMoreLoading) return;
      if (displayCount < filteredCards.length) {
        setDisplayCount((n) => Math.min(n + LOAD_MORE_COUNT, filteredCards.length));
      } else if (nextCursor != null) {
        fetchListings(nextCursor, true);
      }
    },
    [displayCount, filteredCards.length, nextCursor, loadMoreLoading, fetchListings],
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(loadMore, { root: null, rootMargin: '200px', threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  // --- MAIN UI RENDER (login not required to view marketplace) ---
  const handleSellClick = () => {
    if (!currentUser) {
      router.replace('/auth/login');
      return;
    }
    setIsSellingModalOpen(true);
  };

  return (
    <div className="w-full bg-black text-white">
      <SubHeader
        onSellClick={handleSellClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        cards={cards}
      />

      <div className={`mx-auto w-full max-w-[1280px] px-5 py-10 ${styles.listWrapper}`}>
        {loading ? (
          <div className={styles.cardGrid}>로딩 중...</div>
        ) : error ? (
          <div className={styles.cardGrid}>{error}</div>
        ) : visibleCards.length === 0 ? (
          <div className={styles.cardGrid}>
            <div className={styles.emptyState}>
              {searchQuery.trim() ? '검색 결과가 없습니다.' : '등록된 카드가 없습니다.'}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.cardGrid}>
              {visibleCards.map((card) => (
                <CardOriginal
                  key={card.id}
                  rarity={card.rarity}
                  category={card.category}
                  owner={card.owner}
                  description={card.description}
                  price={card.price}
                  remaining={card.remaining}
                  outof={card.outof}
                  imageSrc={card.imageSrc}
                  detailHref={card.remaining > 0 ? `/marketplace/${card.id}` : undefined}
                  onClick={
                    card.remaining > 0
                      ? () => router.push(`/marketplace/${card.id}`)
                      : undefined
                  }
                />
              ))}
            </div>
            {(hasMore || loadMoreLoading) && (
              <div ref={loadMoreRef} className={styles.sentinel} aria-hidden>
                {loadMoreLoading && '더 불러오는 중...'}
              </div>
            )}
          </>
        )}
      </div>

      <CardSellingListModal
        open={isSellingModalOpen}
        onClose={() => setIsSellingModalOpen(false)}
        onSellCardSelect={() => {
          setIsSellingModalOpen(false);
          router.push('/marketplace/sell');
        }}
        sellerUserId={currentUser?.id}
      />
    </div>
  );
}