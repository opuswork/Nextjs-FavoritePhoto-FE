import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-black">
      <div className="mx-auto flex h-[80px] w-full max-w-[1480px] items-center justify-between px-5">
        <Link href="/" className="flex items-center">
          <Image src="/assets/logos/logo.svg" alt="최애의포토" width={139} height={26} priority />
        </Link>

        <nav className="flex items-center gap-[30px]">
          <Link href="/login" className="text-[14px] text-white/70 hover:text-white">
            로그인
          </Link>
          <Link href="/signup" className="text-[14px] text-white/70 hover:text-white">
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
}
