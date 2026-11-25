"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CategorySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (value) params.set("q", value);
    else params.delete("q");
    router.replace(`/drops?${params}`);
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="search">Rechercher</Label>
      <Input
        id="search"
        type="search"
        name="search"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Titre, contenu..."
      />
    </div>
  );
}
