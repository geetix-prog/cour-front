import { getDrops } from "@/lib/api/drops";
import LiveDropList from "./LiveDropList";
import ChangePageButton from "./ChangePageButton";

type SearchParam = Promise<string | string[] | undefined>;

type Props = {
  category?: SearchParam;
  q?: SearchParam;
  page?: SearchParam;
  author?: string;
};

export default async function DropList(props: Props) {
  const [category, q, rawPage] = await Promise.all([props.category, props.q, props.page]);

  const filter = {
    category: typeof category === "string" ? category : undefined,
    q: typeof q === "string" && q !== "" ? q : undefined,
    author: props.author,
  };

  const parsedPage = typeof rawPage === "string" ? Number.parseInt(rawPage, 10) : 1;
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const params = new URLSearchParams();
  if (filter.category) params.set("category", filter.category);
  if (filter.q) params.set("q", filter.q);

  const { items, totalPages } = await getDrops(page, params, filter.author);

  return (
    <div>
      <LiveDropList initial={items} filter={filter} />
      <ChangePageButton page={page} totalPages={totalPages} />
    </div>
  );
}
