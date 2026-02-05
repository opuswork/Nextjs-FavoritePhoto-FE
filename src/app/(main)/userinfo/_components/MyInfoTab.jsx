'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/userinfo', label: '회원정보변경' },
  { href: '/userinfo/change-password', label: '비밀번호 변경' },
  { href: '/userinfo/email-change', label: '이메일 변경' },
  { href: '/userinfo/point-history', label: '포인트내역' },
  { href: '/userinfo/delete-account', label: '회원탈퇴' },
  { href: '/userinfo/payment-history', label: '결제내역' },
];

function isActive(pathname, href) {
  if (href === '/userinfo') return pathname === '/userinfo';
  return pathname.startsWith(href);
}

export default function MyInfoTab() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.map(({ href, label }) => {
        const active = isActive(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            className={[
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              active
                ? 'border-yellow-300 bg-yellow-300 text-black'
                : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
