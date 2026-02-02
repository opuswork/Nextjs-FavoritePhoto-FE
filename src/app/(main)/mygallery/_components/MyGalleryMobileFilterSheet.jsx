'use client';

import Modal from '@/components/atoms/Modal/Modal';
import { ButtonPrimary } from '@/components/atoms/Button';

const GRADE_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'COMMON', label: 'COMMON' },
  { value: 'RARE', label: 'RARE' },
  { value: 'SUPER RARE', label: 'SUPER RARE' },
  { value: 'LEGENDARY', label: 'LEGENDARY' },
];

const GENRE_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: '풍경', label: '풍경' },
  { value: '여행', label: '여행' },
  { value: '인물', label: '인물' },
];

export default function MyGalleryMobileFilterSheet({
  open,
  onClose,
  grade,
  onChangeGrade,
  genre,
  onChangeGenre,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="bottomSheet"
      showCloseButton={false}
      closeOnOverlay
      closeOnEsc
    >
      <div className="flex flex-col h-full max-h-[80vh] bg-[#141414] text-white">
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <h2 className="text-lg font-bold">필터</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-2xl text-white/80 hover:text-white"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-white/60 mb-3">등급</h3>
            <div className="flex flex-wrap gap-2">
              {GRADE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeGrade(opt.value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    grade === opt.value
                      ? 'border-[#efff04] bg-[#efff04]/20 text-[#efff04]'
                      : 'border-white/30 text-white/80 hover:border-white/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white/60 mb-3">장르</h3>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeGenre(opt.value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    genre === opt.value
                      ? 'border-[#efff04] bg-[#efff04]/20 text-[#efff04]'
                      : 'border-white/30 text-white/80 hover:border-white/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-white/20">
          <ButtonPrimary
            type="button"
            size="l"
            thickness="thin"
            fullWidth
            onClick={onClose}
            className="!bg-[#efff04] !text-black hover:!bg-[#efff04]"
          >
            적용하기
          </ButtonPrimary>
        </div>
      </div>
    </Modal>
  );
}
