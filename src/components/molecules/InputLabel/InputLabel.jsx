// src/components/molecules/InputLabel/InputLabel.jsx
"use client";

import Input from "../../atoms/Input/Input";
import Label from "../../atoms/Label/Label";
import styles from "./InputLabel.module.css";

export default function InputLabel({ 
    label, 
    placeholder, 
    value, 
    onChange, 
    className,
    type,
    disabled,
    error,
    required, id 
}) {
    return (
        <div 
            className={`${styles.inputLabel} ${className}`}
        >
            <Label className={styles.label}>{label}</Label>
            <Input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                className={`${styles.input} ${className} ${error ? styles.error : ''}`}
                disabled={disabled}
                required={required}
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}