"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

type Props = {
    page: number;
    totalPages: number;
};

export default function ChangePageButton({ page, totalPages }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    function hrefFor(target: number) {
        const params = new URLSearchParams(searchParams);
        if (target <= 1) params.delete("page");
        else params.set("page", String(target));
        const query = params.toString();
        return query ? `${pathname}?${query}` : pathname;
    }

    const disabled = "pointer-events-none opacity-50";

    return (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-4">
        <Link
            href={hrefFor(page - 1)}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={buttonVariants({ variant: "secondary", size: "sm", className: page <= 1 ? disabled : "" })}
        >
            Page précédente
        </Link>
        <span className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
        </span>
        <Link
            href={hrefFor(page + 1)}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : undefined}
            className={buttonVariants({ variant: "secondary", size: "sm", className: page >= totalPages ? disabled : "" })}
        >
            Page suivante
        </Link>
        </nav>
    );
}
