// src/app/(main)/marketplace/page.jsx

import SubHeader from '@/components/organisms/SubHeader/SubHeader';
import CardOriginal from '@/components/organisms/CardOriginal/CardOriginal';

// 샘플 카드 데이터 (15개)
const sampleCards = [
  { id: 1, rarity: 'COMMON', category: '풍경', owner: '미쓰손', description: '우리집 앞마당', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-soldout.svg' },
  { id: 2, rarity: 'RARE', category: '풍경', owner: '코드잇', description: 'How Far I\'ll Go', price: '4 P', remaining: 1, outof: 5, imageSrc: '/assets/products/photo-card-another.svg' },
  { id: 3, rarity: 'SUPER RARE', category: '여행', owner: '코드잇덕후', description: '스페인 여행', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-two.svg' },
  { id: 4, rarity: 'COMMON', category: '풍경', owner: '코드잇', description: 'How Far I\'ll Go', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-another.svg' },
  { id: 5, rarity: 'SUPER RARE', category: '여행', owner: '코드잇덕후', description: '스페인 여행', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-two.svg' },
  { id: 6, rarity: 'LEGENDARY', category: '풍경', owner: '미쓰손', description: '우리집 앞마당', price: '4 P', remaining: 5, outof: 5, imageSrc: '/assets/products/photo-card-soldout.svg' },
  { id: 7, rarity: 'SUPER RARE', category: '여행', owner: '미쓰손', description: '스페인 여행', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-two.svg' },
  { id: 8, rarity: 'COMMON', category: '풍경', owner: '미쓰손', description: '우리집 앞마당', price: '4 P', remaining: 5, outof: 5, imageSrc: '/assets/products/photo-card-soldout.svg' },
  { id: 9, rarity: 'RARE', category: '풍경', owner: '코드잇', description: 'How Far I\'ll Go', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-another.svg' },
  { id: 10, rarity: 'COMMON', category: '풍경', owner: '미쓰손', description: '우리집 앞마당', price: '4 P', remaining: 4, outof: 5, imageSrc: '/assets/products/photo-card-soldout.svg' },
  { id: 11, rarity: 'RARE', category: '풍경', owner: '코드잇', description: 'How Far I\'ll Go', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-another.svg' },
  { id: 12, rarity: 'SUPER RARE', category: '여행', owner: '코드잇덕후', description: '스페인 여행', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-two.svg' },
  { id: 13, rarity: 'RARE', category: '풍경', owner: '코드잇', description: 'How Far I\'ll Go', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-another.svg' },
  { id: 14, rarity: 'SUPER RARE', category: '여행', owner: '코드잇덕후', description: '스페인 여행', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-two.svg' },
  { id: 15, rarity: 'COMMON', category: '풍경', owner: '미쓰손', description: '우리집 앞마당', price: '4 P', remaining: 2, outof: 5, imageSrc: '/assets/products/photo-card-soldout.svg' },
];

export default function MarketplacePage() {
  return (
    <div className="w-full bg-black text-white">
      <SubHeader />

      <div className="mx-auto w-full max-w-[1480px] px-5 py-10">
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}