"use client";
import type { Comment } from "@/lib/api/types";
import { useComment } from "@/lib/hooks/use-comment";
import CommentItem from "./CommentItem";

type Props = {
  dropId: number;
  initial: { items: Comment[]; total: number };
};

export default function LiveCommentList({ dropId, initial }: Props) {
  const { items, total } = useComment(dropId, initial);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-primary">Commentaires ({total})</h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun commentaire pour l&apos;instant.</p>
      ) : (
        <ul className="flex flex-col gap-3" aria-live="polite">
          {items.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      )}
    </section>
  );
}
