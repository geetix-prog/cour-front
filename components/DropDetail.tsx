import { Suspense } from "react";
import Link from "next/link";
import LikeButton from "./LikeButton";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { getDrop } from "@/lib/api/drops";
import { getCategories } from "@/lib/api/categories";
import EditDropButton from "./EditDropButton";
import PresenceWidget from "./PresenceWidget";

type Props = {
  id: Promise<string>;
};

export default async function DropDetail(props: Props) {
  const id = await props.id;

  const [drop, categories] = await Promise.all([
    getDrop(id),
    getCategories()
  ]);

  const categoryLabel =
    categories.find((category) => category.id === drop.category)?.label ?? drop.category;

  const date = new Date(drop.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="w-full max-w-2xl overflow-hidden rounded-lg bg-primary/75">
      {drop.imageUrl && (
        <img src={drop.imageUrl} alt={drop.title} className="aspect-4/3 w-full object-cover" />
      )}

      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-lg bg-background px-3 py-1 text-sm font-semibold text-primary">
            {categoryLabel}
          </span>
          <span className="text-sm text-white italic">{date}</span>
        </div>

        <h1 className="text-3xl font-bold text-white">{drop.title}</h1>

        {drop.locked ? (
          <p className="rounded-lg bg-background/40 p-4 text-white italic">
            Ce drop est verrouillé. Rends-toi sur place pour l&apos;ouvrir.
          </p>
        ) : (
          drop.content && <p className="text-lg font-thin text-white">{drop.content}</p>
        )}
        
        <div>
          <p className="text-sm text-white italic">
            par <span className="text-accent">{drop.author.displayName}</span>
            {drop.isMine && " (toi)"}
          </p>
          <LikeButton dropId={drop.id} liked={drop.likedByMe} likeCount={drop.likesCount} />
        </div>

        <PresenceWidget dropId={drop.id} />

        {drop.isMine && 
          <EditDropButton dropId={drop.id} />
        }

        <div className="flex flex-wrap gap-3 border-t border-white/20 pt-4 text-sm font-semibold text-white">
          <span className={`rounded-lg px-3 py-1 ${drop.likedByMe ? "bg-accent" : "bg-background/40"}`}>
            {drop.likesCount} j&apos;aime
          </span>
          <span className="rounded-lg bg-background/40 px-3 py-1">
            {drop.commentsCount} commentaire{drop.commentsCount > 1 && "s"}
          </span>
          <span className="rounded-lg bg-background/40 px-3 py-1">
            {drop.opensCount} ouverture{drop.opensCount > 1 && "s"}
          </span>
          <span className="rounded-lg bg-background/40 px-3 py-1">
            📍 {drop.location.lat.toFixed(4)}, {drop.location.lng.toFixed(4)}
            {drop.location.precision === "approx" && " (approx.)"}
          </span>
        </div>
      </div>

      <Suspense fallback={<p className="px-6 py-4 text-sm text-white italic">Chargement des commentaires...</p>}>
        <CommentList dropId={drop.id} />
      </Suspense>

      <CommentForm dropId={drop.id} />

      <div className="px-6 pb-6">
        <Link
          href="/drops"
          className="inline-block rounded-lg bg-primary p-3 font-semibold text-background transition duration-100 ease-in hover:-translate-y-0.5"
        >
          ← Retour aux drops
        </Link>
      </div>
    </article>
  );
}
