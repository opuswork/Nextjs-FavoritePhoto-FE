'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useBreakpoint from '@/hooks/useBreakpoint';
import { http } from '@/lib/http/client';
import { apiGradeToDisplay } from '../_components/MyGalleryShell';
import CardOriginal from '@/components/organisms/CardOriginal/CardOriginal';
import MyGalleryMobileHeader from '../_components/MyGalleryMobileHeader';
import Pagination from '../_components/Pagination';

import styles from '../page.module.css';

const API_BASE = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_BASE_URL || '') : '';

function resolveImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return '/assets/products/photo-card.svg';
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (API_BASE && trimmed.startsWith('/')) return API_BASE.replace(/\/$/, '') + trimmed;
  return trimmed || '/assets/products/photo-card.svg';
}

/** Map API purchase row (GET /api/purchases/buyer) to CardOriginal display shape */
function purchaseToCard(item) {
  const grade = item?.grade;
  const displayGrade = apiGradeToDisplay(grade);
  const quantity = Number(item?.quantity ?? 0);
  const totalPrice = Number(item?.total_price ?? 0);
  return {
    id: item?.purchase_id,
    purchaseId: item?.purchase_id,
    listingId: item?.listing_id,
    rarity: displayGrade,
    category: item?.genre ?? '풍경',
    owner: '구매',
    description: item?.name ?? '-',
    price: `${totalPrice} P`,
    remaining: quantity,
    outof: quantity,
    imageSrc: resolveImageUrl(item?.image_url),
    regDate: item?.reg_date,
  };
}

const PAGE_SIZE = 15;

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const bp = useBreakpoint();
  const isMobile = bp === 'sm';
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function fetchPurchases() {
      setLoading(true);
      setError(null);
      try {
        const res = await http.get('/api/purchases/buyer', { params: { limit: 100 } });
        const data = res.data?.data;
        const items = Array.isArray(data) ? data : [];
        if (!cancelled) setPurchases(items);
      } catch (err) {
        if (!cancelled) {
          setPurchases([]);
          setError(err?.response?.data?.message ?? err?.message ?? '구매 내역을 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPurchases();
    return () => { cancelled = true; };
  }, []);

  const displayCards = useMemo(
    () => purchases.map(purchaseToCard),
    [purchases],
  );

  const totalPages = Math.max(1, Math.ceil(displayCards.length / PAGE_SIZE));
  const pagedCards = displayCards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className={styles.listWrapper}>
        <p className="text-white/60">구매 내역을 불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className={styles.listWrapper}>
      {isMobile && (
        <MyGalleryMobileHeader
          title="구매 내역"
          onBack={() => router.back()}
        />
      )}

      {!isMobile && (
        <h1 className="mb-6 mt-2 text-left text-[20px] font-bold text-white md:mb-8 md:mt-4 md:text-[24px] lg:mb-10 lg:mt-6 lg:text-[28px]">
          구매 내역
        </h1>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}

      {!error && displayCards.length === 0 && (
        <p className="mt-8 text-center text-white/60">구매 내역이 없습니다.</p>
      )}

      {!error && displayCards.length > 0 && (
        <>
          <div className={styles.cardGrid}>
            {pagedCards.map((card) => (
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
                detailHref={card.listingId ? `/marketplace/${card.listingId}` : undefined}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
