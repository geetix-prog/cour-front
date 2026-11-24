"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-primary">Une erreur est survenue</h1>
      <p className="text-sm text-muted-foreground">
        Le serveur n&apos;a pas pu répondre. Il est peut-être surchargé ou momentanément indisponible : réessaie dans quelques
        instants.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()}>Réessayer</Button>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          Accueil
        </Link>
      </div>
      {error.digest && <p className="text-xs text-muted-foreground">Référence : {error.digest}</p>}
    </div>
  );
}
