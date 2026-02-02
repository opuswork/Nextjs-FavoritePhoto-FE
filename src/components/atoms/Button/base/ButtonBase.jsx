'use client';

import Link from 'next/link';

export default function ButtonBase({ children, className = '', disabled = false, href, ...props }) {
  if (href != null && href !== '') {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" {...props} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
