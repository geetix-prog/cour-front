import { Suspense } from "react";
import Link from "next/link";
import DropList from "@/components/DropList";
import CategorySearch from "@/components/CategorySearch";
import DropCategorie from "@/components/DropCategorie";
import OnlineWidget from "@/components/OnlineWidget";
import DropsMap from "@/components/DropsMap";
import { buttonVariants } from "@/components/ui/button";

export default function Drops({ searchParams }: PageProps<"/drops">) {
  const category = searchParams.then((params) => params.category);
  const q = searchParams.then((params) => params.q);

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold text-primary">Les drops</h1>
          <OnlineWidget />
        </div>
        <Link href="/drops/create" className={buttonVariants()}>
          + Créer un drop
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-22 lg:self-start">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement des filtres...</p>}>
            <CategorySearch />
            <DropCategorie />
          </Suspense>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-card lg:h-96" />}>
            <DropsMap style="h-80 w-full lg:h-96" />
          </Suspense>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement des drops...</p>}>
            <DropList category={category} q={q} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
