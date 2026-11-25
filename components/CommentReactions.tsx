"use client";
import { useActionState, useOptimistic, useState } from "react";
import { toggleCommentReaction, type CommentReaction, type ReactionResult } from "@/lib/actions/drops";
import type { Comment, CommentReactionState } from "@/lib/api/types";

type Props = {
  comment: Comment;
};

function nextState(current: CommentReactionState, reaction: CommentReaction): CommentReactionState {
  if (reaction === "like") {
    return current.liked
      ? { ...current, liked: false, likesCount: current.likesCount - 1 }
      : {
          liked: true,
          likesCount: current.likesCount + 1,
          disliked: false,
          dislikesCount: current.disliked ? current.dislikesCount - 1 : current.dislikesCount,
        };
  }
  return current.disliked
    ? { ...current, disliked: false, dislikesCount: current.dislikesCount - 1 }
    : {
        disliked: true,
        dislikesCount: current.dislikesCount + 1,
        liked: false,
        likesCount: current.liked ? current.likesCount - 1 : current.likesCount,
      };
}

const base =
  "inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold transition-all duration-100 ease-in hover:-translate-y-0.5 disabled:cursor-not-allowed";

export default function CommentReactions({ comment }: Props) {
  const [reactions, setReactions] = useState<CommentReactionState>({
    liked: comment.likedByMe,
    disliked: comment.dislikedByMe,
    likesCount: comment.likesCount,
    dislikesCount: comment.dislikesCount,
  });

  // Compteurs mis à jour par le serveur (refresh ou temps réel) : on garde notre propre réaction.
  const [prevCounts, setPrevCounts] = useState([comment.likesCount, comment.dislikesCount]);
  if (prevCounts[0] !== comment.likesCount || prevCounts[1] !== comment.dislikesCount) {
    setPrevCounts([comment.likesCount, comment.dislikesCount]);
    setReactions((r) => ({ ...r, likesCount: comment.likesCount, dislikesCount: comment.dislikesCount }));
  }

  const [optimistic, setOptimistic] = useOptimistic(reactions);

  const [state, action, pending] = useActionState(async (_prev: ReactionResult, form: FormData) => {
    const reaction = form.get("reaction") === "dislike" ? "dislike" : "like";
    setOptimistic(nextState(reactions, reaction));
    const active = reaction === "like" ? reactions.liked : reactions.disliked;
    const result = await toggleCommentReaction(comment.id, reaction, active);
    if (result.reaction) setReactions(result.reaction);
    return result;
  }, {} as ReactionResult);

  return (
    <form action={action} className="inline-flex items-center gap-1.5">
      <button
        type="submit"
        name="reaction"
        value="like"
        disabled={pending}
        aria-pressed={optimistic.liked}
        aria-label={optimistic.liked ? "Retirer le j'aime" : "J'aime"}
        className={`${base} ${
          optimistic.liked ? "border-accent bg-accent/15 text-accent" : "border-border text-primary hover:border-primary/40"
        }`}
      >
        <span aria-hidden="true">{optimistic.liked ? "❤️" : "🤍"}</span>
        {optimistic.likesCount}
      </button>
      <button
        type="submit"
        name="reaction"
        value="dislike"
        disabled={pending}
        aria-pressed={optimistic.disliked}
        aria-label={optimistic.disliked ? "Retirer le je n'aime pas" : "Je n'aime pas"}
        className={`${base} ${
          optimistic.disliked ? "border-primary bg-primary/20 text-primary" : "border-border text-primary hover:border-primary/40"
        }`}
      >
        <span aria-hidden="true" className={optimistic.disliked ? "" : "opacity-60 grayscale"}>
          👎
        </span>
        {optimistic.dislikesCount}
      </button>
      {state.error && (
        <span role="alert" className="text-xs text-destructive">
          {state.error}
        </span>
      )}
    </form>
  );
}
