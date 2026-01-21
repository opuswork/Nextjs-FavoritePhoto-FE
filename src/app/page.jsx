'use client';

import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import { Image } from '@/components/atoms/Image';
import { mockCards } from '@/data/mockCards';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Header 직접 렌더 (테스트용) */}
      <Header />

      {/* Body */}
      <main className="flex-1">
        <Container className="py-10">
          <h1 className="mb-8 text-2xl font-bold text-white">Image Atom Test</h1>

          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {mockCards.map((card) => (
              <div key={card.id} className="rounded-lg bg-neutral-800 p-5">
                <Image
                  src={card.image_url}
                  alt={card.title}
                  className="w-full aspect-[4/3] rounded-md"
                />
                <p className="mt-3 text-white font-medium">{card.title}</p>
              </div>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}
