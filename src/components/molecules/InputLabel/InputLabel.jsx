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
    onBlur,
    className 
}) {
    return (
        <div className={`${styles.inputLabel} ${className}`}>
            <Label>{label}</Label>
            <Input 
                className={styles.input} 
                type="text" 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange}
                onBlur={onBlur}
            />
        </div>
    );
}