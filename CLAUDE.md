# Geldmeister X

Personal expense tracker app. Users log daily spending (fuel, cinema, groceries, bills…) into categories and see where their money goes per month or other periods.

## Project status

**Phase: IMPLEMENTATION.** The design is accepted: **Midnight Glass** (dark-first frosted glass). Build the UI to match `docs/design/` (tokens, screens and interaction rules in `docs/design/README.md`, per-screen HTML source in `docs/design/mockups/`). A light theme is not designed yet. The Theme setting exists in the design, but don't invent the light palette without asking.

## Platform & stack

- React Native with **Expo** (managed workflow, dev builds), **TypeScript strict**
- Android only for now; keep code iOS-compatible (no Android-only APIs without a fallback)
- Navigation: Expo Router (file-based)
- Storage: local SQLite via `expo-sqlite` + Drizzle ORM (with migrations)
- State: Zustand for UI/settings; DB reads via feature hooks
- i18n: `i18next` + `react-i18next` + `expo-localization`; languages **English and Hungarian**. No hard-coded UI strings
- Charts: plain SVG via `react-native-svg` (donut, bars); no chart library needed so far
- Dates: `date-fns`
- Glass effects: real blur only on the nav pill (`expo-blur`, Android 12+); cards and sheets use translucent/opaque fills (Android can't blur across screens). Verify performance on a real device
- UI component library: none chosen. Build a small set of custom components in `src/components/ui` from the design tokens

## Development

- Requires Node.js LTS and Android Studio (Android SDK + emulator); an Android phone with USB debugging is optional
- Dev build (needed because of native modules; Expo Go is not enough): `npx expo run:android`. Rebuild after adding native libraries
- Daily: `npx expo start` (fast refresh against the installed dev build)
- Schema change: edit `src/db/schema.ts`, then `npm run db:generate` (migrations run on app start). Insert rows with `id: newId()` from `src/lib/id.ts`
- Checks: `npm run typecheck` and `npm run lint`
- Release builds: EAS (`eas build -p android`) or local Gradle

## Domain rules

- **Expenses only.** No income tracking.
- **Money** is stored as integer minor units (never floats), always together with its currency code.
- **Currencies:** multi-currency without any conversion. Each currency works like a separate app instance: expenses, budgets, recurring items and reports are scoped to the active currency (switcher in the UI). Amounts in different currencies are never summed.
- **Categories:** fully user-managed (add/rename/delete/reorder; icon + color). Shared across all currencies. Seeded defaults:
  - Bills & Fixed: subscriptions, bills, loans, etc.
  - Transport: fuel, parking, service, tickets, etc.
  - Misc: on-demand spending like cinema, dining, etc.
- **Tags:** no subcategories. Instead, an expense can have tags, which belong to a category (e.g. Transport → `fuel`, `parking`). An expense may have multiple tags, so tag totals can overlap and are not expected to add up to the category total.
- **Expense fields:** amount, currency, category, tags (optional), date, description (optional, free text, e.g. to explain an unusual expense).
- **Editing & deleting:** every expense can be edited (amount, category, tags, date, description; currency is read-only) and deleted. Deletion is a soft delete with an Undo snackbar, with no confirmation dialog. Editing a recurring-generated expense affects only that occurrence.
- **Recurring expenses** (MVP): defined once (amount, category, tags, schedule: monthly or yearly); the expense is **auto-added** on its due date. Missed occurrences are caught up on the next app start. Generated expenses are normal, editable and deletable expenses.
- **Budgets** (MVP): an optional monthly limit per category per currency, with progress and warnings.
- **Reports:** shown on screen only (no export/share). Period: week, month, quarter, year or custom. Totals per category, with an optional breakdown by tag. Laid out so the user can copy the numbers into Excel by hand.
- **Data:** local-only, no login. Cloud sync is planned for the future, so design for it now: UUID primary keys, `createdAt`/`updatedAt` on every row, soft deletes (`deletedAt`).

## MVP features

1. Quick add expense (FAB → bottom sheet: amount keypad, category, tags, date, description)
2. Home dashboard: month total, category split chart, budget progress, recent expenses
3. Expense list: grouped by day, search, filter; tap to edit, swipe to delete (with undo)
4. Reports (as above)
5. Category & tag management
6. Recurring expenses
7. Budgets
8. Settings: currencies, language, theme

## UI

- Bottom navigation (floating glass pill): Home · Expenses · (+ FAB) · Reports · Settings
- Categories, Recurring, Budgets and Currencies are reached from Settings; the currency switcher is also reachable from the currency chip on main screens

## Code structure (target)

```
src/                    # imported as @/…
  app/                  # Expo Router routes; screens stay thin
  features/<feature>/   # components, hooks, queries per feature
  db/                   # Drizzle schema, migrations, seed data
  components/ui/        # shared design-system components
  theme/                # design tokens (from docs/design/README.md)
  i18n/                 # en.json, hu.json, setup
  lib/                  # money, dates helpers
docs/design/            # accepted design: README (tokens, rules) + mockups/
```
