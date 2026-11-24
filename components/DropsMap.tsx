import DropMap, { type MapPoint } from "./DropMap";
import { getDrops } from "@/lib/api/drops";

interface Props{
  style?: string;
}

export default async function DropsMap({ style }: Props) {
  const { items } = await getDrops();

  const points: MapPoint[] = items.map((drop) => ({
    id: drop.id,
    lat: drop.location.lat,
    lng: drop.location.lng,
    title: drop.title,
    approx: drop.location.precision === "approx",
  }));

  return <DropMap points={points} label="Carte de tous les drops" style={style} />;
}
