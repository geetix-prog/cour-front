import Link from "next/link";

type Props = {
  dropId: number;
};

export default function EditDropButton({ dropId }: Props) {
  return (
    <Link
      href={`/drops/${dropId}/edit`}
      className="self-start rounded-full bg-background px-4 py-2 text-sm font-semibold uppercase transition-all duration-100 ease-in hover:-translate-y-0.5"
    >
      Modifier
    </Link>
  );
}
