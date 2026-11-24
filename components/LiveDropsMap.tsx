"use client";
import type { Drop } from "@/lib/api/types";
import { useDrops } from "@/lib/hooks/use-drops";
import DropMap, { type MapPoint } from "./DropMap";

type Props = {
  initial: Drop[];
  style?: string;
};

export default function LiveDropsMap({ initial, style }: Props) {
  const drops = useDrops(initial);

  const points: MapPoint[] = drops.map((drop) => ({
    id: drop.id,
    lat: drop.location.lat,
    lng: drop.location.lng,
    title: drop.title,
    approx: drop.location.precision === "approx",
  }));

  return <DropMap points={points} label="Carte de tous les drops" style={style} searchable />;
}
