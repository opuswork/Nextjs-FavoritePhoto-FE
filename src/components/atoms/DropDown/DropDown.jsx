// src/components/atoms/DropDown/DropDown.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './DropDown.module.css';

export default function DropDown({
  options,
  value,
  onChange,
  className,
  wrapperStyle,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value);

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({
      target: { value: option.value },
    });
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${className || ''}`}
      style={wrapperStyle}
    >
      {/* Trigger */}
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className={styles.value}>
          {selectedOption?.label ?? '선택'}
        </span>
        <span className={styles.icon}>
          <img
            src={isOpen ? '/assets/icons/ic_up.svg' : '/assets/icons/ic_down.svg'}
            alt=""
            width={24}
            height={24}
          />
        </span>
      </button>

      {/* Menu */}
      {isOpen && (
        <ul className={styles.menu} role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`${styles.option} ${
                option.value === value ? styles.selected : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
