"use client";
import { useActionState, useOptimistic } from "react";
import { toggleDisliked } from "@/lib/actions/drops";
import type { ActionState } from "@/lib/api/errors";
import { useDislike } from "@/lib/hooks/use-dislike";

interface Props {
  dropId: number;
  disliked: boolean;
  dislikeCount: number;
}

export default function DislikeButton({ dropId, disliked, dislikeCount }: Props) {
  const liveCount = useDislike(dropId, dislikeCount);

  type DislikeView = { disliked: boolean; dislikeCount: number };

  const [optimistic, setOptimistic] = useOptimistic<DislikeView, DislikeView>(
    { disliked, dislikeCount: liveCount },
    (_current, next) => next,
  );

  const [state, action, pending] = useActionState(async () => {
    setOptimistic({ disliked: !disliked, dislikeCount: liveCount + (disliked ? -1 : 1) });
    return toggleDisliked(dropId, disliked);
  }, {} as ActionState);

  return (
    <form action={action} className="inline-flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={pending}
        aria-pressed={optimistic.disliked}
        aria-label={optimistic.disliked ? "Retirer le je n'aime pas" : "Je n'aime pas"}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold transition-all duration-100 ease-in hover:-translate-y-0.5 disabled:cursor-not-allowed ${
          optimistic.disliked ? "border-primary bg-primary/20 text-primary" : "border-border text-primary hover:border-primary/40"
        }`}
      >
        <span aria-hidden="true" className={optimistic.disliked ? "" : "opacity-60 grayscale"}>
          👎
        </span>
        {optimistic.dislikeCount}
      </button>
      {state.error && (
        <p role="alert" className="text-xs text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
