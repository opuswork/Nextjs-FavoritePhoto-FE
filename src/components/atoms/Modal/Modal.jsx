'use client';

/*
  Modal Atom 요약
  -------------------
  1. open 여부에 따른 렌더링 제어
  2. overlay(배경 dim) 렌더링
  3. ESC 키로 닫기 처리
  4. overlay 클릭으로 닫기 처리
  5. body 스크롤 잠금 / 해제
  6. portal을 이용해 document.body 최상단에 렌더링
  7. 닫기 버튼(X) 표시 여부 제어
  8. size 옵션에 따른 모달 크기 제어
  9. 접근성(role, aria-modal) 기본 제공
*/

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export default function Modal({
  open, // 모달 열림 여부
  onClose, // 닫기 콜백
  children, // 모달 내부 콘텐츠 (외부에서 주입)
  closeOnOverlay = true, // overlay 클릭 시 닫기 여부
  closeOnEsc = true, // ESC 키로 닫기 여부
  showCloseButton = true, // 닫기 버튼(X) 표시 여부
  size = 'md', // 모달 크기 (sm | md | lg | xl)
  noBorder = false, // 테두리 제거 여부
}) {
  /*
    모달이 열려 있을 때만 부가 효과(side-effect) 처리
    - body 스크롤 잠금
    - ESC 키 이벤트 등록
    - 모달 닫힐 때 원상 복구
  */
  useEffect(() => {
    if (!open) return;

    // body 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // ESC 키 처리
    const onKeyDown = (e) => {
      if (!closeOnEsc) return;
      if (e.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', onKeyDown);

    // cleanup
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, closeOnEsc, onClose]);

  /*
    open=false면 DOM 자체를 렌더링하지 않음
  */
  if (!open) return null;

  /*
    Portal을 사용해 document.body 최상단에 모달 렌더링
    - z-index 충돌 방지
    - 레이아웃 영향 차단
  */
  const isBottomSheet = size === 'bottomSheet';
  const isBottomSheetFull = size === 'bottomSheetFull';
  const overlayExtra = isBottomSheetFull ? styles.overlayBottomSheetFull : isBottomSheet ? styles.overlayBottomSheet : '';
  const containerExtra = isBottomSheetFull ? styles.bottomSheetFull : isBottomSheet ? styles.bottomSheet : styles[size];

  const overlayClassName = isBottomSheetFull
    ? styles.overlayBottomSheetFull
    : `${styles.overlay} ${overlayExtra}`;

  return createPortal(
    <div
      className={overlayClassName}
      role="dialog"
      aria-modal="true"
    >
      {/* 배경 dim 영역 */}
      <div className={styles.backdrop} onClick={closeOnOverlay ? onClose : undefined} />

      {/* 실제 모달 컨테이너 */}
      <div className={`${styles.container} ${containerExtra} ${noBorder ? styles.customNoBorder : ''}`}>
        {/* 닫기 버튼 */}
        {showCloseButton && (
          <button className={styles.close} onClick={onClose} aria-label="닫기">
            ×
          </button>
        )}

        {/* 외부에서 주입된 콘텐츠 */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
