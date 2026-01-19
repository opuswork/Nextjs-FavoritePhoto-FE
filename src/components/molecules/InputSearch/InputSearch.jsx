// src/components/atoms/Search/InputSearch.jsx
"use client";

import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import styles from "./InputSearch.module.css";
// import { Search } from "lucide-react";
// import { Cross } from "lucide-react";
import Image from "next/image";

export default function InputSearch({ 
    placeholder, 
    value, 
    onChange, 
    onSearch, 
    onClear, 
    onReset, 
    className,
    error,
    required, id 
}) {
    return (
        <div 
            className={`${styles.inputSearch} ${className} ${error ? styles.error : ''}`}
        >
            <Input className={styles.input} type="search" placeholder={placeholder} value={value} onChange={onChange} 
                disabled={disabled}
                required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${id}-error` : null}
            />
            <Button className={styles.button} 
                onClick={onSearch}
                disabled={disabled}
                type="button"
            >
                {/* <Search className={styles.iconSearch} /> */}
                <Image src="/assets/icons/ic_search.svg" alt="search" 
                    className={styles.iconSearch} 
                    width={20} 
                    height={20} 
                />
            </Button>
            <Button 
                className={styles.button} 
                type="button"
                onClick={onClear}
                disabled={disabled}
            >
                <Image src="/assets/icons/ic_cross.svg" alt="cross" 
                    className={styles.iconCross} 
                    width={20} 
                    height={20} 
                />
            </Button>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}