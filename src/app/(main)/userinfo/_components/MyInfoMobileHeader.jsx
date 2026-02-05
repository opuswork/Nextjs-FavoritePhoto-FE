'use client';

import Image from 'next/image';
import styles from '../page.module.css';
import { ICONS } from '@/constants/icons';

export default function MyInfoMobileHeader({ title = '회원정보변경', onBack }) {
  return (
    <div className={styles.mobileHeader}>
      <button type="button" onClick={onBack} className={styles.mobileBackBtn} aria-label="뒤로가기">
        <Image src={ICONS.BACK} alt="" width={24} height={24} />
      </button>

      <h1 className={styles.mobileTitle}>{title}</h1>

      {/* 가운데 정렬 유지용 더미 */}
      <div className={styles.mobileRightSpacer} />
    </div>
  );
}
