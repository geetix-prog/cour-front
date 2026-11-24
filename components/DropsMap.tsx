import { getDrops } from "@/lib/api/drops";
import LiveDropsMap from "./LiveDropsMap";

type Props = {
  style?: string;
};

export default async function DropsMap({ style }: Props) {
  const { items } = await getDrops();
  return <LiveDropsMap initial={items} style={style} />;
}
