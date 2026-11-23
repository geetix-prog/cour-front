import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Cour</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        La carte des drops arrive bientôt.
      </p>
      <Link href="/profil">Modifier mon profil</Link>
    </main>
  );
}