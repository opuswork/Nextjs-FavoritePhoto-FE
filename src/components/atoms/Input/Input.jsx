// src/components/atoms/Input/Input.jsx
"use client";
import styles from "./Input.module.css";

export default function Input({ 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    className, 
    disabled, 
    required, 
    id 
}) {
    return (
        <input
            id={id}
            className={`${styles.input ?? ''} ${className ?? ''}`.trim()}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
        />
    );
}