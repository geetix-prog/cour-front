'use client';
import { useEffect, useState } from 'react';
import { getOnline, retain, subscribe } from '@/lib/realtime';
import type { PublicUser } from '@/lib/api/types';

export function useOnline() {
    const [users, setUsers] = useState<PublicUser[]>(getOnline);

    useEffect(() => {
        const release = retain();
        const stopHello = subscribe('hello', (data) => setUsers(data.online));
        const stopOnline = subscribe('presence:online', (data) => setUsers(data.users));
        return () => {
            stopOnline();
            stopHello();
            release();
        };
    }, []);

    return users;
}
