import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getProduct } from "@/data/products";
import { getSellerById } from "@/data/sellers";
import { PromoteFlow } from "@/components/promuj/promote-flow";

interface PageProps {
  params: Promise<{ productSlug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ productSlug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = getProduct(productSlug);

  return {
    title: product
      ? `Promuj ${product.name} — FashionHero`
      : "Promuj produkt — FashionHero",
    description:
      "Pretotype Sponsored Listings na FashionHero. Mock checkout, brak realnych płatności.",
  };
}

export default async function PromujPage({ params }: PageProps) {
  const { productSlug } = await params;
  const product = getProduct(productSlug);

  if (!product) {
    notFound();
  }

  const seller = getSellerById(product.sellerId);
  const cover = product.images[0] ?? product.colors[0]?.image;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav className="mb-6 text-xs">
        <Link
          href={`/products/${product.slug}`}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Wróć do {product.name}
        </Link>
      </nav>

      <div className="mb-8 flex flex-col gap-2">
        <span className="text-label">Panel sprzedawcy &middot; Sponsored Listings</span>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Promuj &bdquo;{product.name}&rdquo;
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Dotrzyj do kupujących, którzy szukają takich produktów jak Twój. Kampania
          wystartuje od razu po opłaceniu — zatrzymasz ją w dowolnym momencie z panelu.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,1.2fr)]">
        <aside className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:p-5">
          <span className="text-label">Promowany produkt</span>
          <div className="overflow-hidden rounded-md bg-secondary">
            {cover && (
              <Image
                src={cover}
                alt={product.name}
                width={480}
                height={480}
                className="aspect-square h-auto w-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-foreground">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {product.price.toLocaleString("pl-PL")} PLN
              {seller ? ` · sprzedawca ${seller.name}` : ""}
            </p>
          </div>
        </aside>

        <section className="rounded-lg border border-border bg-background p-4 sm:p-5 lg:p-6">
          <PromoteFlow productName={product.name} productSlug={product.slug} />
        </section>
      </div>
    </main>
  );
}
