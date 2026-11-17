"use client";
import { useRouter, useSearchParams } from "next/navigation";
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(drop: string) {
    const params = new URLSearchParams(searchParams);
    params.set("q", drop);
    router.push(`/drops?${params}`);
  }

  return <input type="text" name="search" onChange={(e) => handleSelect(e.target.value)} placeholder="Rechercher un drop" />;
}
