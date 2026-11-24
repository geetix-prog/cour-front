'use client';
import { useEffect, useState } from 'react';
import { retain, subscribe } from '@/lib/realtime';

export function useDislike(dropId: number, initialCount: number) {
    const [count, setCount] = useState(initialCount);
    const [prevInitial, setPrevInitial] = useState(initialCount);

    if (initialCount !== prevInitial) {
        setPrevInitial(initialCount);
        setCount(initialCount);
    }

    useEffect(() => {
        const release = retain();
        const stop = subscribe('like:updated', (data: { dropId: number; dislikesCount?: number }) => {
            if (data.dropId === dropId && typeof data.dislikesCount === 'number') setCount(data.dislikesCount);
        });
        return () => {
            stop();
            release();
        };
    }, [dropId]);

    return count;
}
