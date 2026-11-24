'use client';
import { useEffect, useState } from 'react';
import { retain, subscribe } from '@/lib/realtime';

export function useLike(dropId: number, initialCount: number) {
    const [count, setCount] = useState(initialCount);
    const [prevInitial, setPrevInitial] = useState(initialCount);

    if (initialCount !== prevInitial) {
        setPrevInitial(initialCount);
        setCount(initialCount);
    }

    useEffect(() => {
        const release = retain();
        const stop = subscribe('like:updated', (data: { dropId: number; likesCount: number }) => {
            if (data.dropId === dropId) setCount(data.likesCount);
        });
        return () => {
            stop();
            release();
        };
    }, [dropId]);

    return count;
}
