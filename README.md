# Geldmeister X

A personal expense tracker for Android. Log what you spend in seconds, sort it into categories and tags, and see where your money goes each week, month, quarter or year. Everything stays on your phone: no account, no cloud, no ads.

<p align="center">
  <img src="docs/screenshots/home.png" alt="Home: month total, category split and recent expenses" width="300">
  &nbsp;&nbsp;
  <img src="docs/screenshots/reports.png" alt="Reports: monthly totals per category with tag breakdown" width="300">
</p>

## Features

- **Quick add.** Tap **+**, type the amount on the keypad, pick a category and tags, save. Date and description are optional.
- **Overview.** This month's total, the change versus last month, a category split and budget progress.
- **Expenses list.** Grouped by day, with search and category filters. Tap to edit; swipe left to delete (with Undo).
- **Reports.** Week, month, quarter, year or a custom range. Totals per category, expandable to tags, laid out so you can copy the numbers into a spreadsheet by hand.
- **Categories and tags.** Fully customizable, with icons, colors and drag-to-reorder. Tags belong to a category (Transport → `fuel`, `parking`).
- **Recurring expenses.** Monthly or yearly items (rent, subscriptions, insurance) are added automatically when due. Missed ones are caught up the next time you open the app.
- **Budgets.** An optional monthly limit per category, with warnings when you go over.
- **Multiple currencies.** Each currency has its own expenses, budgets and reports. Amounts are never converted or mixed.
- **English and Hungarian.**

## Tech stack

| Area | Choice |
|---|---|
| Framework | [Expo](https://expo.dev) SDK 58 (React Native 0.88), TypeScript (strict) |
| Navigation | Expo Router (file-based routes in `src/app`) |
| Storage | SQLite (`expo-sqlite`) with [Drizzle ORM](https://orm.drizzle.team) and migrations |
| State | Zustand (settings, persisted locally) |
| i18n | i18next, react-i18next, expo-localization |
| UI | Custom components on the "Midnight Glass" design tokens; charts drawn with `react-native-svg` |
| Tests | Jest (`jest-expo`) for money, date-period and recurring-schedule logic |

The app targets Android for now, but the code avoids Android-only APIs so an iOS build stays possible.

## Requirements

- **Node.js 24 LTS** and npm
- **Android Studio** with the Android SDK and an emulator (or an Android phone with USB debugging)
- **JDK 17** for Gradle (point `JAVA_HOME` at it); this is the version the build is tested with
- `ANDROID_HOME` set to your SDK, with `platform-tools` and `emulator` on your `PATH`
- Optional: Watchman (faster file watching on macOS)

The app uses native modules, so it runs in its own **development build**. Expo Go is not enough.

## Getting started

```sh
git clone <repo-url> geldmeister-x
cd geldmeister-x
npm install

# Start an emulator from Android Studio (or plug in a phone), then:
npx expo run:android      # builds and installs the dev build, then starts Metro
```

The first build takes a few minutes. After that, day-to-day work is just:

```sh
npx expo start            # Metro with fast refresh; open the installed app
```

Run `npx expo run:android` again only when you add or update a library with native code. The `android/` folder is generated and not committed. After changing `app.json`, the app icon or the splash screen, regenerate it first with `npx expo prebuild -p android --clean`.

## Installing on your phone

1. On the phone, enable **Developer options** (tap *Build number* seven times in *About phone*), then turn on **USB debugging**.
2. Connect the phone by USB and accept the debugging prompt. `adb devices` should list it.
3. Choose a build:
   - **Development build** (needs Metro running on your computer):
     ```sh
     npx expo run:android --device
     ```
   - **Standalone build** (bundles the JavaScript and runs without your computer):
     ```sh
     npx expo run:android --variant release --device
     ```
     The APK is written to `android/app/build/outputs/apk/release/app-release.apk`, so you can also copy it to a phone and install it directly. It is signed with the debug key, which is fine for personal use. Publishing to Google Play needs a real upload key, or a build with EAS (`npx eas-cli build -p android`).

Your data lives in the app's local database. Uninstalling the app deletes it.

## Scripts

| Command | What it does |
|---|---|
| `npm run android` | Build and run the dev build (`expo run:android`) |
| `npm start` | Start Metro (`expo start`) |
| `npm test` | Run the unit tests |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint (Expo config + Prettier) |
| `npm run format` | Format with Prettier |
| `npm run db:generate` | Generate a migration after changing `src/db/schema.ts` |

## Project structure

```
src/
  app/              Routes (Expo Router). Tabs, the Settings stack, and bottom sheets as modal routes
  features/         One folder per feature: components, hooks and queries
                    (expenses, home, reports, categories, recurring, budgets, currencies, settings)
  components/ui/    Shared design-system components (Screen, Card, Sheet, Button, …)
  db/               Drizzle schema, generated migrations, seed data, useQuery hook
  i18n/             en.json, hu.json and setup
  lib/              Pure helpers: money, dates, periods, recurring schedules (unit tested)
  theme/            Design tokens
assets/             App icon and splash images
docs/design/        Design reference: tokens, interaction rules, screen mockups, icon generator
```

## Data model

- Amounts are stored as **integer minor units** together with a currency code: HUF in whole forints, EUR and most others in cents.
- Rows use **UUID keys**, `created_at`/`updated_at` timestamps and **soft deletes** (`deleted_at`), so cloud sync can be added later without migrating identities.
- Migrations run automatically on app start. A fresh install is seeded with HUF and three starter categories (Bills & Fixed, Transport, Misc) with a few tags.

## Design

The UI follows the "Midnight Glass" design: dark, frosted-glass cards over soft color glows. Tokens, interaction rules and per-screen mockups are in [`docs/design/`](docs/design/README.md). A light theme isn't designed yet.

## License

[MIT](LICENSE)
