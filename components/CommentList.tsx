import { apiGet } from "@/lib/api/client";
import type { CommentPage } from "@/lib/api/types";

type Props = {
  dropId: number;
};

export default async function CommentList({ dropId }: Props) {
  const { items, total } = await apiGet<CommentPage>(`/drops/${dropId}/comments`);

  return (
    <section className="flex flex-col gap-3 border-t border-white/20 px-6 py-4">
      <h2 className="text-lg font-semibold text-white">
        Commentaires ({total})
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-white italic">Aucun commentaire pour l&apos;instant.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((comment) => (
            <li key={comment.id} className="rounded-lg bg-background/40 p-3">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-accent">
                  {comment.author.displayName}
                  {comment.isMine && <span className="font-normal text-white"> (toi)</span>}
                </span>
                <time dateTime={comment.createdAt} className="text-white/70 italic">
                  {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              <p className="mt-1 text-white">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
