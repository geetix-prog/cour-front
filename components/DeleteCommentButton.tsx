"use client";
import { useActionState, useOptimistic } from "react";
import { deleteDropComment, type CommentState } from "@/lib/actions/drops";

type Props = {
  commentId: number;
};

export default function DeleteCommentButton({ commentId }: Props) {
  const [state, action, pending] = useActionState(
    () => deleteDropComment(commentId),
    {} as CommentState,
  );

  return (
    <form action={action} className="ml-3 inline-flex items-center gap-2">
      {state.error && (
        <span role="alert" className="text-xs text-accent">
          {state.error}
        </span>
      )}
      <button
        type="submit"
        disabled={pending}
        aria-label="Supprimer le commentaire"
        title="Supprimer le commentaire"
        className="h-8 w-8 cursor-pointer rounded-full bg-primary/25 transition duration-75 hover:bg-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          aria-hidden="true"
          className="inline-block h-5 w-5 text-white/70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12m-9 0V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-7 0 .75 12.25A1.5 1.5 0 0 0 10.25 20.5h3.5a1.5 1.5 0 0 0 1.5-1.25L16 7m-6 3.5v6m4-6v6" />
        </svg>
      </button>
    </form>
  );
}
