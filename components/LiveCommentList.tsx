"use client";
import type { Comment } from "@/lib/api/types";
import { useComment } from "@/lib/hooks/use-comment";
import DeleteCommentButton from "./DeleteCommentButton";

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
            <li key={comment.id} className="rounded-lg border border-border bg-background/50 p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-accent">
                  {comment.author.displayName}
                  {comment.isMine && <span className="font-normal text-muted-foreground"> (toi)</span>}
                </span>
                <div className="flex items-center gap-2">
                  <time dateTime={comment.createdAt} className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  {comment.isMine && <DeleteCommentButton commentId={comment.id} />}
                </div>
              </div>
              <p className="mt-2 text-primary">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
