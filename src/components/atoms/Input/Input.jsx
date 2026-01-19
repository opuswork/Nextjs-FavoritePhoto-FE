// src/components/atoms/Input/Input.jsx
"use client";
import styles from "./Input.module.css";

export default function Input({ 
    type, 
    placeholder, 
    value, 
    onChange 
}) {
    return (
        <input 
            className={styles.input} 
            type={type} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} 
        />
    );
}