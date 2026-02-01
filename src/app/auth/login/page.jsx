// src/app/auth/login/page.jsx
// 로그인 페이지
// 일반로그인+ 구글 로그인(현재, 회원가입페이지 없음)
// lib/http/client.js 사용 .env.local 파일에 NEXT_PUBLIC_API_BASE_URL 설정 localhost:3001 -> [https://be-1-yqrf.onrender.com]

'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/atoms/Input/Input';
import Label from '@/components/atoms/Label/Label';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const EMAIL_MIN_LENGTH = 8;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 30;

function validateEmail(value) {
  if (!value.trim()) return '이메일을 입력해 주세요.';
  if (!value.includes('@')) return "이메일 주소 형식이 올바르지 않습니다.";
  if (value.length < EMAIL_MIN_LENGTH) return '이메일은 8자 이상이어야 합니다.';
  return null;
}

function validatePassword(value) {
  if (!value) return '비밀번호를 입력해 주세요.';
  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
    return '비밀번호는 8자 이상 30자 이하여야 합니다.';
  }
  return null;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) setPasswordError(decodeURIComponent(error));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr || '');
    setPasswordError(pErr || '');
    if (eErr || pErr) return;

    setLoading(true);
    setPasswordError('');
    try {
      await http.post('/users/login', { email, password });
      router.push('/mygallery');
    } catch (err) {
      const message = err.response?.data?.message ?? '로그인에 실패했습니다.';
      setPasswordError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  const handleGoogleLogin = () => {
    if (!API_BASE_URL) return;
    window.location.href = `${API_BASE_URL}/users/auth/google`;
  };

  return (
    <div className="min-h-full w-full bg-black flex flex-col items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h1 className={styles.logo}>
          최애<span className={styles.logoAccent}>의</span>포토
        </h1>

        <div className="w-full">
          <Label htmlFor="login-email" className={styles.label}>
            이메일
          </Label>
          <Input
            id="login-email"
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChange={handleEmailChange}
            className={`${styles.inputField} ${styles.inputFieldNoIcon} ${emailError ? styles.inputError : ''}`}
          />
          {emailError && <p className={styles.errorMessage}>{emailError}</p>}
        </div>

        <div className="w-full">
          <Label htmlFor="login-password" className={styles.label}>
            비밀번호
          </Label>
          <div className={styles.inputWrapper}>
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={handlePasswordChange}
              className={`${styles.inputField} ${passwordError ? styles.inputError : ''}`}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              tabIndex={-1}
            >
              <img
                src={showPassword ? '/assets/icons/ic_eye_on.svg' : '/assets/icons/ic_eye_off.svg'}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
          {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
        </div>

        <div className={styles.buttonWrap}>
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>

        <div className={styles.buttonWrap}>
          <button type="button" className={styles.googleLoginButton} onClick={handleGoogleLogin}>
            <img src="/assets/icons/google_button.svg" alt="" width={24} height={24} className={styles.googleButtonIcon} />
            구글 로그인
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-full w-full bg-black flex flex-col items-center justify-center px-4 py-8">
        <div className={styles.form}>
          <h1 className={styles.logo}>
            최애<span className={styles.logoAccent}>의</span>포토
          </h1>
          <p className="text-white/70">로딩 중...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
