import { Suspense } from "react";
import DropList from "@/components/DropList";

export default function Drops() {
  return (
    <div className="m-10 flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold">Les drops</h1>
      <Suspense fallback={<p>Chargement des drops...</p>}>
        <DropList />
      </Suspense>
    </div>
  );
}
