'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Header />

      {/* ================= SECTION 1 : HERO ================= */}
      {/* 1. We shorten the section height on mobile (min-h-[460px]) to remove the big gap */}
      <section className="relative mt-[13px] min-h-[460px] md:min-h-[700px] bg-neutral-950">
        
        {/* bg1 프레임 (The Purple Rounded Box) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Container className="h-full">
            <div className="relative h-full rounded-[28px] overflow-hidden">
              <Image
                src="/images/landing/background/bg1.png"
                alt="hero background"
                fill
                priority
                className="object-cover"
              />
            </div>
          </Container>
        </div>

        {/* 텍스트 영역 */}
        <div className="relative z-10 h-[40%] pt-[32px] md:pt-[50px] lg:pt-[70px] flex justify-center text-center">
          <Container>
            <div className="mx-auto w-full max-w-[720px]">
              <p className="text-[18px] font-semibold tracking-[-0.02em]">초이스포토</p>

              <h1 className="mt-[18px] text-[12px] md:text-[24px] lg:text-[34px] leading-[1.25] font-bold tracking-[-0.02em]">
                구하기 어려웠던
                <br />
                <span className="text-lime-400">나만의 초이스</span>가 여기에!
              </h1>

              <div className="mt-[28px] flex justify-center">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-2.5 w-[226px] h-[55px] rounded-[2px] border border-[#efff04] bg-[#efff04] text-black font-bold text-[16px] leading-none whitespace-nowrap no-underline hover:opacity-90"
                >
                  초이스 찾으러 가기
                </Link>
              </div>
            </div>
          </Container>
        </div>

        {/* 하단 프리뷰 이미지 - 모바일에서 더 위로 올려서 히어로와 겹치게 */}
        <div className="absolute left-1/2 bottom-0 w-screen -translate-x-1/2 h-[75%] md:h-[80%] pointer-events-none z-[2]">
          <Image
            src="/images/landing/lg/img1.svg"
            alt="hero preview"
            fill
            priority
            className="object-contain object-center"
          />
        </div>
      </section>

      {/* ================= BELOW SECTIONS ================= */}
      <main className="w-full min-w-0 bg-neutral-950 text-white overflow-x-hidden">
        <section className="relative bg-neutral-950 overflow-hidden">
          <div className="relative z-10 min-h-[520px] h-auto py-10 md:py-0 md:h-[650px] lg:h-[800px] w-full">
            <Container className="h-full w-full">
              <div className="relative h-full w-full rounded-[28px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/landing/background/bg2.svg"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute z-0 opacity-20"
                  style={{
                    left: 80,
                    top: 500,
                    width: 1480,
                    height: 1480,
                  }}
                />

                <div className="relative z-10 h-full w-full min-w-0 flex flex-col items-center pt-[40px] md:pt-[80px] lg:pt-[120px] lg:items-start">
                  <div className="w-full min-w-0 max-w-[560px] text-center mx-auto px-4 lg:px-0 lg:text-left lg:ml-[200px] lg:mx-0 self-center lg:self-auto">
                    <h2 className="text-[12px] md:text-[36px] lg:text-[44px] font-bold leading-[1.2]">
                      포인트로 <span className="text-lime-400">안전하게</span> 거래하세요
                    </h2>
                    <p className="mt-3 text-[11px] md:text-base text-neutral-300">
                      내 포토카드를 포인트로 팔고, 원하는 포토카드를
                      <br />
                      포인트로 안전하게 교환하세요
                    </p>
                  </div>

                  <div className="mt-[20px] md:mt-[35px] w-full max-w-[1068px] h-[280px] md:h-[400px] lg:h-[518px] relative mx-auto self-center lg:self-auto">
                    <Image
                      src="/images/landing/lg/img2.svg"
                      alt="포인트로 안전하게 거래하세요"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* ================= SECTION 3 ================= */}
        <section className="relative bg-neutral-950 overflow-hidden">
          <div className="relative z-10 min-h-[520px] h-auto py-10 md:py-0 md:h-[650px] lg:h-[800px] w-full">
            <Container className="h-full w-full">
              {/* 프레임 기준점 */}
              <div className="relative h-full w-full rounded-[28px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/landing/background/bg3.svg" // ← 섹션3 전용 원
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute z-0 opacity-20"
                  style={{
                    left: -80, // ← 좌우 이동
                    top: 500, // ← 상하 이동
                    width: 1480,
                    height: 1480,
                  }}
                />

                {/* 기존 콘텐츠 */}
                <div className="relative z-10 h-full w-full min-w-0 flex flex-col items-center pt-[40px] md:pt-[80px] lg:pt-[120px] lg:items-start">
                  <div className="w-full min-w-0 max-w-[560px] text-center mx-auto px-4 lg:px-0 lg:text-left lg:ml-[200px] lg:mx-0 self-center lg:self-auto">
                    <h2 className="text-[12px] md:text-[36px] lg:text-[44px] font-bold leading-[1.2]">
                      알림으로 보다 <span className="text-sky-400">빨라진</span> 거래
                    </h2>
                    <p className="mt-3 text-[11px] md:text-base text-neutral-300">
                      교환 제안부터 판매 완료까지,
                      <br />
                      실시간 알림으로 놓치지 마세요
                    </p>
                  </div>

                  <div className="mt-[20px] md:mt-[35px] mx-auto w-full max-w-[1068px] h-[280px] md:h-[400px] lg:h-[518px] relative self-center lg:self-auto">
                    <Image
                      src="/images/landing/lg/img3.svg"
                      alt="알림으로 보다 빨라진 거래"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* ================= SECTION 4 : RANDOM BOX ================= */}
        <section className="relative bg-neutral-950 overflow-hidden pb-[80px]">
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                'radial-gradient(150% 100% at 50% 100%, rgba(239,255,4,0.25) 0%, rgba(0,0,0,0) 70%)',
            }}
          />

          <div className="relative z-10 min-h-[520px] h-auto py-10 md:py-0 md:h-[650px] lg:h-[800px] w-full">
            <Container className="h-full w-full">
              <div className="h-full w-full min-w-0 flex flex-col items-center pt-[40px] md:pt-[80px] lg:pt-[120px] lg:items-start">
                <div className="w-full min-w-0 max-w-[560px] text-center mx-auto px-4 lg:px-0 lg:text-left lg:ml-[200px] lg:mx-0 self-center lg:self-auto">
                  <h2 className="text-[12px] md:text-[36px] lg:text-[44px] font-bold leading-[1.2]">
                    랜덤 상자로 <span className="text-lime-400">포인트 받자!</span> 🎉
                  </h2>
                  <p className="mt-3 text-[11px] md:text-base text-neutral-300">
                    한 시간마다 주어지는 랜덤 상자를 열고,
                    <br />
                    포인트를 획득하세요
                  </p>
                </div>

                <div className="mt-[20px] md:mt-[35px] mx-auto w-full max-w-[1068px] h-[280px] md:h-[400px] lg:h-[518px] relative self-center lg:self-auto">
                  <Image
                    src="/images/landing/lg/img4.svg"
                    alt="랜덤 상자 포인트 획득 화면"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="relative bg-neutral-950 overflow-hidden">
          <div className="relative z-10 h-[600px]">
            <Container className="h-full">
              {/* 가운데 정렬: 텍스트 박스를 기준으로 위 이미지/아래 버튼 배치 */}
              <div className="h-full flex flex-col items-center justify-center text-center">
                {/* 사진 (경로: /images/landing/Rectangle.jpg) */}
                <div className="relative mb-[18px]">
                  <Image
                    src="/images/landing/Rectangle.jpg"
                    alt="CTA 포토카드"
                    width={120}
                    height={150}
                    className="object-contain -rotate-12"
                    priority={false}
                  />
                </div>

                {/* 텍스트 */}
                <h2 className="mt-3 text-[11px] md:text-base text-neutral-300">
                  나만만의 초이스를 지금 찾아보세요!
                </h2>

                <div className="mt-[24px]">
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center w-[266px] h-[55px] rounded-[2px] border border-[#efff04] bg-[#efff04] text-black font-bold text-[16px] leading-none whitespace-nowrap no-underline hover:opacity-90"
                  >
                    초이스 찾으러 가기
                  </Link>
                </div>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 px-4 text-center text-sm text-white/70">
                  <span>@2026. 초이스포토. All rights reserved.</span>
                  <div className="flex items-center gap-2">
                    <span><Link href="/about/privacy">개인정보처리방침</Link></span>
                    <span aria-hidden className="text-white/40">|</span>
                    <span><Link href="/about/terms">서비스 이용약관</Link></span>
                  </div>
                </div>

              </div>
            </Container>
          </div>
        </section>
      </main>
    </>
  );
}
