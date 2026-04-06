---
name: fb-clone-fe
description: Frontend development guidelines for the fb-clone project using Next.js, React Query, Axios, and TypeScript.
---

# FB Clone Frontend Development Guide

## Tech Stack
- **Framework:** Next.js (App Router or Pages Router, let user decide when initializing)
- **Language:** TypeScript
- **Styling:** SCSS (Global SCSS for theme/variables) + Tailwind CSS (recommended: shadcn/ui). Must support robust Theme Setup.
- **Data Fetching & State Management:** Redux (for client/global state) + React Query (TanStack Query for server state).
- **HTTP Client:** Axios
- **Architecture Strategy:** Component-driven design, extremely reusable components, centralized constants, custom React hooks.
- **Backend:** Will be implemented later. Focus on defining clear contracts/interfaces and mocking data if necessary.

## Core Guidelines

### 1. Component Architecture
- **Modularity:** Build UI components in a modular and heavily reusable way. Avoid hardcoding specific logic in generic components. Group components in `components/` or `src/components/`. All components MUST be designed for maximum reusability across screens.
- **Styling & Theme:** Use Global `SCSS` (e.g., `globals.scss`) to establish the baseline theme configuration (CSS variables, root layout). Combine with `Tailwind CSS` and `shadcn/ui` for rapid composition.
- **Separation of Concerns:** Separate presentational (dumb) components from container (smart/data-fetching) components.
- **Design System:** Rely on the `stitch` MCP design (Primary Color `#0058bc`, Fonts: `Plus Jakarta Sans`, `Be Vietnam Pro`) to ensure visual fidelity aligned with a "Curator/Editorial" theme.

### 2. Custom Hooks
- Extract complex component logic and data fetching hooks into a `hooks/` or `src/hooks/` directory.
- Name all custom hooks starting with `use` (e.g., `usePosts`, `useUser`).
- Handle loading, error, and caching scenarios cleanly using React Query.

### 3. Data Fetching Strategy
- **Axios Configuration:** Maintain a centralized Axios configured instance (e.g., in `utils/axiosClient.ts` or `lib/axios.ts`) instead of using raw `axios` calls directly, to easily inject interceptors for headers/auth later.
- **React Query:** Enforce using `@tanstack/react-query` for server side state (caching, deduplication, background updates).
- **No `useEffect` for Fetching:** Strictly avoid `useEffect` fetching patterns in favor of TanStack Query.

### 4. TypeScript (Strict Typing)
- **No `any`:** Avoid `any` types. Define clear interfaces/types for expected API requests, API responses, and Component Props.
- **Centralized Types:** Keep shared data models (e.g., `Post`, `User`, `Comment`) in a `types/` or `src/types/` folder.

### 5. Constants Management
- **Centralized Constants:** All application constants (magic strings, config values, route paths, API enum values, UI text) must be defined in a `constants/` or `src/constants/` directory.
- Avoid hardcoding values directly into components or hooks.

### 6. Iteration over Backend Readiness
- Since the BE is built later, build the React Query hooks so they can seamlessly point to the actual backend endpoints later. In the initial phase, build out UI using the Stitch Design layout and mock data if needed to check the UI.
