// src/components/atoms/DropDown/DropDown.jsx
"use client";

import Image from 'next/image';
import { useState } from 'react';
import styles from './DropDown.module.css';

export default function DropDown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={value}
        onChange={onChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onMouseDown={() => setIsOpen((v) => !v)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className={styles.icon}>
        <Image
          src={isOpen ? '/assets/icons/ic_up.svg' : '/assets/icons/ic_down.svg'}
          alt={isOpen ? 'up' : 'down'}
          width={24}
          height={24}
        />
      </span>
    </div>
  );
}
