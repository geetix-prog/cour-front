import { redirect } from "next/navigation";
import EditDropForm from "./EditDropForm";
import { getDrop } from "@/lib/api/drops";
import { getCategories } from "@/lib/api/categories";

type Props = {
  id: Promise<string>;
};

export default async function EditDrop(props: Props) {
  const id = await props.id;

  const [drop, categories] = await Promise.all([getDrop(id), getCategories()]);

  if (!drop.isMine) redirect(`/drops/${id}`);

  return <EditDropForm drop={drop} categories={categories} />;
}
