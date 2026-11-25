import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  dropId: number;
};

export default function EditDropButton({ dropId }: Props) {
  return (
    <Link href={`/drops/${dropId}/edit`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
      Modifier
    </Link>
  );
}
