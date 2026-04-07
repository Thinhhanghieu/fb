# CLAUDE.md

This file provides guidance to Claude Opus (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Framework**: Next.js 16.2.2 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + Global CSS variables (Material Design 3-inspired surface system), SCSS available
- **UI Components**: shadcn/ui (style: base-nova, iconLibrary: lucide)
- **Fonts**: Plus Jakarta Sans (headings/display), Be Vietnam Pro (body)
- **State**: Redux Toolkit (global/client state) + TanStack Query v5 (server state)
- **HTTP**: Axios with interceptors (`src/lib/axiosClient.ts`)
- **Date handling**: date-fns
- **Animations**: tw-animate-css

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/app/                    # Next.js App Router pages
  (auth)/                   # Route group: auth pages (login, register)
  (main)/                   # Route group: authenticated pages (feed, profile, etc.)
  layout.tsx                # Root layout with Providers, fonts, metadata
  page.tsx                  # Redirects to /login
src/components/
  providers/Providers.tsx   # Redux + React Query providers (client component)
  shared/                   # Shared UI components (Navbar, Avatar, PostCard, etc.)
  ui/                       # shadcn/ui components (button, skeleton, etc.)
src/lib/
  axiosClient.ts            # Axios instance with auth interceptors
  utils.ts                  # cn() utility (clsx + tailwind-merge)
src/store/                  # Redux store + slices (uiSlice for theme/sidebar)
src/hooks/                  # Custom hooks (useAppDispatch, etc.)
src/constants/              # Routes, API endpoints, query keys
src/types/                  # TypeScript interfaces (User, Post, Comment, etc.)
```

## Architecture Notes

- **Route groups**: `(auth)/` for public pages (no navbar), `(main)/` for authenticated pages (with Navbar)
- **API backend**: Not yet implemented. Axios client points to `http://localhost:3001/api` via `NEXT_PUBLIC_API_URL`
- **Auth**: Token stored in `localStorage`, injected via Axios request interceptor. 401 responses trigger redirect to `/login`
- **Data models**: Defined in `src/types/` — User, Post, Comment, Notification, Message, Conversation
- **Query keys and API endpoints**: Centralized in `src/constants/`
- **shadcn/ui**: Use `npx shadcn@latest add <component>` to add new components. Path aliases: `@/components`, `@/ui`, `@/lib`, `@/hooks`
- **Theme**: CSS variables in `globals.css` — light mode (--background: #f7f9fc) and dark mode supported via `.dark` class. Primary: #0058bc
- **No `useEffect` for data fetching**: Use TanStack Query hooks instead
- **No `any` types**: Define explicit interfaces for API requests/responses

## Key Files

- `src/app/globals.css` — Global styles, CSS variables, Tailwind theme, fonts
- `src/components/providers/Providers.tsx` — Client-side providers (Redux + TanStack Query)
- `src/app/layout.tsx` — Root layout with Google Fonts, metadata
- `src/constants/index.ts` — All routes, API endpoints, query keys
- `src/lib/axiosClient.ts` — Axios instance with auth interceptors
