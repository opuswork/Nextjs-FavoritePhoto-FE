'use client';

import styles from './CardSeller.module.css';
import Image from 'next/image';
import Label from '../../atoms/Label/Label';
import Button from '../../atoms/Button/Button';

export default function CardSeller({
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

    return (
        <div className={styles.cardSellerContainer}>
            <div className={styles.cardSeller}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <span className={styles.rarity}>{rarity}</span>
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
                        <Button 
                            className={styles.quantityButton} 
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                        >
                            <Image src="/assets/icons/ic_minus.svg" alt="decrease" width={20} height={20} />
                        </Button>
                        <div className={styles.quantityValue}>{quantity}</div>
                        <Button 
                            className={styles.quantityButton} 
                            onClick={handleIncrease}
                        >
                            <Image src="/assets/icons/ic_plus.svg" alt="increase" width={20} height={20} />
                        </Button>
                    </div>
                </div>

                {/* Total Price */}
                <div className={styles.totalPriceSection}>
                    <Label>총 가격</Label>
                    <div className={styles.totalPriceValue}>{totalPrice}</div>
                </div>

                {/* Purchase Button */}
                <Button className={styles.purchaseButton} onClick={onPurchase}>
                    포토카드 판매하기
                </Button>
            </div>
        </div>    
    );
}