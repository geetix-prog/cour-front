import { Suspense } from "react";
import DropDetail from "@/components/DropDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default function Drop({ params }: Props) {
  const id = params.then((p) => p.id);
  console.log(id)

  return (
    <div className="flex w-full justify-center p-6">
      <Suspense fallback={<p>Chargement du drop...</p>}>
        <DropDetail id={id} />
      </Suspense>
    </div>
  );
}
