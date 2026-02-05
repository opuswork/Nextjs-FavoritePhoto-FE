'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

const TABS = [
  { href: '/userinfo', label: '회원기본정보', borderClass: styles.tabYellow },
  { href: '/userinfo/reset-password', label: '비밀번호변경', borderClass: styles.tabPurple },
  { href: '/userinfo/email-change', label: 'Email 변경', borderClass: styles.tabPink },
  { href: '/userinfo/nickname-change', label: 'Nickname 변경', borderClass: styles.tabPink },
];

function isActive(pathname, href) {
  if (href === '/userinfo') return pathname === '/userinfo';
  return pathname.startsWith(href);
}

export default function UserinfoPage() {
  const pathname = usePathname();

  return (
    <section className={styles.section}>
      <nav className={styles.tabRow} aria-label="회원정보 메뉴">
        {TABS.map(({ href, label, borderClass }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={[styles.tab, borderClass, active ? styles.tabActive : ''].filter(Boolean).join(' ')}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {pathname === '/userinfo' && (
        <div className={styles.content}>
          <p className={styles.hint}>위 탭에서 비밀번호, 이메일, 닉네임 변경을 선택할 수 있습니다.</p>
        </div>
      )}
    </section>
  );
}
