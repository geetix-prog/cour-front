'use client';
import { useCallback, useEffect, useState } from 'react';
import { retain, subscribe } from '@/lib/realtime';
import type { Notification } from '@/lib/api/types';

const MAX_NOTIFICATIONS = 20;

export type AppNotification = Notification & { id: string };

export function useNotification() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    useEffect(() => {
        const release = retain();
        const stop = subscribe('notification', (data: Notification) => {
            const notification = { ...data, id: `${data.kind}-${data.dropId}-${data.by.id}-${data.at}` };
            setNotifications((current) =>
                [notification, ...current.filter((n) => n.id !== notification.id)].slice(0, MAX_NOTIFICATIONS),
            );
        });
        return () => {
            stop();
            release();
        };
    }, []);

    const dismiss = useCallback((id: string) => {
        setNotifications((current) => current.filter((n) => n.id !== id));
    }, []);

    const clear = useCallback(() => setNotifications([]), []);

    return { notifications, dismiss, clear };
}

export function notificationMessage({ kind, by, dropTitle }: Notification) {
    switch (kind) {
        case 'drop_opened':
            return `${by.displayName} a ouvert ton drop « ${dropTitle} »`;
        case 'drop_liked':
            return `${by.displayName} a aimé ton drop « ${dropTitle} »`;
        case 'drop_commented':
            return `${by.displayName} a commenté ton drop « ${dropTitle} »`;
    }
}
