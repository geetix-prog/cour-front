import { getDropComments } from "@/lib/api/drops";
import LiveCommentList from "./LiveCommentList";

type Props = {
  dropId: number;
};

export default async function CommentList({ dropId }: Props) {
  const { items, total } = await getDropComments(dropId);
  return <LiveCommentList dropId={dropId} initial={{ items, total }} />;
}
