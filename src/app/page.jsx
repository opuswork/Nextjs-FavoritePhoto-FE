import { Image } from '@/components/atoms/Image';
import { mockCards } from '@/data/mockCards';

export default function ImageAtomTestPage() {
  return (
    <div className="p-10 flex flex-wrap gap-10 bg-neutral-900 min-h-screen">
      {mockCards.map((card) => (
        <div key={card.id} className="p-5 bg-neutral-800 rounded-lg">
          <Image
            src={card.image_url}
            alt={card.title}
            className="w-[360px] aspect-[4/3]"
            sizes="360px"
          />
          <p className="mt-2 text-white">{card.title}</p>
        </div>
      ))}
    </div>
  );
}
