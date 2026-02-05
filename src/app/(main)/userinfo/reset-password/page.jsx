'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Input from '@/components/atoms/Input/Input';
import Label from '@/components/atoms/Label/Label';
import { http } from '@/lib/http/client';
import { useMyInfo } from '../_components/MyInfoShell';
import styles from './page.module.css';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

/** Real-time rules for new password (same as backend policy) */
function useNewPasswordRules(password) {
  const len = password?.length ?? 0;
  const hasLetter = /[a-zA-Z]/.test(password ?? '');
  const hasNumber = /[0-9]/.test(password ?? '');
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password ?? '');
  return {
    minLength: len >= PASSWORD_MIN_LENGTH && len <= PASSWORD_MAX_LENGTH,
    hasLetter,
    hasNumber,
    hasSpecial,
    all: len >= PASSWORD_MIN_LENGTH && len <= PASSWORD_MAX_LENGTH && hasLetter && hasNumber && hasSpecial,
  };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useMyInfo();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentError, setCurrentError] = useState('');
  const [newError, setNewError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const rules = useNewPasswordRules(newPassword);
  const confirmMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isSameAsCurrent = currentPassword && newPassword && currentPassword === newPassword;

  const canSubmit =
    currentPassword &&
    rules.all &&
    confirmMatch &&
    !isSameAsCurrent &&
    !loading;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitError('');
      if (!currentPassword) {
        setCurrentError('현재 비밀번호를 입력해 주세요.');
        return;
      }
      if (!rules.all) {
        setNewError('새 비밀번호가 조건을 만족하지 않습니다.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setConfirmError('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      if (currentPassword === newPassword) {
        setNewError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
        return;
      }

      setLoading(true);
      try {
        await http.patch('/users/me/password', {
          currentPassword,
          newPassword,
        });
        router.push('/auth/login?message=passwordChanged');
      } catch (err) {
        const message =
          err?.response?.data?.message ??
          err?.message ??
          '비밀번호 변경에 실패했습니다.';
        setSubmitError(message);
        if (err?.response?.status === 401) {
          setCurrentError('현재 비밀번호가 올바르지 않습니다.');
        }
      } finally {
        setLoading(false);
      }
    },
    [currentPassword, newPassword, confirmPassword, rules.all, router]
  );

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

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.field}>
          <Label htmlFor="current-password" className={styles.label}>
            현재 비밀번호
          </Label>
          <div className={styles.inputWrapper}>
            <Input
              id="current-password"
              type={showCurrent ? 'text' : 'password'}
              placeholder="현재 비밀번호를 입력해 주세요"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setCurrentError('');
                setSubmitError('');
              }}
              className={`${styles.inputField} ${currentError ? styles.inputError : ''}`}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowCurrent((p) => !p)}
              aria-label={showCurrent ? '비밀번호 숨기기' : '비밀번호 보기'}
              tabIndex={-1}
            >
              <Image
                src={showCurrent ? '/assets/icons/ic_eye_on.svg' : '/assets/icons/ic_eye_off.svg'}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
          {currentError && <p className={styles.errorMessage}>{currentError}</p>}
        </div>

        <div className={styles.field}>
          <Label htmlFor="new-password" className={styles.label}>
            새 비밀번호
          </Label>
          <div className={styles.inputWrapper}>
            <Input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              placeholder="8자 이상, 영문·숫자·특수문자 포함"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setNewError('');
                setSubmitError('');
              }}
              className={`${styles.inputField} ${newError ? styles.inputError : ''}`}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowNew((p) => !p)}
              aria-label={showNew ? '비밀번호 숨기기' : '비밀번호 보기'}
              tabIndex={-1}
            >
              <Image
                src={showNew ? '/assets/icons/ic_eye_on.svg' : '/assets/icons/ic_eye_off.svg'}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
          <ul className={styles.ruleList} aria-label="새 비밀번호 조건">
            <li className={rules.minLength ? styles.ruleOk : ''}>
              {rules.minLength ? '✓' : '○'} 8자 이상 128자 이하
            </li>
            <li className={rules.hasLetter ? styles.ruleOk : ''}>
              {rules.hasLetter ? '✓' : '○'} 영문자 포함
            </li>
            <li className={rules.hasNumber ? styles.ruleOk : ''}>
              {rules.hasNumber ? '✓' : '○'} 숫자 포함
            </li>
            <li className={rules.hasSpecial ? styles.ruleOk : ''}>
              {rules.hasSpecial ? '✓' : '○'} 특수문자 포함
            </li>
          </ul>
          {newError && <p className={styles.errorMessage}>{newError}</p>}
        </div>

        <div className={styles.field}>
          <Label htmlFor="confirm-password" className={styles.label}>
            새 비밀번호 확인
          </Label>
          <div className={styles.inputWrapper}>
            <Input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="새 비밀번호를 한번 더 입력해 주세요"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmError('');
                setSubmitError('');
              }}
              className={`${styles.inputField} ${confirmError ? styles.inputError : ''}`}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirm((p) => !p)}
              aria-label={showConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
              tabIndex={-1}
            >
              <Image
                src={showConfirm ? '/assets/icons/ic_eye_on.svg' : '/assets/icons/ic_eye_off.svg'}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
          {confirmPassword && !confirmMatch && (
            <p className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>
          )}
          {confirmError && <p className={styles.errorMessage}>{confirmError}</p>}
        </div>

        {isSameAsCurrent && newPassword && (
          <p className={styles.errorMessage}>새 비밀번호는 현재 비밀번호와 달라야 합니다.</p>
        )}

        {submitError && <p className={styles.errorMessage}>{submitError}</p>}

        <div className={styles.buttonWrap}>
          <button type="submit" className={styles.submitButton} disabled={!canSubmit}>
            {loading ? '처리 중…' : '비밀번호 변경'}
          </button>
        </div>

        <p className={styles.backLink}>
          <Link href="/userinfo" className={styles.backLinkA}>
            회원정보로 돌아가기
          </Link>
        </p>
      </form>
    </div>
  );
}
