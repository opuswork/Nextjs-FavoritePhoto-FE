'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useBreakpoint from '@/hooks/useBreakpoint';
import { http } from '@/lib/http/client';
import { apiGradeToDisplay } from '../_components/MyInfoShell';
import CardOriginal from '@/components/organisms/CardOriginal/CardOriginal';
import MyInfoMobileHeader from '../_components/MyInfoMobileHeader';

const API_BASE = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_BASE_URL || '') : '';

function resolveImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return '/assets/products/photo-card.svg';
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (API_BASE && trimmed.startsWith('/')) return API_BASE.replace(/\/$/, '') + trimmed;
  return trimmed || '/assets/products/photo-card.svg';
}

/** Map API listing item (GET /api/listings/my) to CardOriginal display shape */
function listingToCard(item) {
  const pc = item?.photoCard ?? {};
  const grade = pc?.grade;
  const displayGrade = apiGradeToDisplay(grade);
  const quantity = Number(item?.quantity ?? 0);
  const pricePerUnit = Number(item?.pricePerUnit ?? 0);
  return {
    id: item?.listingId,
    listingId: item?.listingId,
    userCardId: item?.userCardId,
    rarity: displayGrade,
    category: pc?.genre ?? '풍경',
    owner: item?.sellerNickname ?? '나',
    description: pc?.name ?? pc?.description ?? '-',
    price: `${pricePerUnit} P`,
    remaining: quantity,
    outof: quantity,
    imageSrc: resolveImageUrl(pc?.imageUrl),
    status: item?.status,
  };
}

const PAGE_SIZE = 15;

export default function SellingCardPage() {
  const router = useRouter();
  const bp = useBreakpoint();
  const isMobile = bp === 'sm';
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('ALL');
  const [genre, setGenre] = useState('ALL');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchMyListings() {
      setLoading(true);
      setError(null);
      try {
        const res = await http.get('/api/listings/my', { params: { limit: 50 } });
        const data = res.data?.data;
        const items = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled) setListings(items);
      } catch (err) {
        if (!cancelled) {
          setListings([]);
          setError(err?.response?.data?.message ?? err?.message ?? '판매 중인 포토카드를 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchMyListings();
    return () => { cancelled = true; };
  }, []);

  const displayCards = useMemo(
    () => listings.map(listingToCard),
    [listings],
  );

  const gradeCounts = useMemo(() => {
    const initial = { total: 0, common: 0, rare: 0, superRare: 0, legendary: 0 };
    displayCards.forEach((c) => {
      const qty = Number(c.remaining ?? c.outof ?? 0) || 1;
      initial.total += qty;
      if (c.rarity === 'COMMON') initial.common += qty;
      else if (c.rarity === 'RARE') initial.rare += qty;
      else if (c.rarity === 'SUPER RARE') initial.superRare += qty;
      else if (c.rarity === 'LEGENDARY') initial.legendary += qty;
    });
    return initial;
  }, [displayCards]);

  const filteredCards = useMemo(() => {
    return displayCards.filter((c) => {
      const okSearch = search
        ? `${c.description ?? ''} ${c.owner ?? ''} ${c.category ?? ''}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const okGrade = grade === 'ALL' ? true : c.rarity === grade;
      const okGenre = genre === 'ALL' ? true : c.category === genre;
      return okSearch && okGrade && okGenre;
    });
  }, [displayCards, search, grade, genre]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));
  const pagedCards = filteredCards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [search, grade, genre]);

  if (loading) {
    return (
      <div className={styles.listWrapper}>
        <p className="text-white/60">비밀번호를 불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-[520px]">
      <p className="text-white/70">비밀번호 변경 기능은 준비 중입니다.</p>
    </div>
  );
}
