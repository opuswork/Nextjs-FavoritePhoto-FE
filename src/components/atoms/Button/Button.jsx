// src/components/atoms/Button/Button.jsx
"use client";

import { useRouter } from "next/navigation";

export default function Button({ children, href }) {
    const router = useRouter();
    return <button onClick={() => router.push(href)}>{children}</button>;
}
