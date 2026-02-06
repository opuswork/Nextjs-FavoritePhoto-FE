'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/atoms/Input/Input';
import Label from '@/components/atoms/Label/Label';
import { http } from '@/lib/http/client';
import { useMyInfo } from '../_components/MyInfoShell';
import styles from './page.module.css';

const API_AUTH = '/api/auth';

function validateEmail(value) {
  if (!value.trim()) return '이메일을 입력해 주세요.';
  if (!value.includes('@')) return '이메일 주소 형식이 올바르지 않습니다.';
  return null;
}

export default function EmailChangePage() {
  const { user, loading: userLoading, refetchUser } = useMyInfo();
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const currentEmail = user?.email ?? '';

  const handleSendCode = async () => {
    const err = validateEmail(newEmail);
    setEmailError(err || '');
    setVerificationMessage('');
    setCodeError('');
    if (err) return;
    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError('현재 사용 중인 이메일과 동일합니다. 다른 이메일을 입력해 주세요.');
      return;
    }

    setSendCodeLoading(true);
    try {
      await http.post(`${API_AUTH}/request-verification`, { email: newEmail.trim() });
      setVerificationMessage('인증코드가 이메일로 발송되었습니다.');
      setVerificationCode('');
    } catch (e) {
      const msg = e?.response?.data?.message ?? e?.message ?? '인증코드 발송에 실패했습니다.';
      setVerificationMessage(msg);
    } finally {
      setSendCodeLoading(false);
    }
  };

  const handleConfirmEmailChange = async () => {
    const err = validateEmail(newEmail);
    setEmailError(err || '');
    setCodeError('');
    if (err) return;
    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError('현재 사용 중인 이메일과 동일합니다.');
      return;
    }
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setCodeError('인증코드 6자리를 입력해 주세요.');
      return;
    }

    setConfirmLoading(true);
    try {
      await http.patch('/users/me/email', {
        newEmail: newEmail.trim(),
        code: verificationCode.trim(),
      });
      setSuccessMessage('이메일이 변경되었습니다.');
      setNewEmail('');
      setVerificationCode('');
      setVerificationMessage('');
      setEmailError('');
      setCodeError('');
      await refetchUser();
      window.dispatchEvent(new Event('user-points-updated'));
    } catch (e) {
      const msg = e?.response?.data?.message ?? e?.message ?? '이메일 변경에 실패했습니다.';
      setCodeError(msg);
    } finally {
      setConfirmLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className={styles.wrap}>
        <p className="text-white/70">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirmEmailChange();
        }}
        noValidate
      >
        <div className={styles.field}>
          <Label className={styles.label}>현재 이메일</Label>
          <div className={styles.currentEmail}>{currentEmail || '—'}</div>
        </div>

        <div className={styles.field}>
          <Label htmlFor="email-change-new" className={styles.label}>
            새 이메일 주소
          </Label>
          <div className={styles.emailRow}>
            <Input
              id="email-change-new"
              type="email"
              placeholder="새 이메일을 입력해 주세요."
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailError('');
                setVerificationMessage('');
                setCodeError('');
                setSuccessMessage('');
              }}
              className={`${styles.inputField} ${emailError ? styles.inputError : ''}`}
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
            <p
              className={
                verificationMessage.startsWith('인증코드가')
                  ? styles.verificationSuccess
                  : styles.errorMessage
              }
            >
              {verificationMessage}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <Label htmlFor="email-change-code" className={styles.label}>
            인증코드 (6자리)
          </Label>
          <div className={styles.verifyRow}>
            <input
              id="email-change-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '');
                setVerificationCode(v);
                setCodeError('');
              }}
              className={styles.verifyInput}
            />
            <button
              type="submit"
              className={styles.verifyButton}
              disabled={
                confirmLoading ||
                verificationCode.length !== 6 ||
                !newEmail.trim()
              }
            >
              {confirmLoading ? '처리 중...' : '인증완료'}
            </button>
          </div>
          {codeError && <p className={styles.errorMessage}>{codeError}</p>}
        </div>

        {successMessage && (
          <p className={styles.verificationSuccess}>{successMessage}</p>
        )}

        <p className={styles.backLink}>
          <Link href="/userinfo" className={styles.backLinkA}>
            회원정보로 돌아가기
          </Link>
        </p>
      </form>
    </div>
  );
}
