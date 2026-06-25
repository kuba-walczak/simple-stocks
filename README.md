# Simple Stocks

A personal stock tracking app available in two versions — a **web app** built with Next.js and a **native mobile app** built with React Native (Expo). Both share the same Supabase backend and Finnhub data source, giving users the same experience across platforms.

## ✨ Features

- **Authentication** - Email/password sign-in and sign-up via Supabase Auth, with session management on both platforms
- **Stock Search & Tracking** - Search any stock by symbol using the Finnhub API. Tracked stocks are saved per-user in Supabase
- **Live Price Data** - Each stock card displays the current price, daily change, and day high/low
- **Follow Stocks** - Mark individual stocks as "followed" to separate your watchlist from your full tracked list

## 🛠 Tech Stack

### Web (`/web`)
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**

### Mobile (`/mobile`)
- **React Native** + **Expo** (with Expo Router)
- **NativeWind** for Tailwind-style styling

### Shared
- **Supabase** - Auth and Postgres database for per-user stock and following lists
- **Finnhub API** (`react-finnhub`) - Real-time stock quotes and symbol search
- **Lucide** for icons

## 🎬 Showcase