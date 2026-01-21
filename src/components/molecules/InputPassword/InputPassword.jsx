'use client';

import Input from '../../atoms/Input/Input';
import styles from './InputPassword.module.css';
import Image from 'next/image';
import EyeIcon from '../../../public/assets/icons/ic_eye.svg';
import EyeSlashIcon from '../../../public/assets/icons/ic_eye_slash.svg';
import Button from '../../atoms/Button/Button';
import Label from '../../atoms/Label/Label';   
import { useState } from 'react';

export default function InputPassword({ 
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
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div 
            className={`${styles.inputLabel} ${className}`}
        >
            <Label className={styles.label}>{label}</Label>
            <Input 
                type={showPassword ? 'text' : 'password'} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                className={`${styles.input} ${className} ${error ? styles.error : ''}`}
                disabled={disabled}
                required={required}
            />
            <Button className={styles.button} onClick={() => setShowPassword(!showPassword)}>
                <Image src={showPassword ? EyeIcon : EyeSlashIcon} alt="show password" width={20} height={20} className={styles.iconEye} />
            </Button>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}