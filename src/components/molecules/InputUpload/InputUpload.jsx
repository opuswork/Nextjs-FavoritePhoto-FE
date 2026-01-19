'use client';

import styles from './InputUpload.module.css';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import Image from 'next/image';

export default function InputUpload({
    label,
    placeholder,
    value,
    onChange,
    className,
    error,
    required,
    id,
    disabled
}) {
    return (
        <div className={`${styles.inputUpload} ${className}`}>
            <Label className={styles.label}>{label}</Label>
            <Input className={styles.input} type="file" placeholder={placeholder} value={value} onChange={onChange} 
                disabled={disabled}
                required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${id}-error` : null}
            />
            {value && (
                <Button 
                    className={styles.button} 
                    type="button" 
                    onClick={onClear} 
                    disabled={disabled}
                    value={value}
                >
                    <Image src="/assets/icons/ic_cross.svg" alt="cross" 
                        className={styles.iconCross} 
                        width={20} 
                        height={20} 
                    />
                </Button>
            )}
            {!value && (
                <Button 
                    className={styles.button} 
                    type="button" 
                    onClick={() => {document.getElementById(id).click()}} 
                    disabled={disabled}
                >
                    파일 선택
                </Button>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}