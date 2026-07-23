# Shopsy

A Next.js e-commerce product browsing app with authentication, built with React, Redux Toolkit, and TypeScript.

## Features

- Browse a product catalog with grid layout and skeleton loading states
- View detailed product pages
- Login/logout with session persistence
- Route protection via auth guard
- Server-side API proxy to an external products source

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **State Management:** Redux Toolkit + React Redux
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Environment Variables

Create a `.env.local` file in the project root:

```env
PRODUCTS_API_URL=https://your-products-api.com
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to `/products`.

### Other Scripts

| Command            | Description                  |
|--------------------|------------------------------|
| `npm run build`    | Production build             |
| `npm run start`    | Start production server      |
| `npm run lint`     | Run ESLint                   |
| `npm run typecheck`| Type-check without emitting  |

## Project Structure

```
src/
├── app/                  # Next.js App Router (routes & layouts)
│   ├── api/products/     # Server route handlers proxying the products API
│   ├── login/            # Login route
│   └── products/         # Product listing and detail routes
├── components/
│   ├── layout/           # AppHeader, AppBootstrap
│   └── ui/               # Reusable UI blocks (StatusPanel, etc.)
├── features/
│   ├── auth/             # Auth slice, session storage, LoginPage, AuthGuard
│   └── products/         # Products slice, selectors, API client, product components
├── hooks/                # Typed Redux hooks
├── store/                # Redux store setup and StoreProvider
├── types/                # Shared TypeScript interfaces
└── utils/                # Pure helper functions and browser storage utilities
```
