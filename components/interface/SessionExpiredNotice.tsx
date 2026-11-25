"use client";
import { useSearchParams } from "next/navigation";

export default function SessionExpiredNotice() {
  const searchParams = useSearchParams();
  if (searchParams.get("expired") !== "1") return null;

  return (
    <p role="status" className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent md:col-span-2">
      Ta session a expiré. Reconnecte-toi pour continuer.
    </p>
  );
}
