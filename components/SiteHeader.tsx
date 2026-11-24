import Link from "next/link";
import { cookies } from "next/headers";
import { logout } from "@/lib/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";

const navLinks = [
  { href: "/drops", label: "Drops" },
  { href: "/drops/create", label: "Créer" },
  { href: "/profil", label: "Profil" },
];

export default async function SiteHeader() {
  const session = (await cookies()).get("session")?.value;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-primary">
          Cour<span className="text-accent">.</span>
        </Link>

        {session ? (
          <nav className="flex items-center gap-1 sm:gap-3" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                {link.label}
              </Link>
            ))}
            <NotificationBell />
            <form action={logout}>
              <button type="submit" className={buttonVariants({ variant: "secondary", size: "sm" })}>
                Déconnexion
              </button>
            </form>
          </nav>
        ) : (
          <Link href="/auth" className={buttonVariants({ size: "sm" })}>
            Connexion
          </Link>
        )}
      </div>
    </header>
  );
}
