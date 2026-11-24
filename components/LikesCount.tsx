"use client";
import { useLike } from "@/lib/hooks/use-like";

type Props = {
  dropId: number;
  initial: number;
};

export default function LikesCount({ dropId, initial }: Props) {
  const count = useLike(dropId, initial);
  return <>{count} j&apos;aime</>;
}
