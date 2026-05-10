"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logEvent } from "@/lib/promote/event-log";

export interface PromoteCheckoutValues {
  total: number;
}

interface Props {
  total: number;
  onBack: () => void;
  onSubmit: (values: PromoteCheckoutValues) => void;
}

function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function PromoteCheckout({ total, onBack, onSubmit }: Props) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const digitsOnly = number.replace(/\D/g, "");
  const expiryDigits = expiry.replace(/\D/g, "");
  const isValid =
    digitsOnly.length === 16 &&
    expiryDigits.length === 4 &&
    cvc.length >= 3 &&
    name.trim().length >= 2;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid) return;
        logEvent("submit_cc", {
          total,
          card_last4: digitsOnly.slice(-4),
        });
        onSubmit({ total });
      }}
    >
      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.6px] text-muted-foreground">
            Płatność
          </span>
          <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">
            TEST — żadne płatności nie są realne
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="cc-number" className="text-label">
              Numer karty
            </label>
            <input
              id="cc-number"
              inputMode="numeric"
              autoComplete="cc-number"
              value={number}
              onChange={(e) => setNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              className="h-11 rounded-md border border-input bg-background px-3 font-mono text-base focus:border-ring focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="cc-expiry" className="text-label">
                Ważność (MM/YY)
              </label>
              <input
                id="cc-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="12/30"
                className="h-11 rounded-md border border-input bg-background px-3 font-mono text-base focus:border-ring focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cc-cvc" className="text-label">
                CVC
              </label>
              <input
                id="cc-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                className="h-11 rounded-md border border-input bg-background px-3 font-mono text-base focus:border-ring focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="cc-name" className="text-label">
              Imię i nazwisko na karcie
            </label>
            <input
              id="cc-name"
              autoComplete="cc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jan Kowalski"
              className="h-11 rounded-md border border-input bg-background px-3 text-base focus:border-ring focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3 text-sm">
        <span className="text-muted-foreground">Łącznie do zapłaty</span>
        <span className="text-base font-semibold text-foreground">
          {total.toLocaleString("pl-PL")} PLN
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 w-full rounded-full text-sm uppercase tracking-[0.6px] sm:flex-1"
        >
          Wróć
        </Button>
        <Button
          type="submit"
          disabled={!isValid}
          className="h-11 w-full rounded-full text-sm uppercase tracking-[0.6px] sm:flex-1"
        >
          Zapłać {total.toLocaleString("pl-PL")} PLN
        </Button>
      </div>
    </form>
  );
}
