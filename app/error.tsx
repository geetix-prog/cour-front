"use client"; // Les error boundaries doivent être des Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-primary">Une erreur est survenue</h2>
      <p className="text-sm text-muted-foreground">Quelque chose s&apos;est mal passé. Tu peux réessayer.</p>
      <Button onClick={() => retry()}>Réessayer</Button>
    </div>
  );
}
