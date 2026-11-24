import { Suspense } from "react";
import CreateForm from "@/components/CreateForm";
import { getCategories } from "@/lib/api/categories";

export default function CreateDrop() {
  const categories = getCategories();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-primary">Créer un drop</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement du formulaire...</p>}>
        <CreateForm categories={categories} />
      </Suspense>
    </div>
  );
}
