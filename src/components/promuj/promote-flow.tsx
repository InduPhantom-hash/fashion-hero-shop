"use client";

import { useState } from "react";
import { PromoteForm, type PromoteFormValues } from "./promote-form";
import { PromoteCheckout } from "./promote-checkout";
import { PromoteConfirmation } from "./promote-confirmation";

type Step = "form" | "checkout" | "confirmation";

interface Props {
  productName: string;
  productSlug: string;
}

export function PromoteFlow({ productName, productSlug }: Props) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<PromoteFormValues | null>(null);

  const total = form ? form.budget * form.days : 0;

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator step={step} />

      {step === "form" && (
        <PromoteForm
          onSubmit={(values) => {
            setForm(values);
            setStep("checkout");
          }}
        />
      )}

      {step === "checkout" && form && (
        <PromoteCheckout
          total={total}
          onBack={() => setStep("form")}
          onSubmit={() => setStep("confirmation")}
        />
      )}

      {step === "confirmation" && form && (
        <PromoteConfirmation
          productName={productName}
          productSlug={productSlug}
          budget={form.budget}
          days={form.days}
          keyword={form.keyword}
          total={total}
        />
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "form", label: "Kampania" },
    { id: "checkout", label: "Płatność" },
    { id: "confirmation", label: "Potwierdzenie" },
  ];
  const activeIndex = steps.findIndex((s) => s.id === step);

  return (
    <ol className="flex items-center gap-2 text-xs">
      {steps.map((s, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        return (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : isDone
                    ? "border-primary bg-card text-primary"
                    : "border-border bg-card text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`uppercase tracking-[0.6px] ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span className="mx-1 h-px w-4 bg-border sm:w-8" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
