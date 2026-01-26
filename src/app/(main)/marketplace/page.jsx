'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SubHeader from '@/components/organisms/SubHeader/SubHeader';
import CardOriginal from '@/components/organisms/CardOriginal/CardOriginal';
import CardSellingListModal from '@/components/organisms/CardSellingListModal/CardSellingListModal';
import { sampleCards } from './sampleCards';

export default function MarketplacePage() {
  const router = useRouter();
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);

  return (
    <div className="w-full bg-black text-white">
      <SubHeader onSellClick={() => setIsSellingModalOpen(true)} />

      <div className="mx-auto w-full max-w-[1280px] px-5 py-10">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '72px',
            rowGap: '80px',
            justifyItems: 'center',
          }}
        >
          {sampleCards.map((card) => (
            <CardOriginal
              key={card.id}
              rarity={card.rarity}
              category={card.category}
              owner={card.owner}
              description={card.description}
              price={card.price}
              remaining={card.remaining}
              outof={card.outof}
              imageSrc={card.imageSrc}
              onClick={card.remaining > 0 ? () => {
                router.push(`/marketplace/${card.id}`);
              } : undefined}
            />
          ))}
        </div>
      </div>

      {/* Card Selling List Modal */}
      <CardSellingListModal
        open={isSellingModalOpen}
        onClose={() => setIsSellingModalOpen(false)}
      />
    </div>
  );
}