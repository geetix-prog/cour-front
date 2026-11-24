"use client";
import { useActionState, useOptimistic } from "react";
import { toggleLiked } from "@/lib/actions/drops";
import { useLike } from "@/lib/hooks/use-like";

interface Props {
  dropId: number;
  liked: boolean;
  likeCount: number;
}

export default function LikeButton({ dropId, liked, likeCount }: Props) {
  const liveCount = useLike(dropId, likeCount);

  const [optimistic, toggle] = useOptimistic(
    { liked, likeCount: liveCount },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `void` : toggle() s'appelle sans argument
    (s, _: void) => ({ liked: !s.liked, likeCount: s.likeCount + (s.liked ? -1 : 1) }),
  );

  const [state, action, pending] = useActionState(async () => {
    toggle();
    return toggleLiked(dropId, liked);
  }, {});

  return (
    <form action={action} className="inline-flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={pending}
        aria-pressed={optimistic.liked}
        aria-label={optimistic.liked ? "Retirer le j'aime" : "J'aime"}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold transition-all duration-100 ease-in hover:-translate-y-0.5 disabled:cursor-not-allowed ${
          optimistic.liked ? "border-accent bg-accent/15 text-accent" : "border-border text-primary hover:border-primary/40"
        }`}
      >
        <span aria-hidden="true">{optimistic.liked ? "❤️" : "🤍"}</span>
        {optimistic.likeCount}
      </button>
      {state.error && (
        <p role="alert" className="text-xs text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
