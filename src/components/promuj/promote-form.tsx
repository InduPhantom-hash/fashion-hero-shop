"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { logEvent } from "@/lib/promote/event-log";
import { keywordSuggestions } from "@/lib/promote/keywords";

const MIN_BUDGET = 50;
const MAX_BUDGET = 500;
const DURATIONS = [1, 7, 30] as const;
type Duration = (typeof DURATIONS)[number];

export interface PromoteFormValues {
  budget: number;
  days: Duration;
  keyword: string;
}

interface Props {
  onSubmit: (values: PromoteFormValues) => void;
}

export function PromoteForm({ onSubmit }: Props) {
  const [budget, setBudget] = useState<number | "">("");
  const [days, setDays] = useState<Duration>(7);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    logEvent("open_form");
  }, []);

  const budgetError =
    budget === ""
      ? ""
      : budget < MIN_BUDGET
        ? `minimum ${MIN_BUDGET} PLN dziennie`
        : budget > MAX_BUDGET
          ? "skontaktuj się z account managerem"
          : "";
  const keywordError = keyword.trim().length > 0 && keyword.trim().length < 3
    ? "podaj minimum 3 znaki"
    : "";

  const isValid =
    typeof budget === "number" &&
    budget >= MIN_BUDGET &&
    budget <= MAX_BUDGET &&
    keyword.trim().length >= 3;

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid || typeof budget !== "number") return;
        logEvent("open_checkout", { budget, days, keyword: keyword.trim() });
        onSubmit({ budget, days, keyword: keyword.trim() });
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="budget" className="text-label">
          Budżet dzienny (PLN)
        </label>
        <input
          id="budget"
          type="number"
          inputMode="numeric"
          min={MIN_BUDGET}
          max={MAX_BUDGET}
          value={budget}
          onChange={(e) => {
            const next = e.target.value === "" ? "" : Number(e.target.value);
            setBudget(next);
            if (typeof next === "number" && !Number.isNaN(next)) {
              logEvent("fill_budget", { budget: next });
            }
          }}
          aria-invalid={!!budgetError}
          aria-describedby="budget-help"
          className="h-11 rounded-md border border-input bg-card px-3 text-base focus:border-ring focus:outline-none aria-[invalid=true]:border-destructive"
          placeholder="np. 200"
        />
        <p
          id="budget-help"
          className={`text-xs ${budgetError ? "text-destructive" : "text-muted-foreground"}`}
        >
          {budgetError || `Zakres ${MIN_BUDGET}–${MAX_BUDGET} PLN dziennie.`}
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-label mb-1">Czas trwania kampanii</legend>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => {
            const active = d === days;
            return (
              <label
                key={d}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <input
                  type="radio"
                  name="days"
                  value={d}
                  checked={active}
                  onChange={() => {
                    setDays(d);
                    logEvent("fill_days", { days: d });
                  }}
                  className="sr-only"
                />
                {d} {d === 1 ? "dzień" : "dni"}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="keyword" className="text-label">
          Słowo kluczowe
        </label>
        <input
          id="keyword"
          type="text"
          list="keyword-suggestions"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (e.target.value.trim().length >= 3) {
              logEvent("fill_keyword", { keyword: e.target.value.trim() });
            }
          }}
          aria-invalid={!!keywordError}
          aria-describedby="keyword-help"
          className="h-11 rounded-md border border-input bg-card px-3 text-base focus:border-ring focus:outline-none aria-[invalid=true]:border-destructive"
          placeholder="np. buty męskie skórzane"
        />
        <datalist id="keyword-suggestions">
          {keywordSuggestions.map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>
        <p
          id="keyword-help"
          className={`text-xs ${keywordError ? "text-destructive" : "text-muted-foreground"}`}
        >
          {keywordError || "Wybierz z listy lub wpisz własne (min 3 znaki)."}
        </p>
      </div>

      <Button
        type="submit"
        disabled={!isValid}
        className="h-11 w-full rounded-full text-sm uppercase tracking-[0.6px]"
      >
        Zapłać i uruchom
      </Button>
    </form>
  );
}
