import { Suspense } from "react";
import CreateForm from "@/components/CreateForm";
import { apiGet } from "@/lib/api/client";
import type { Category } from "@/lib/api/types";

export default function CrateDrop() {
  const categories = apiGet<Category[]>("/categories");

  return (
    <div className="flex justify-center gap-6 h-screen w-full p-5">
      <h1 className="text-white font-bold text-4xl">Créer un drop</h1>
      <Suspense>
        <CreateForm categories={categories} />
      </Suspense>
    </div>
  );
}
