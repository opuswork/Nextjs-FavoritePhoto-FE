'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/atoms/Input/Input';
import Label from '@/components/atoms/Label/Label';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const API_AUTH = '/api/auth';

function validateEmail(value) {
  if (!value.trim()) return '이메일을 입력해 주세요.';
  if (!value.includes('@')) return '이메일 주소 형식이 올바르지 않습니다.';
  return null;
}

function validateNickname(value) {
  if (!value.trim()) return '닉네임을 입력해 주세요.';
  return null;
}

function validatePassword(value) {
  if (!value) return '비밀번호를 입력해 주세요.';
  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
    return '비밀번호는 8자 이상 입력해 주세요.';
  }
  return null;
}

function validateConfirmPassword(password, confirm) {
  if (!confirm) return '비밀번호를 한번 더 입력해 주세요.';
  if (password !== confirm) return '비밀번호가 일치하지 않습니다.';
  return null;
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If already logged in, redirect to mygallery (replace so back button doesn't return to signup)
  useEffect(() => {
    let cancelled = false;
    async function checkAuth() {
      try {
        await http.get('/users/me');
        if (!cancelled) router.replace('/mygallery');
      } catch {
        if (!cancelled) setCheckingAuth(false);
      }
    }
    checkAuth();
    return () => { cancelled = true; };
  }, [router]);

  // Email verification (인증코드 발송 → 6자리 입력 → 인증완료)
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [hasVerifiedOnce, setHasVerifiedOnce] = useState(false); // true after first successful verify (re-verify requires sendCodeCount > 2)
  const [sendCodeCount, setSendCodeCount] = useState(0); // times "인증코드발송" clicked for current email
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(''); // success or error for send
  const [verifyError, setVerifyError] = useState('');

  const handleSendCode = async () => {
    const eErr = validateEmail(email);
    setEmailError(eErr || '');
    setVerificationMessage('');
    setVerifyError('');
    if (eErr) return;

    setSendCodeLoading(true);
    try {
      await http.post(`${API_AUTH}/request-verification`, { email: email.trim() });
      setVerificationMessage('인증코드가 이메일로 발송되었습니다.');
      setVerificationCode('');
      setSendCodeCount((c) => c + 1);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? '인증코드 발송에 실패했습니다.';
      setVerificationMessage(msg);
    } finally {
      setSendCodeLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const eErr = validateEmail(email);
    setEmailError(eErr || '');
    setVerifyError('');
    if (eErr) return;
    if (!verificationCode.trim()) {
      setVerifyError('인증코드 6자리를 입력해 주세요.');
      return;
    }

    setVerifyLoading(true);
    try {
      await http.post(`${API_AUTH}/verify-code`, {
        email: email.trim(),
        code: verificationCode.trim(),
      });
      setEmailVerified(true);
      setHasVerifiedOnce(true);
      setVerifyError('');
      setVerificationMessage('');
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? '인증에 실패했습니다.';
      setVerifyError(msg);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) return;
    const eErr = validateEmail(email);
    const nErr = validateNickname(nickname);
    const pErr = validatePassword(password);
    const cErr = validateConfirmPassword(password, confirmPassword);
    setEmailError(eErr || '');
    setNicknameError(nErr || '');
    setPasswordError(pErr || '');
    setConfirmError(cErr || '');
    setSubmitError('');
    if (eErr || nErr || pErr || cErr) return;

    setLoading(true);
    setSubmitError('');
    try {
      await http.post('/users/register', {
        email: email.trim(),
        nickname: nickname.trim(),
        password,
      });
      router.push('/mygallery');
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        '회원가입에 실패했습니다.';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  // Safeguard: never render the signup form until auth check is done. Logged-in users see spinner then redirect.
  if (checkingAuth) {
    return (
      <div className="min-h-full w-full bg-black flex flex-col items-center justify-center px-4 py-8">
        <div className={styles.form}>
          <h1 className={styles.logo}>
            최애<span className={styles.logoAccent}>의</span>포토
          </h1>
          <span className="inline-flex items-center justify-center" aria-hidden>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-transparent" />
          </span>
        </div>
      </div>
    );
  }

  // Only reached when user is not logged in
  return (
    <div className="min-h-full w-full bg-black flex flex-col items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h1 className={styles.logo}>
          <Link href="/" className={styles.logoLink}>최애<span className={styles.logoAccent}>의</span>포토</Link>
        </h1>

        <div className="w-full">
          <Label htmlFor="signup-email" className={styles.label}>
            이메일
          </Label>
          <div className={styles.emailRow}>
            <Input
              id="signup-email"
              type="email"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                setVerificationMessage('');
                setVerifyError('');
                setEmailVerified(false);
                setSendCodeCount(0);
              }}
              className={`${styles.inputField} ${styles.inputFieldNoIcon} ${emailError ? styles.inputError : ''}`}
            />
            <button
              type="button"
              className={styles.sendCodeButton}
              onClick={handleSendCode}
              disabled={sendCodeLoading}
            >
              {sendCodeLoading ? '발송 중...' : '인증코드발송'}
            </button>
          </div>
          {emailError && <p className={styles.errorMessage}>{emailError}</p>}
          {verificationMessage && (
            <p className={verificationMessage.startsWith('인증코드가') ? styles.verificationSuccess : styles.errorMessage}>
              {verificationMessage}
            </p>
          )}
        </div>

        {sendCodeCount >= 1 && (
          <div className="w-full">
            <Label htmlFor="signup-verify-code" className={styles.label}>
              인증코드 (6자리)
            </Label>
            <div className={styles.verifyRow}>
              <input
                id="signup-verify-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  setVerificationCode(v);
                  setVerifyError('');
                }}
                className={styles.verifyInput}
              />
              <button
                type="button"
                className={styles.verifyButton}
                onClick={handleVerifyCode}
                disabled={
                  verifyLoading ||
                  verificationCode.length !== 6 ||
                  emailVerified ||
                  (hasVerifiedOnce ? sendCodeCount <= 2 : sendCodeCount < 1)
                }
              >
                {verifyLoading ? '확인 중...' : '인증완료'}
              </button>
            </div>
            {verifyError && <p className={styles.errorMessage}>{verifyError}</p>}
            {emailVerified && <p className={styles.verificationSuccess}>이메일 인증이 완료되었습니다.</p>}
          </div>
        )}

        <div className="w-full">
          <Label htmlFor="signup-nickname" className={styles.label}>
            닉네임
          </Label>
          <Input
            id="signup-nickname"
            type="text"
            placeholder="닉네임을 입력해 주세요"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              if (nicknameError) setNicknameError('');
            }}
            className={`${styles.inputField} ${styles.inputFieldNoIcon} ${nicknameError ? styles.inputError : ''}`}
          />
          {nicknameError && <p className={styles.errorMessage}>{nicknameError}</p>}
        </div>

        <div className="w-full">
          <Label htmlFor="signup-password" className={styles.label}>
            비밀번호
          </Label>
          <div className={styles.inputWrapper}>
            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="8자 이상 입력해 주세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (confirmError && confirmPassword) setConfirmError('');
              }}
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

        <div className="w-full">
          <Label htmlFor="signup-confirm" className={styles.label}>
            비밀번호 확인
          </Label>
          <div className={styles.inputWrapper}>
            <Input
              id="signup-confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="비밀번호를 한번 더 입력해 주세요"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) setConfirmError('');
              }}
              className={`${styles.inputField} ${confirmError ? styles.inputError : ''}`}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              tabIndex={-1}
            >
              <img
                src={showConfirmPassword ? '/assets/icons/ic_eye_on.svg' : '/assets/icons/ic_eye_off.svg'}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
          {confirmError && <p className={styles.errorMessage}>{confirmError}</p>}
        </div>

        {submitError && <p className={styles.errorMessage}>{submitError}</p>}

        <div className={styles.buttonWrap}>
          <button
            type="submit"
            className={styles.signupButton}
            disabled={loading || !emailVerified}
          >
            {loading ? '처리 중...' : '가입하기'}
          </button>
        </div>

        <p className={styles.loginLinkWrap}>
          이미 최애의포토 회원이신가요?
          <Link href="/auth/login" className={styles.loginLink}>
            로그인하기
          </Link>
        </p>
      </form>
    </div>
  );
}
