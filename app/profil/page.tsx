import { Suspense } from "react";
import ProfilDetail from "@/components/users/me/ProfilDetail";

export default function Profil({ searchParams }: PageProps<"/profil">) {
  const page = searchParams.then((params) => params.page);

  return (
    <div className="mx-10 my-5 flex flex-col items-center space-y-5">
      <h1 className="text-4xl font-bold text-primary">Mon profil</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement de votre profil...</p>}>
        <ProfilDetail page={page} />
      </Suspense>
    </div>
  );
}
