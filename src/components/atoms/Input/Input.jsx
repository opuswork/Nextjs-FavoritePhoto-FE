// src/components/atoms/Input/Input.jsx
"use client";
import styles from "./Input.module.css";

export default function Input({ 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    onBlur,
    className, 
    disabled, 
    required, 
    id 
}) {
    // className이 전달되면 기본 스타일을 적용하지 않음
    const resolvedClassName = className ? className : (styles.input ?? '');

    return (
        <input
            id={id}
            className={resolvedClassName}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
        />
    );
}