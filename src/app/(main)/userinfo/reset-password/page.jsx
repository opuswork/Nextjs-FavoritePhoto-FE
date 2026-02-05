'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useBreakpoint from '@/hooks/useBreakpoint';
import { http } from '@/lib/http/client';
import { apiGradeToDisplay } from '../_components/MyInfoShell';
//import MyInfoMobileHeader from '../_components/MyInfoMobileHeader';

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const bp = useBreakpoint();
  const isMobile = bp === 'sm';
  const [resetPassword, setResetPassword] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchResetPassword() {
      setLoading(true);
      setError(null);
      try {
        const res = await http.get('/api/users/me/reset-password');
        if (!cancelled) setResetPassword(res?.data?.data ?? null);
      } catch (err) {
        if (!cancelled) {
          setResetPassword(null);
          setError(err?.response?.data?.message ?? err?.message ?? '비밀번호 변경이 정상동작하지 않습니다.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchResetPassword();
    return () => { cancelled = true; };
  }, []);


  if (loading) {
    return <p className="text-white/60">비밀번호를 불러오는 중…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const handleResetPassword = useCallback(async () => {
    try {
      await http.post('/api/users/me/reset-password');
      setResetPassword(null);
      router.push('/userinfo');
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? '비밀번호 변경이 정상동작하지 않습니다.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="mt-8 max-w-[520px]">
      {resetPassword ? (
        <ResetPasswordForm
          resetPassword={resetPassword}
          onResetPassword={handleResetPassword}
        />
      ) : (
        <p className="text-white/60">비밀번호 변경이 정상동작하지 않습니다.</p>
      )}
    </div>
  );
}
