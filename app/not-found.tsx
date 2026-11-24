import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="text-2xl font-bold text-primary">Introuvable</h1>
      <p className="text-sm text-muted-foreground">Ce drop ou cette page n&apos;existe pas, ou a été supprimé.</p>
      <Link href="/drops" className={buttonVariants()}>
        Voir les drops
      </Link>
    </div>
  );
}
