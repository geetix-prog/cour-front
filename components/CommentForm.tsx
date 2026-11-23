"use client";
import { useActionState } from "react";
import { createDropComment, type CommentState } from "@/lib/actions/drops";

type Props = {
  dropId: number;
};

export default function CommentForm({ dropId }: Props) {
  const [state, action, pending] = useActionState(
    createDropComment.bind(null, String(dropId)),
    {} as CommentState,
  );

  return (
    <form action={action} className="flex flex-col gap-2 border-t border-white/20 px-6 py-4">
      <label htmlFor="comment-content" className="text-sm font-semibold text-white">
        Ajouter un commentaire
      </label>
      <textarea
        id="comment-content"
        name="content"
        required
        rows={3}
        placeholder="Écris ton commentaire..."
        className="resize-none rounded-lg bg-background/40 p-3 text-white placeholder:text-white/60"
      />
      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-end rounded-full bg-background px-4 py-2 text-sm font-semibold uppercase transition-all duration-100 ease-in hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Envoi..." : "Commenter"}
      </button>
    </form>
  );
}
