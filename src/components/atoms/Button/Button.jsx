// src/components/atoms/Button/Button.jsx
"use client";

import { useRouter } from "next/navigation";
import styles from "./Button.module.css";

export default function Button({ children, href, onClick, className, disabled }) {
    const router = useRouter();
    
    const handleClick = () => {
        if (disabled) return;
        if (onClick) {
            onClick();
        } else if (href) {
            router.push(href);
        }
    };
    
    const buttonClassName = className 
        ? `${styles.button} ${className}`.trim()
        : styles.button;
    
    return (
        <button 
            className={buttonClassName} 
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
