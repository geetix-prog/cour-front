import { Suspense } from "react";
import EditDrop from "@/components/EditDrop";

export default function EditDropPage({ params }: PageProps<"/drops/[id]/edit">) {
  const id = params.then((p) => p.id);

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6">
      <h1 className="text-4xl font-bold text-white">Modifier le drop</h1>
      <Suspense fallback={<p>Chargement du drop...</p>}>
        <EditDrop id={id} />
      </Suspense>
    </div>
  );
}
