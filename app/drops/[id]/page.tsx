import { Suspense } from "react";
import DropDetail from "@/components/drops/list/DropDetail";

export default function Drop({ params }: PageProps<"/drops/[id]">) {
  const id = params.then((p) => p.id);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement du drop...</p>}>
        <DropDetail id={id} />
      </Suspense>
    </div>
  );
}
