import { getDrops } from "@/lib/api/drops";
import LiveDropList from "./LiveDropList";

type Props = {
  category?: Promise<string | string[] | undefined>;
  q?: Promise<string | string[] | undefined>;
  author?: string;
};

export default async function DropList(props: Props) {
  const category = await props.category;
  const q = await props.q;

  const filter = {
    category: typeof category === "string" ? category : undefined,
    q: typeof q === "string" && q !== "" ? q : undefined,
    author: props.author,
  };

  const params = new URLSearchParams();
  if (filter.category) params.set("category", filter.category);
  if (filter.q) params.set("q", filter.q);

  const { items } = await getDrops(1, params, filter.author);


  return <LiveDropList initial={items} filter={filter} />;
}
