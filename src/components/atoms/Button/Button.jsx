// src/components/atoms/Button/Button.jsx
"use client";

import { useRouter } from "next/navigation";
import styles from "./Button.module.css";

export default function Button({ children, href, onClick, className, style, disabled, type = "button" }) {
    const router = useRouter();

    const handleClick = () => {
        if (disabled) return;
        if (onClick) return onClick();
        if (href) return router.push(href);
    };

    // 커스텀 스타일/클래스를 주면 기본 버튼 스타일을 적용하지 않음(재사용 컴포넌트에서 덮어쓰기 편의)
    const resolvedClassName =
        style || className ? (className ?? '') : (styles.button ?? '');

    return (
        <button
            type={type}
            className={resolvedClassName.trim()}
            onClick={handleClick}
            style={style}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
