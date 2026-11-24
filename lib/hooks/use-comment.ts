'use client';
import { useEffect, useState } from 'react';
import { retain, subscribe } from '@/lib/realtime';
import type { Comment } from '@/lib/api/types';

type CommentsState = { items: Comment[]; total: number };

export function useComment(dropId: number, initial: CommentsState) {
    const [state, setState] = useState(initial);
    const [prevInitial, setPrevInitial] = useState(initial);

    if (initial !== prevInitial) {
        setPrevInitial(initial);
        setState(initial);
    }

    useEffect(() => {
        const release = retain();

        const stopCreated = subscribe('comment:created', ({ comment }: { comment: Comment }) => {
            if (comment.dropId !== dropId) return;
            setState((current) =>
                current.items.some((c) => c.id === comment.id)
                    ? current
                    : { items: [...current.items, comment], total: current.total + 1 },
            );
        });

        const stopDeleted = subscribe(
            'comment:deleted',
            (data: { dropId: number; commentId: number }) => {
                if (data.dropId !== dropId) return;
                setState((current) =>
                    current.items.some((c) => c.id === data.commentId)
                        ? { items: current.items.filter((c) => c.id !== data.commentId), total: current.total - 1 }
                        : current,
                );
            },
        );

        return () => {
            stopDeleted();
            stopCreated();
            release();
        };
    }, [dropId]);

    return state;
}
