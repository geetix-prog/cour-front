"use client";
import { useActionState, useOptimistic } from "react";
import { toggleLiked } from "@/lib/actions/drops";

interface Props {
  dropId: number;
  liked: boolean;
  likeCount: number;
}

export default function LikeButton({ dropId, liked, likeCount }: Props) {
  const [optimistic, toggle] = useOptimistic({ liked, likeCount }, (s, _: void) => ({ liked: !s.liked, likeCount: s.likeCount + (s.liked ? -1 : 1) }));

  const [state, action, pending] = useActionState(async () => {
    toggle();
    return toggleLiked(dropId, liked);
  }, {});

  return (
    <form action={action}>
      <button disabled={pending}>
        {optimistic.liked ? "❤️" : "🖤"} {optimistic.likeCount}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
