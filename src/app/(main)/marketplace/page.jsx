// src/app/(main)/marketplace/page.jsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { getMarketplace } from '@/api/marketplace';
import { getUser } from '@/api/user';
import { getCards } from '@/api/card';
import { getCollections } from '@/api/collection';
import { getOrders } from '@/api/order';
import { getTransactions } from '@/api/transaction';
import { getWallet } from '@/api/wallet';
import { getNotifications } from '@/api/notification';
import { getSettings } from '@/api/settings';
import { getProfile } from '@/api/profile';
import { getMessages } from '@/api/message';
import { getContacts } from '@/api/contact';
import { getSettings } from '@/api/settings';

export default function MarketplacePage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [cards, setCards] = useState([]);
    const [collections, setCollections] = useState([]);
    const [orders, setOrders] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState([]);

    const { data: session } = useSession();
    const { data: user } = useQuery({
        queryKey: ['user', session?.user?.id],
        queryFn: () => getUser(session?.user?.id),
        enabled: !!session?.user?.id,
    });

    const { data: cards } = useQuery({
        queryKey: ['cards', page, limit],
        queryFn: () => getCards(page, limit),
        enabled: !!session?.user?.id,
    });

    const { data: collections } = useQuery({
        queryKey: ['collections', page, limit],
        queryFn: () => getCollections(page, limit),
        enabled: !!session?.user?.id,
    });

    const { data: orders } = useQuery({
        queryKey: ['orders', page, limit],
        queryFn: () => getOrders(page, limit),
        enabled: !!session?.user?.id,
    });

    const { data: transactions } = useQuery({
        queryKey: ['transactions', page, limit],
        queryFn: () => getTransactions(page, limit),
        enabled: !!session?.user?.id,
    });

    const { data: wallets } = useQuery({
        queryKey: ['wallets', page, limit],
        queryFn: () => getWallet(page, limit),
        enabled: !!session?.user?.id,
    });

    return (
        <div>
            <h1>Marketplace</h1>
        </div>
    );
}