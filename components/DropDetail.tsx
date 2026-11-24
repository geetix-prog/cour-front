import { Suspense } from "react";
import Link from "next/link";
import LikeButton from "./LikeButton";
import LikesCount from "./LikesCount";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import EditDropButton from "./EditDropButton";
import DeleteDropButton from "./DeleteDropButton";
import PresenceWidget from "./PresenceWidget";
import DropMap from "./DropMap";
import { getDrop } from "@/lib/api/drops";
import { getCategories } from "@/lib/api/categories";

type Props = {
  id: Promise<string>;
};

export default async function DropDetail(props: Props) {
  const id = await props.id;

  const [drop, categories] = await Promise.all([getDrop(id), getCategories()]);

  const categoryLabel = categories.find((category) => category.id === drop.category)?.label ?? drop.category;

  const date = new Date(drop.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <Link href="/drops" className="self-start text-sm font-semibold text-muted-foreground hover:text-primary">
        ← Retour aux drops
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem]">
      <article className="self-start overflow-hidden rounded-xl border border-border bg-card">
        {drop.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- images externes, hôtes inconnus
          <img src={drop.imageUrl} alt={drop.title} className="aspect-video w-full object-cover" />
        )}

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground uppercase">
              {categoryLabel}
            </span>
            <time dateTime={drop.createdAt} className="text-sm text-muted-foreground">
              {date}
            </time>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">{drop.title}</h1>
            <p className="text-sm text-muted-foreground">
              par <span className="font-semibold text-accent">{drop.author.displayName}</span>
              {drop.isMine && " (toi)"}
            </p>
          </div>

          {drop.locked ? (
            <p className="rounded-lg border border-dashed border-border p-4 text-muted-foreground">
              Ce drop est verrouillé. Rends-toi sur place pour l&apos;ouvrir.
            </p>
          ) : (
            drop.content && <p className="text-lg leading-relaxed text-primary">{drop.content}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <LikeButton dropId={drop.id} liked={drop.likedByMe} likeCount={drop.likesCount} />
            <PresenceWidget dropId={drop.id} />
          </div>

          {drop.isMine && (
            <div className="flex flex-wrap gap-2">
              <EditDropButton dropId={drop.id} />
              <DeleteDropButton dropId={drop.id} />
            </div>
          )}

          <ul className="flex flex-wrap gap-2 border-t border-border pt-5 text-xs font-semibold text-muted-foreground">
            <li className="rounded-full border border-border px-3 py-1">
              <LikesCount dropId={drop.id} initial={drop.likesCount} />
            </li>
            <li className="rounded-full border border-border px-3 py-1">
              {drop.commentsCount} commentaire{drop.commentsCount > 1 && "s"}
            </li>
            <li className="rounded-full border border-border px-3 py-1">
              {drop.opensCount} ouverture{drop.opensCount > 1 && "s"}
            </li>
            <li className="rounded-full border border-border px-3 py-1">
              📍 {drop.location.lat.toFixed(4)}, {drop.location.lng.toFixed(4)}
              {drop.location.precision === "approx" && " (approx.)"}
            </li>
          </ul>
        </div>
      </article>

      <aside className="flex flex-col gap-6">
        <DropMap
          label={`Carte : ${drop.title}`}
          points={[
            {
              id: drop.id,
              lat: drop.location.lat,
              lng: drop.location.lng,
              title: drop.title,
              approx: drop.location.precision === "approx",
            },
          ]}
        />
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement des commentaires...</p>}>
            <CommentList dropId={drop.id} />
          </Suspense>
          <CommentForm dropId={drop.id} />
        </div>
      </aside>
      </div>
    </div>
  );
}
