'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import { useMyInfo } from '../_components/MyInfoShell';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useMyInfo();
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


  // Google 로그인 등 비밀번호가 없는 사용자는 이 페이지 사용 불가
  if (!userLoading && user && user.hasPassword === false) {
    return (
      <div className="mt-8 max-w-[520px]">
        <p className="text-white/70">비밀번호로 가입한 계정만 비밀번호를 변경할 수 있습니다.</p>
        <Link href="/userinfo" className="mt-4 inline-block text-yellow-300 hover:underline">
          회원정보로 돌아가기
        </Link>
      </div>
    );
  }

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
        <div className="text-white/70">
          비밀번호 변경 폼 (ResetPasswordForm 연결 후 사용)
          <button
            type="button"
            onClick={handleResetPassword}
            className="ml-2 text-yellow-300 hover:underline"
          >
            확인
          </button>
        </div>
      ) : (
        <p className="text-white/60">비밀번호 변경이 정상동작하지 않습니다.</p>
      )}
    </div>
  );
}
