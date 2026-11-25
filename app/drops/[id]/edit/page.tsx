import { Suspense } from "react";
import EditDrop from "@/components/drops/edit/EditDrop";

export default function EditDropPage({ params }: PageProps<"/drops/[id]/edit">) {
  const id = params.then((p) => p.id);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-primary">Modifier le drop</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement du drop...</p>}>
        <EditDrop id={id} />
      </Suspense>
    </div>
  );
}
