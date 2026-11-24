import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-6">
      <h1 className="text-5xl font-bold text-primary sm:text-6xl">
        Cour<span className="text-accent">.</span>
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Pose des drops à un endroit précis de la carte, et découvre ceux que les autres ont laissés autour de toi.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/drops" className={buttonVariants()}>
          Voir les drops
        </Link>
        <Link href="/drops/create" className={buttonVariants({ variant: "secondary" })}>
          Créer un drop
        </Link>
      </div>
    </div>
  );
}
