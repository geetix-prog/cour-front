import { Suspense } from "react";
import DropList from "@/components/DropList";
import CategorySearch from "@/components/CategorySearch";
import DropCategorie from "@/components/DropCategorie";

export default function Drops({ searchParams }: PageProps<"/drops">) {
  const category = searchParams.then((params) => params.category);
  const q = searchParams.then((params) => params.q);

  return (
    <div className="flex flex-col w-full items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Les drops</h1>
      <div className="flex w-full gap-5 justify-center">
        <div className="1/3">
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
      </div>
    </div>
  );
}
