'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMyInfo } from './_components/MyInfoShell';
import styles from './page.module.css';

const TAB_BASIC = { href: '/userinfo', label: '회원기본정보', borderClass: 'tabYellow', showWhen: null };
/** 비밀번호 변경 탭: DB에 password가 있는 사용자(이메일 가입)에게만 표시. Google 로그인 등은 비표시 */
const TAB_PASSWORD = { href: '/userinfo/reset-password', label: '비밀번호변경', borderClass: 'tabPurple', showWhen: (user) => Boolean(user?.hasPassword) };
const TAB_EMAIL = { href: '/userinfo/email-change', label: 'Email 변경', borderClass: 'tabPink', showWhen: null };
const TAB_NICKNAME = { href: '/userinfo/nickname-change', label: 'Nickname 변경', borderClass: 'tabPink', showWhen: null };

function isActive(pathname, href) {
  if (href === '/userinfo') return pathname === '/userinfo';
  return pathname.startsWith(href);
}

/** Returns tabs to show: 비밀번호변경 is only included when user has a password (from GET /users/me hasPassword). */
function getVisibleTabs(user) {
  return [TAB_BASIC, TAB_PASSWORD, TAB_EMAIL, TAB_NICKNAME].filter(
    (tab) => tab.showWhen == null || tab.showWhen(user)
  );
}

export default function UserinfoPage() {
  const pathname = usePathname();
  const { user } = useMyInfo();
  const tabs = getVisibleTabs(user);

  return (
    <section className={styles.section}>
      <nav className={styles.tabRow} aria-label="회원정보 메뉴">
        {tabs.map(({ href, label, borderClass }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={[styles.tab, styles[borderClass], active ? styles.tabActive : ''].filter(Boolean).join(' ')}
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
