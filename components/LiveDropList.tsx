"use client";
import Image from "next/image";
import Link from "next/link";
import type { Drop } from "@/lib/api/types";
import { useDrops, type DropFilter } from "@/lib/hooks/use-drops";
import mapPoint from "@/app/assets/mapPoint.png";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";

type Props = {
  initial: Drop[];
  filter: DropFilter;
};

export default function LiveDropList({ initial, filter }: Props) {
  const items = useDrops(initial, filter);

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Aucun drop pour le moment.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((drop) => (
        <li
          key={drop.id}
          className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-100 ease-in hover:-translate-y-0.5 hover:border-primary/40"
        >
          {drop.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- images externes, hôtes inconnus
            <img src={drop.imageUrl} alt="" loading="lazy" className="aspect-video w-full object-cover" />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-background/60" aria-hidden="true">
              <Image src={mapPoint} alt="" className="size-12 opacity-40" />
            </div>
          )}

          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="flex flex-col gap-1">
              <h2 className="line-clamp-1 text-lg font-bold text-primary">
                <Link href={`/drops/${drop.id}`} className="after:absolute after:inset-0 after:content-['']">
                  {drop.title}
                </Link>
              </h2>
              {drop.content && <p className="line-clamp-2 text-sm text-muted-foreground">{drop.content}</p>}
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-muted-foreground">
                par <Link href={`/user/${drop.author.username}`} className="font-semibold text-accent">{drop.author.displayName}</Link>
              </span>
              <div className="relative z-10 flex shrink-0 items-center gap-1.5">
                <LikeButton dropId={drop.id} liked={drop.likedByMe} likeCount={drop.likesCount} />
                <DislikeButton dropId={drop.id} disliked={drop.dislikedByMe} dislikeCount={drop.dislikesCount} />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
