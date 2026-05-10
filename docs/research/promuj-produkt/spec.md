# Feature: Promuj produkt — Sponsored Listings (Dragon's Lair, AIPH T3)

OPPORTUNITY: Sprzedawcy na FashionHero nie mogą kupić widoczności swoich produktów w wynikach wyszukiwania.
OUTCOME: Sprzedawca kończy 3-step flow wpisaniem mock danych karty w fake Stripe widget.

Adaptacja `Projekty/Nauka/AI-Product-Hero-FashionHero/decisions/Q-2-4/specs/feature-spec.md` (202w / 9/10) na realny kod Next.js 16 + React 19 + Tailwind v4. Pretotype HTML referencyjny: https://fh-pretotype.netlify.app/

## Co budujemy

Routa `/promuj/[productSlug]` w storefront FashionHero (slug — spójność z `/products/[slug]/`). Strona renderuje mock seller dashboard z preview produktu (pobranego z `data/products.ts` przez `getProduct(slug)`) i 3-step flow w prawej kolumnie / na pełnej szerokości mobile.

## User flow

1. Wejście na `/promuj/1` (mock productId — link np. z product page jako CTA "Promuj ten produkt").
2. Step 1 — formularz: budżet (50–500 PLN), czas (1/7/30 dni, radio), słowo kluczowe (input z auto-suggest).
3. Klik "Zapłać i uruchom" → Step 2 — fake Stripe widget z labelem "TEST" + 4 pola CC.
4. Klik "Zapłać" → Step 3 — potwierdzenie z totalem (budżet × dni), link "Wróć do sklepu".

## Kryteria akceptacji

- Budżet < 50 → komunikat "minimum 50 PLN dziennie" + submit zablokowany.
- Budżet > 500 → komunikat "skontaktuj się z account managerem" + submit zablokowany.
- Radio 1/7/30 — wybór wymagany.
- Słowo kluczowe — datalist z 3+ propozycjami ("buty męskie", "sukienka letnia", "torebka skórzana").
- Step 2 — label "TEST — żadne płatności nie są realne" widoczny.
- Step 3 — total = budżet × dni (np. 200 × 7 = 1 400 PLN), nie placeholder.
- Każde przejście loguje wpis w `localStorage["promuj-events"]` (JSON array).
- Flow działa od 320px bez horizontal scroll.
- Cały interfejs po polsku.

## Czego NIE budujemy

- Prawdziwy backend ad servingu.
- Dashboard wyników kampanii (klikalność, koszt na klik).
- Integracja z prawdziwym Stripe SDK (`@stripe/*`).
- Wysyłka maila / SMS po kliknięciu "Zapłać".
- Tracking zewnętrzny (GA, PostHog itp.).

## Pliki implementacji (planned)

- `src/app/promuj/[productSlug]/page.tsx` — Server component, await params, fetch product
- `src/components/promuj/promote-flow.tsx` — Client, state machine step 1-3
- `src/components/promuj/promote-form.tsx` — Step 1 form
- `src/components/promuj/promote-checkout.tsx` — Step 2 fake Stripe
- `src/components/promuj/promote-confirmation.tsx` — Step 3
- `src/lib/promote/event-log.ts` — localStorage helper
- `src/lib/promote/keywords.ts` — auto-suggest seed

## Przykłady

**Sukces**: `/promuj/cloud-runner` (Cloud Runner, UrbanEdge). Budżet 200 × 7 dni + "buty męskie skórzane" → Step 2 → wpisuje 4242 4242 4242 4242, 12/30, 123, "Jakub Orlowski" → Step 3 "Twoja kampania wystartuje wkrótce. Total: 1 400 PLN". Event log: 6 wpisów.

**Edge case**: Budżet 30 PLN → pole `aria-invalid`, komunikat "minimum 50 PLN dziennie", przycisk "Zapłać i uruchom" disabled.
