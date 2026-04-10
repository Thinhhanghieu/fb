# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

**Frontend:**
- Next.js 16.2.2 (App Router) + React 19
- TypeScript (strict mode)
- Tailwind CSS v4 + Global CSS variables (Material Design 3-inspired surface system)
- shadcn/ui (style: base-nova, iconLibrary: lucide)
- Fonts: Plus Jakarta Sans (headings), Be Vietnam Pro (body)
- Redux Toolkit (global/client state) + TanStack Query v5 (server state)
- Axios with interceptors (`src/lib/axiosClient.ts`)
- date-fns, tw-animate-css, SCSS available

**Backend:**
- Spring Boot 3.4.2 (Java 21)
- Spring Security + JWT authentication (jjwt 0.12.5)
- Spring Data JPA + PostgreSQL (Neon)
- Spring WebFlux WebClient for Supabase integration
- Lombok

**Infrastructure:**
- Supabase (Storage bucket with presigned URL upload pattern)
- AWS S3-style presigned URLs: backend generates URL → frontend uploads directly → returns public URL

## Commands

### Frontend (`frontend/`)

```bash
cd frontend
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Production server
npm run lint      # ESLint
```

### Backend (`backend/`)

```bash
cd backend
# Using Maven wrapper
./mvnw spring-boot:run        # Dev server at http://localhost:8080
./mvnw clean package          # Build JAR
./mvnw test                   # Run tests
```

### Environment Variables

Frontend (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Backend (`backend/.env` or `application.yml` defaults):
```
DB_URL, DB_USERNAME, DB_PASSWORD        # Neon PostgreSQL
JWT_SECRET, JWT_EXPIRATION_MS           # JWT config
CORS_ALLOWED_ORIGINS=http://localhost:3000
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

## Project Structure

### Frontend (`frontend/src/`)

```
app/                    # Next.js App Router
  (auth)/              # Route group: login, register (no Navbar)
  (main)/              # Route group: authenticated pages (with Navbar)
  layout.tsx          # Root layout with Providers, fonts
  page.tsx            # Redirects to /login
  globals.css         # Tailwind v4 theme, CSS variables, dark mode

components/
  providers/Providers.tsx   # Redux + TanStack Query + AuthInitializer
  shared/                   # App components (Navbar, PostCard, Avatar, etc.)
  ui/                       # shadcn/ui primitives (button, skeleton)

lib/
  axiosClient.ts            # Axios instance with auth interceptors
  supabase.ts               # Supabase file upload (presigned URL pattern)
  utils.ts                  # cn() utility

services/api/               # API service layer (use these, not raw axios)
  auth.api.ts, posts.api.ts, users.api.ts
  notifications.api.ts, messages.api.ts, storage.api.ts

store/                      # Redux Toolkit
  index.ts                 # Store config
  slices/authSlice.ts       # Current user state
  slices/uiSlice.ts         # Theme/sidebar state

hooks/                       # Custom hooks
  useAppDispatch.ts         # Typed dispatch
  useAuth.ts                # Auth helpers
  useCreatePost.ts           # Post creation logic
  useFeed.ts                # Feed data fetching

constants/index.ts           # Routes, API endpoints, query keys
types/index.ts               # TypeScript interfaces (User, Post, Comment, etc.)
```

### Backend (`backend/src/main/java/com/fbclone/`)

```
config/
  SecurityConfig.java      # CORS, security filter chain
  JwtAuthFilter.java       # JWT token extraction from requests
  JwtProvider.java         # Token generation/validation
  CustomUserDetailsService.java
  StorageConfig.java       # Supabase S3 client config

controller/
  AuthController.java      # /api/v1/auth/*
  PostController.java     # /api/v1/posts/* (paginated feed, create)
  StorageController.java   # /api/v1/storage/* (presigned URLs)

dto/                        # Request/Response DTOs
  AuthRequest, AuthResponse, UserResponse
  CreatePostRequest, PostResponse, PaginatedResponse
  RegisterRequest, UploadResponse

entity/
  User.java, Post.java     # JPA entities

repository/
  UserRepository.java, PostRepository.java

service/
  AuthService.java, PostService.java, StorageService.java
```

## Architecture Notes

### API Communication Pattern

- All frontend API calls go through `services/api/*.api.ts` → `axiosClient` → `http://localhost:8080/api`
- Backend API prefix: `/api/v1/...` (auth, posts, users, notifications, messages, storage)
- File upload: `POST /api/v1/storage/presigned-url` → get presigned URL → upload to Supabase → return public URL to backend

### Auth Flow

1. Login/register → `POST /api/v1/auth/login` → JWT token returned
2. Token stored in `localStorage` via `tokenStorage`
3. Every Axios request injects `Authorization: Bearer <token>` via request interceptor
4. 401 responses → token cleared, redirect to `/login`
5. `AuthInitializer` component (in Providers) hydrates Redux user from `/api/v1/auth/me` on mount

### Route Groups

- `(auth)/` — public pages, no Navbar, no AuthGuard
- `(main)/` — authenticated pages, wrapped in `AuthGuard`, has `Navbar`
- AuthGuard checks Redux `auth.currentUser`; redirects to `/login` if null

### Theme System

CSS variables in `globals.css`:
- Light mode: `--background: #f7f9fc`, `--primary: #0058bc`, surface system
- Dark mode: `.dark` class overrides (blue tones flip, surfaces darken)
- Primary color inverts between light (dark blue) and dark (light blue) mode

### Key Conventions

- **No `useEffect` for data fetching** — use TanStack Query hooks instead
- **No `any` types** — define explicit interfaces for all API shapes
- **shadcn/ui**: `npx shadcn@latest add <component>`. Path aliases: `@/components`, `@/ui`, `@/lib`, `@/hooks`
- **TanStack Query keys and API endpoints**: centralized in `src/constants/`
- **Axios base URL**: `NEXT_PUBLIC_API_URL` env var (defaults to `http://localhost:8080/api`)
