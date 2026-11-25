"use client";
import { useState } from "react";
import type { Comment } from "@/lib/api/types";
import { useReplies } from "@/lib/hooks/use-replies";
import CommentBody from "./CommentBody";
import ReplyForm from "./ReplyForm";
import CommentReactions from "./CommentReactions";

type Props = {
  comment: Comment;
};

const linkButton = "cursor-pointer text-xs font-semibold text-muted-foreground transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-50";

export default function CommentItem({ comment }: Props) {
  const { replies, count, hasMore, loading, error, loadMore, hide, addReply } = useReplies(comment);
  // null = formulaire fermé, "" = réponse au commentaire, sinon pseudo mentionné
  const [replyTo, setReplyTo] = useState<string | null>(null);

  function handleReplied(reply: Comment) {
    addReply(reply);
    setReplyTo(null);
    if (replies === null) loadMore();
  }

  return (
    <li className="rounded-lg border border-border bg-background/50 p-4">
      <CommentBody comment={comment} />

      <div className="mt-2 flex flex-wrap items-center gap-4">
        {!comment.deleted && <CommentReactions comment={comment} />}
        {!comment.deleted && (
          <button type="button" className={linkButton} onClick={() => setReplyTo("")}>
            Répondre
          </button>
        )}
        {count > 0 &&
          (replies === null ? (
            <button type="button" className={linkButton} onClick={loadMore} disabled={loading}>
              {loading ? "Chargement..." : `Voir ${count} réponse${count > 1 ? "s" : ""}`}
            </button>
          ) : (
            <button type="button" className={linkButton} onClick={hide}>
              Masquer les réponses
            </button>
          ))}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}

      {replies !== null && replies.length > 0 && (
        <ul className="mt-3 flex flex-col gap-3 border-l-2 border-border pl-4" aria-live="polite">
          {replies.map((reply) => (
            <li key={reply.id}>
              <CommentBody comment={reply} />
              {!reply.deleted && (
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <CommentReactions comment={reply} />
                  <button type="button" className={linkButton} onClick={() => setReplyTo(reply.author.username)}>
                    Répondre
                  </button>
                </div>
              )}
            </li>
          ))}
          {hasMore && (
            <li>
              <button type="button" className={linkButton} onClick={loadMore} disabled={loading}>
                {loading ? "Chargement..." : "Voir plus de réponses"}
              </button>
            </li>
          )}
        </ul>
      )}

      {replyTo !== null && (
        <ReplyForm
          dropId={comment.dropId}
          parentId={comment.id}
          mention={replyTo || undefined}
          onReplied={handleReplied}
          onCancel={() => setReplyTo(null)}
        />
      )}
    </li>
  );
}
