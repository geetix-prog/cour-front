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
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        aria-pressed={optimistic.liked}
        aria-label={optimistic.liked ? "Retirer le j'aime" : "J'aime"}
        className="cursor-pointer disabled:cursor-not-allowed"
      >
        {optimistic.liked ? "❤️" : "🖤"} {optimistic.likeCount}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
