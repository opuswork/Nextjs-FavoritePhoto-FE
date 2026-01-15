'use client';

import styles from './TextBox.module.css';

export default function TextBox({
  label,
  value,
  placeholder,
  onChange,
  error,
  maxLength,
  disabled,
}) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>

      <textarea
        className={`${styles.textarea} ${error ? styles.error : ''}`}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />

      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
