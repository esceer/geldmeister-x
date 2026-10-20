# Design: Midnight Glass

Accepted design. Dark-first, iOS-like frosted glass. Live canvas (clickable): https://claude.ai/artifact/MtTNbHRueybQNWt8M6Etg8

`mockups/` holds the HTML source of every screen (reference only; exact sizes, colors, spacing). Sample data in them is invented.

## Screens

| Mockup | Screen |
|---|---|
| `Home.dc.html` | Dashboard: month total, budget bar, donut split, recent expenses |
| `Add.dc.html` | Add expense bottom sheet: amount keypad, category, tags, date, description |
| `Edit.dc.html` | Edit expense: same sheet prefilled, delete button top-right, currency read-only |
| `Expenses.dc.html` | List grouped by day with day totals, search, category filter chips |
| `Reports.dc.html` | Period segmented control, prev/next, total + 6-month bars, category table expandable to tags |
| `Settings.dc.html` | Money (currencies, categories, budgets, recurring) + Preferences (language, theme) |
| `Categories.dc.html` | Category cards with tag chips, reorder, edit, add tag |
| `Recurring.dc.html` | Monthly fixed total, list sorted by next due date |
| `Budgets.dc.html` | Overall left-to-spend card, per-category progress, over-budget highlight |
| `Currency.dc.html` | Bottom sheet to switch/add currency |

## Interaction rules

- Tap an expense row → Edit sheet. Swipe row left → delete.
- Delete never asks for confirmation; show an "Expense deleted · Undo" snackbar for a few seconds (soft delete).
- Editing a recurring-generated expense changes only that occurrence.
- Bottom nav: Home · Expenses · (+) · Reports · Settings. Management screens live under Settings.

## Tokens

- Background `#0B0D17`, with 3 blurred color blobs behind content (`#5B4BFF`, `#0FB5A0`, `#E0458B`; blur 90–100px, opacity 0.35–0.55)
- Text `#F4F5FA`; muted text `rgba(235,237,250,0.64)`
- Glass card: fill `rgba(255,255,255,0.06)`, border `1px rgba(255,255,255,0.12)`, backdrop blur 24 + saturate 160%, radius 22–24
- Glass sheet: fill `rgba(28,30,48,0.62)`, top border `rgba(255,255,255,0.16)`, blur 40, top radius 32, scrim `rgba(5,6,12,0.45)`
- Nav pill: fill `rgba(22,24,40,0.55)`, border `rgba(255,255,255,0.14)`, blur 28, radius 34, height 68, floating 16px from sides / 24px from bottom
- Primary accent `#8E9BFF` (FAB, primary buttons, on-accent text `#0B0D17`); link text `#AEB8FF`
- Category colors (seed defaults): Bills & Fixed `#8E9BFF`, Transport `#3DDCC5`, Misc `#FFB547`; tinted icon tiles use the color at 16% alpha
- Danger / over budget: `#FF7A7A` (bars), `#FFA3A3` (text)
- Positive trend: `#6EEAD8` on `rgba(61,220,197,0.16)`
- Font: Inter 400/500/600/700. Large amounts 40–52px bold, letter-spacing −0.03em
- Spacing: screen padding 20, section gap 14–16, row height ~60, touch targets ≥ 40–44
- Icons: stroke icons (Lucide style), 1.8 stroke width
