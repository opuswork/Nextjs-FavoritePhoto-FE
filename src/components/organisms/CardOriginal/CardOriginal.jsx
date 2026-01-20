'use client';
import styles from './CardOriginal.module.css';
import Image from 'next/image';
import logo from '@/public/assets/icons/logos/logo.svg';

export default function CardOriginal() {
    return (
        <div className={styles.cardOriginal}>
            <div className={styles.cardOriginal__header}>
                <h1>Card Original</h1>
            </div>
            <div className={styles.cardOriginal__content}>
                <h2>Content</h2>
            </div>
            <div className={styles.cardOriginal__footer}>
                <h3>Footer</h3>
            </div>
        </div>
    );
}