'use client';
import { useEffect, useState } from 'react';
import { onOpen, retain, send, subscribe } from '@/lib/realtime';

type Viewer = { id: number; username: string; displayName: string; avatarUrl: string | null };

export function usePresence(dropId: number) {
    const [viewers, setViewers] = useState<Viewer[]>([]);

    useEffect(() => {
        const release = retain();
        const stopOpen = onOpen(() => send('presence:view', { dropId }));
        const stopDrop = subscribe('presence:drop', (data) => {
            if (data.dropId === dropId) setViewers(data.viewers);
        });
        return () => {
            stopDrop();
            stopOpen();
            send('presence:leave');
            release();
            setViewers([]);
            };
    }, [dropId]);
    
    return viewers;
}