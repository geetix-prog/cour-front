import { Suspense } from "react";
import ProfilDetail from "@/components/ProfilDetail";

export default function Profil() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-primary">Mon profil</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement de votre profil...</p>}>
        <ProfilDetail />
      </Suspense>
    </div>
  );
}
