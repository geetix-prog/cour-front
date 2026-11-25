import Link from "next/link";
import type { Comment } from "@/lib/api/types";
import DeleteCommentButton from "./DeleteCommentButton";

type Props = {
  comment: Comment;
};

export default function CommentBody({ comment }: Props) {
  if (comment.deleted) {
    return <p className="text-sm italic text-muted-foreground">Commentaire supprimé</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href={`/user/${comment.author.username}`} className="font-semibold text-accent">
          {comment.author.displayName}
          {comment.isMine && <span className="font-normal text-muted-foreground"> (toi)</span>}
        </Link>
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
    </>
  );
}
