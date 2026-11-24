import { Suspense } from "react";
import DropList from "@/components/DropList";
import CategorySearch from "@/components/CategorySearch";
import DropCategorie from "@/components/DropCategorie";
import OnlineWidget from "@/components/OnlineWidget";
import DropsMap from "@/components/DropsMap";

export default function Drops({ searchParams }: PageProps<"/drops">) {
  const category = searchParams.then((params) => params.category);
  const q = searchParams.then((params) => params.q);

  return (
    <div className="flex flex-col w-full items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold">Les drops</h1>
        <OnlineWidget />
      </div>
      <div className="flex w-9/10 gap-5 justify-center">
        <div className="w-1/3">
          <Suspense fallback={<p>Chargement des catégories...</p>}>
            <CategorySearch />
            <DropCategorie />
          </Suspense>
        </div>
        <div className="w-2/3">
          <Suspense fallback={<p>Chargement des drops...</p>}>
            <DropList category={category} q={q} />
          </Suspense>
        </div>
        <Suspense fallback={<p>Chargement de la carte...</p>}>
          <DropsMap style="h-auto w-full" />
        </  Suspense>
      </div>
    </div>
  );
}
