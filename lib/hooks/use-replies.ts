'use client';
import { useEffect, useState } from 'react';
import { retain, subscribe } from '@/lib/realtime';
import { loadCommentReplies } from '@/lib/actions/drops';
import type { Comment } from '@/lib/api/types';

type State = {
    items: Comment[] | null; // null = pas encore chargées
    page: number;
    totalPages: number;
    added: Set<number>; // réponses arrivées depuis le dernier rendu serveur
    removed: Set<number>; // réponses supprimées depuis le dernier rendu serveur
};

function initialState(): State {
    return { items: null, page: 0, totalPages: 1, added: new Set(), removed: new Set() };
}

export function useReplies(root: Comment) {
    const [state, setState] = useState(initialState);
    const [prevCount, setPrevCount] = useState(root.repliesCount);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Nouveau compteur venu du serveur : il inclut déjà les ajouts/suppressions vus.
    if (root.repliesCount !== prevCount) {
        setPrevCount(root.repliesCount);
        setState((s) => ({ ...s, added: new Set(), removed: new Set() }));
    }

    function addReply(reply: Comment) {
        setState((s) => {
            if (s.added.has(reply.id) || s.items?.some((r) => r.id === reply.id)) return s;
            return {
                ...s,
                items: s.items ? [...s.items, reply] : s.items,
                added: new Set(s.added).add(reply.id),
            };
        });
    }

    useEffect(() => {
        const release = retain();

        const stopCreated = subscribe('comment:created', ({ comment }: { comment: Comment }) => {
            if (comment.parentId === root.id) addReply(comment);
        });

        const stopUpdated = subscribe('comment:updated', ({ comment }: { comment: Comment }) => {
            if (comment.parentId !== root.id) return;
            setState((s) => ({
                ...s,
                items: s.items?.map((r) => (r.id === comment.id ? comment : r)) ?? null,
            }));
        });

        const stopDeleted = subscribe('comment:deleted', ({ commentId }: { commentId: number }) => {
            setState((s) => {
                if (!s.items?.some((r) => r.id === commentId)) return s;
                return {
                    ...s,
                    items: s.items.filter((r) => r.id !== commentId),
                    removed: new Set(s.removed).add(commentId),
                };
            });
        });

        return () => {
            stopDeleted();
            stopUpdated();
            stopCreated();
            release();
        };
    }, [root.id]);

    async function loadMore() {
        setLoading(true);
        setError(null);
        try {
            const next = await loadCommentReplies(root.id, state.page + 1);
            setState((s) => {
                const known = new Set((s.items ?? []).map((r) => r.id));
                return {
                    ...s,
                    items: [...(s.items ?? []), ...next.items.filter((r) => !known.has(r.id))],
                    page: next.page,
                    totalPages: next.totalPages,
                };
            });
        } catch {
            setError('Impossible de charger les réponses.');
        } finally {
            setLoading(false);
        }
    }

    function hide() {
        setState((s) => ({ ...s, items: null, page: 0, totalPages: 1 }));
    }

    return {
        replies: state.items,
        count: root.repliesCount + state.added.size - state.removed.size,
        hasMore: state.items === null || state.page < state.totalPages,
        loading,
        error,
        loadMore,
        hide,
        addReply,
    };
}
