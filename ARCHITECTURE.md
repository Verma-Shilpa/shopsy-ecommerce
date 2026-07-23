# Shopsy Architecture

Shopsy now follows the requested Next.js project layout: routes live in `src/app`, reusable React UI lives in `src/components`, feature-owned code lives in `src/features`, global hooks live in `src/hooks`, Redux setup lives in `src/store`, pure helpers live in `src/utils`, and shared TypeScript contracts live in `src/types`.

## Folder Map

```text
shopsy/
├── .env.local              # Local environment variables
├── public/                 # Static assets directly served by Next.js
│   └── images/
├── src/
│   ├── app/                # NEXT.JS CORE: File-system routing and layouts
│   │   ├── layout.tsx      # Global root layout with providers/header
│   │   ├── page.tsx        # Homepage route, redirects to /products
│   │   ├── api/
│   │   │   └── products/   # Server route handlers that proxy the products API
│   │   ├── login/
│   │   │   └── page.tsx    # Login route
│   │   └── products/
│   │       ├── page.tsx    # Product listing route
│   │       └── [id]/
│   │           └── page.tsx # Product details dynamic route
│   ├── components/         # REACT CORE: Reusable global UI elements
│   │   ├── layout/         # Shared layout elements
│   │   └── ui/             # Atomic/reusable UI blocks
│   ├── features/           # Modular domain-specific logic
│   │   ├── auth/
│   │   │   ├── components/ # Auth-only components
│   │   │   ├── authSlice.ts
│   │   │   └── sessionStorage.ts
│   │   └── products/
│   │       ├── api/        # Product API client
│   │       ├── components/ # Product-only components
│   │       ├── productsSlice.ts
│   │       ├── productsSelectors.ts
│   │       └── productPreferencesStorage.ts
│   ├── hooks/              # Global reusable client-side React hooks
│   ├── store/              # Redux store, provider, and typed app state setup
│   ├── utils/              # Pure helper functions and browser utilities
│   └── types/              # Global TypeScript interfaces and definitions
```

## Conventions

- Keep `src/app` route files small; they should compose feature screens, not hold business logic.
- Put global reusable UI in `src/components`.
- Put feature-specific UI and state logic inside that feature folder.
- Put pure helpers in `src/utils`.
- Put Redux store/provider setup in `src/store`.
- Put external API base URLs in `.env.local`; route handlers read them server-side and client code calls local `/api/*` routes.
- Put shared TypeScript contracts in `src/types`.
