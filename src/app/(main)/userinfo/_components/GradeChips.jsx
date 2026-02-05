import Grade from '@/components/atoms/Grade/Grade';

const STYLE = {
  common: { border: 'border-yellow-300', text: 'text-yellow-300' },
  rare: { border: 'border-sky-300', text: 'text-sky-300' },
  superRare: { border: 'border-purple-300', text: 'text-purple-300' },
  legendary: { border: 'border-pink-300', text: 'text-pink-300' },
};

const ORDER = ['common', 'rare', 'superRare', 'legendary'];

export default function GradeChips({ counts }) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-[20px] min-w-0">
      {ORDER.map((grade) => {
        const s = STYLE[grade];
        const count = counts?.[grade] ?? 0;

        return (
          <div
            key={grade}
            className={`inline-flex items-center h-[34px] md:h-[36px] lg:h-[40px] px-2.5 md:px-3 lg:px-[20px] gap-1 md:gap-1.5 lg:gap-[10px] border shrink-0 ${s.border}`}
          >
            <Grade grade={grade} size="sm" className={`!font-light ${s.text}`} />
            <span className={`text-[12px] md:text-[14px] lg:text-[16px] font-light whitespace-nowrap ${s.text}`}>{count}장</span>
          </div>
        );
      })}
    </div>
  );
}
