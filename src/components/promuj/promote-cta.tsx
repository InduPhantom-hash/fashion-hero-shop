import Link from "next/link";

interface Props {
  productSlug: string;
  productName: string;
  sellerName?: string;
}

export function PromoteCTA({ productSlug, productName, sellerName }: Props) {
  return (
    <section className="mt-12 rounded-lg border border-dashed border-border bg-secondary/60 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-label">Widoczne dla sprzedawcy</span>
          <p className="text-base font-semibold text-foreground">
            Promuj &bdquo;{productName}&rdquo; w wynikach wyszukiwania
          </p>
          <p className="text-sm text-muted-foreground">
            Dotrzyj do kupujących, którzy szukają takich produktów.{" "}
            {sellerName ? `Konto ${sellerName}. ` : ""}Mock — żadne płatności nie są realne.
          </p>
        </div>
        <Link
          href={`/promuj/${productSlug}`}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-xs font-medium uppercase tracking-[0.6px] text-primary-foreground transition-opacity hover:opacity-85"
        >
          Promuj produkt
        </Link>
      </div>
    </section>
  );
}
