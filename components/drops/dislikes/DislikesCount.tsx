"use client";
import { useDislike } from "@/lib/hooks/use-dislike";

type Props = {
  dropId: number;
  initial: number;
};

export default function DislikesCount({ dropId, initial }: Props) {
  const count = useDislike(dropId, initial);
  return <>{count} je n&apos;aime pas</>;
}
