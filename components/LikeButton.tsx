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

  type LikeView = { liked: boolean; likeCount: number };

  // L'état optimiste est une valeur absolue calculée au clic, pas un « +1 » relatif :
  // sinon, quand `like:updated` arrive pendant l'action (le serveur le diffuse aussi à soi-même),
  // le +1 serait réappliqué sur un compteur qui inclut déjà notre like (on verrait 2 au lieu de 1).
  const [optimistic, setOptimistic] = useOptimistic<LikeView, LikeView>(
    { liked, likeCount: liveCount },
    (_current, next) => next,
  );

  const [state, action, pending] = useActionState(async () => {
    setOptimistic({ liked: !liked, likeCount: liveCount + (liked ? -1 : 1) });
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
