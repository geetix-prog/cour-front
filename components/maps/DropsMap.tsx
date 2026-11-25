import { getDrops } from "@/lib/api/drops";
import LiveDropsMap from "./LiveDropsMap";

type Props = {
  style?: string;
};

export default async function DropsMap({ style }: Props) {
  const { items } = await getDrops(1);
  return <LiveDropsMap initial={items} style={style} />;
}
