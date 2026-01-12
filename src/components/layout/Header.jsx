import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
      <Link href="/" style={{ fontWeight: 700, textDecoration: 'none' }}>
        최애의 포토
      </Link>
    </header>
  );
}
