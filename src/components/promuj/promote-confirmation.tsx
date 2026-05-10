"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { getEvents } from "@/lib/promote/event-log";

const emptySubscribe = () => () => {};
const getServerSnapshot = () => 0;

interface Props {
  productName: string;
  productSlug: string;
  budget: number;
  days: number;
  keyword: string;
  total: number;
}

export function PromoteConfirmation({
  productName,
  productSlug,
  budget,
  days,
  keyword,
  total,
}: Props) {
  const eventCount = useSyncExternalStore(
    emptySubscribe,
    () => getEvents().length,
    getServerSnapshot,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="text-label mb-2">Kampania uruchomiona</p>
        <h2 className="text-2xl font-semibold text-foreground">
          Twoja kampania wystartuje wkrótce.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reklama produktu &bdquo;{productName}&rdquo; będzie wyświetlana dla wyszukiwań
          &bdquo;{keyword}&rdquo; przez {days} {days === 1 ? "dzień" : "dni"}.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <dt className="text-label">Budżet / dzień</dt>
          <dd className="mt-1 text-base font-semibold">{budget} PLN</dd>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <dt className="text-label">Czas</dt>
          <dd className="mt-1 text-base font-semibold">
            {days} {days === 1 ? "dzień" : "dni"}
          </dd>
        </div>
        <div className="col-span-2 rounded-lg border border-border bg-card p-3">
          <dt className="text-label">Słowo kluczowe</dt>
          <dd className="mt-1 text-base font-semibold">{keyword}</dd>
        </div>
        <div className="col-span-2 rounded-lg bg-primary p-3 text-primary-foreground sm:col-span-4">
          <dt className="text-label opacity-80">Łącznie zapłacone</dt>
          <dd className="mt-1 text-2xl font-semibold">
            {total.toLocaleString("pl-PL")} PLN
          </dd>
        </div>
      </dl>

      {eventCount > 0 && (
        <p className="text-xs text-muted-foreground">
          Event log w localStorage: {eventCount}{" "}
          {eventCount === 1 ? "wpis" : "wpisów"} (klucz <code>promuj-events</code>).
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/products/${productSlug}`} />}
          className="h-11 w-full rounded-full text-sm uppercase tracking-[0.6px] sm:flex-1"
        >
          Wróć do produktu
        </Button>
        <Button
          nativeButton={false}
          render={<Link href="/" />}
          className="h-11 w-full rounded-full text-sm uppercase tracking-[0.6px] sm:flex-1"
        >
          Strona główna
        </Button>
      </div>
    </div>
  );
}
