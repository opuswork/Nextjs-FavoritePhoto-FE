'use client';

import styles from './CardBuyer.module.css';
import Image from 'next/image';
import Label from '../../atoms/Label/Label';
import { ButtonBase } from '@/components/atoms/Button';

const RARITY_COLORS = {
    COMMON: '#FFD700',
    RARE: '#60a5fa',
    'SUPER RARE': '#9D4EDD',
    LEGENDARY: '#FF1744',
};

export default function CardBuyer({
    rarity = 'COMMON',
    category = '풍경',
    owner = '미쓰손',
    description = '우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다.',
    price = '4 P',
    remaining = '2 / 5',
    quantity = 2,
    onQuantityChange,
    totalPrice = '8 P (2장)',
    onPurchase,
}) {
    const handleDecrease = () => {
        if (quantity > 1 && onQuantityChange) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (onQuantityChange) {
            onQuantityChange(quantity + 1);
        }
    };

    const rarityColor = RARITY_COLORS[rarity] || '#FFD700';

    return (
        <div className={styles.cardBuyerContainer}>
            <div className={styles.cardBuyer}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <span 
                            className={styles.rarity}
                            style={{ color: rarityColor }}
                        >
                            {rarity}
                        </span>
                        <span className={styles.separator}>|</span>
                        <span className={styles.category}>{category}</span>
                    </div>
                    <span className={styles.owner}>{owner}</span>
                </div>

                {/* Description */}
                <div className={styles.description}>{description}</div>

                {/* Price and Remaining */}
                <div className={styles.infoRow}>
                    <div className={styles.infoItem}>
                        <Label>가격</Label>
                        <div className={styles.infoValue}>{price}</div>
                    </div>
                    <div className={styles.infoItem}>
                        <Label>잔여</Label>
                        <div className={styles.infoValue}>{remaining}</div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                {/* Purchase Quantity */}
                <div className={styles.quantitySection}>
                    <Label>구매수량</Label>
                    <div className={styles.quantitySelector}>
                        <ButtonBase 
                            size="xs"
                            className={styles.quantityButton} 
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                        >
                            <Image src="/assets/icons/ic_minus.svg" alt="decrease" width={20} height={20} />
                        </ButtonBase>
                        <div className={styles.quantityValue}>{quantity}</div>
                        <ButtonBase 
                            size="xs"
                            className={styles.quantityButton} 
                            onClick={handleIncrease}
                        >
                            <Image src="/assets/icons/ic_plus.svg" alt="increase" width={20} height={20} />
                        </ButtonBase>
                    </div>
                </div>

                {/* Total Price */}
                <div className={styles.totalPriceSection}>
                    <Label>총 가격</Label>
                    <div className={styles.totalPriceValue}>{totalPrice}</div>
                </div>

                {/* Purchase Button */}
                <button type="button" className={styles.purchaseButton} onClick={onPurchase}>
                    포토카드 구매하기
                </button>
            </div>
        </div>    
    );
}