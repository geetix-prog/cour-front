'use client';
import { useEffect, useState } from 'react';
import { retain, subscribe } from '@/lib/realtime';
import type { Drop } from '@/lib/api/types';

export type DropFilter = { category?: string; q?: string };

function matches(drop: Drop, filter: DropFilter) {
    if (drop.hidden) return false;
    if (filter.category && drop.category !== filter.category) return false;
    if (filter.q) {
        const q = filter.q.toLowerCase();
        const text = `${drop.title} ${drop.content ?? ''}`.toLowerCase();
        if (!text.includes(q)) return false;
    }
    return true;
}

export function useDrops(initial: Drop[], filter: DropFilter = {}) {
    const [drops, setDrops] = useState(initial);
    const [prevInitial, setPrevInitial] = useState(initial);

    if (initial !== prevInitial) {
        setPrevInitial(initial);
        setDrops(initial);
    }

    const { category, q } = filter;

    useEffect(() => {
        const release = retain();
        const current = { category, q };

        const stopCreated = subscribe('drop:created', ({ drop }: { drop: Drop }) => {
            if (!matches(drop, current)) return;
            setDrops((list) => (list.some((d) => d.id === drop.id) ? list : [drop, ...list]));
        });

        const stopUpdated = subscribe('drop:updated', ({ drop }: { drop: Drop }) => {
            setDrops((list) => {
                const exists = list.some((d) => d.id === drop.id);
                if (!matches(drop, current)) return exists ? list.filter((d) => d.id !== drop.id) : list;
                return exists ? list.map((d) => (d.id === drop.id ? drop : d)) : list;
            });
        });

        const stopDeleted = subscribe('drop:deleted', ({ dropId }: { dropId: number }) => {
            setDrops((list) => list.filter((d) => d.id !== dropId));
        });

        return () => {
            stopDeleted();
            stopUpdated();
            stopCreated();
            release();
        };
    }, [category, q]);

    return drops;
}
