'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubHeader from '@/components/organisms/SubHeader/SubHeader';
import CardOriginal from '@/components/organisms/CardOriginal/CardOriginal';
import CardSellingListModal from '@/components/organisms/CardSellingListModal/CardSellingListModal';
import { sampleCards } from './sampleCards';
import styles from './page.module.css';

const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;

function filterCards(cards, filters) {
  const { rarity, genre, soldout } = filters || {};
  return cards.filter((c) => {
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
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);
  const [filters, setFilters] = useState({ rarity: 'all', genre: 'all', soldout: 'all' });
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  const loadMoreRef = useRef(null);

  const filteredCards = useMemo(() => filterCards(sampleCards, filters), [filters]);
  const visibleCards = useMemo(() => filteredCards.slice(0, displayCount), [filteredCards, displayCount]);
  const hasMore = displayCount < filteredCards.length;

  useEffect(() => {
    setDisplayCount(INITIAL_COUNT);
  }, [filters]);

  const loadMore = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasMore) {
        setDisplayCount((n) => Math.min(n + LOAD_MORE_COUNT, filteredCards.length));
      }
    },
    [hasMore, filteredCards.length],
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(loadMore, { root: null, rootMargin: '200px', threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="w-full bg-black text-white">
      <SubHeader
        onSellClick={() => setIsSellingModalOpen(true)}
        filters={filters}
        onFiltersChange={setFilters}
        cards={sampleCards}
      />

      <div className={`mx-auto w-full max-w-[1280px] px-5 py-10 ${styles.listWrapper}`}>
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
              onClick={
                card.remaining > 0
                  ? () => router.push(`/marketplace/${card.id}`)
                  : undefined
              }
            />
          ))}
        </div>
        {hasMore && <div ref={loadMoreRef} className={styles.sentinel} aria-hidden />}
      </div>

      <CardSellingListModal
        open={isSellingModalOpen}
        onClose={() => setIsSellingModalOpen(false)}
        onSellCardSelect={() => {
          setIsSellingModalOpen(false);
          router.push('/marketplace/sell');
        }}
      />
    </div>
  );
}
