# GEMINI.md - Project Context

This file provides context and instructions for Gemini CLI when working on the **fb-clone** project.

## Project Overview

**fb-clone** is a full-stack social media application (Facebook clone) built with a decoupled architecture. It features a robust Spring Boot backend and a modern Next.js frontend.

### Main Technologies

**Frontend:**
- **Framework:** Next.js 16.2.2 (App Router) + React 19
- **State Management:** Redux Toolkit (client-side) & TanStack Query v5 (server-side)
- **Styling:** Tailwind CSS v4 + Global CSS variables (Material Design 3 system)
- **UI Components:** shadcn/ui (lucide icons)
- **Networking:** Axios with request/response interceptors for JWT handling

**Backend:**
- **Framework:** Spring Boot 3.4.2 (Java 21)
- **Security:** Spring Security + JWT (jjwt 0.12.5)
- **Database:** PostgreSQL (hosted on Neon) with Spring Data JPA
- **Storage:** Supabase (presigned URL pattern for direct uploads)
- **Utilities:** Lombok, Spring WebFlux (WebClient)

---

## Building and Running

### Prerequisites
- Java 21+
- Node.js 20+
- PostgreSQL (Neon) & Supabase accounts (for production-like dev)

### Backend (`backend/`)
```bash
cd backend
./mvnw spring-boot:run        # Runs dev server at http://localhost:8080
./mvnw clean package          # Builds JAR
./mvnw test                   # Runs tests
```

### Frontend (`frontend/`)
```bash
cd frontend
npm run dev                   # Runs dev server at http://localhost:3000
npm run build                 # Production build
npm run lint                  # ESLint checks
```

### Environment Setup
- **Frontend:** Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
- **Backend:** Configure `backend/.env` or update `application.yml` with `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and Supabase credentials.

---

## Architecture & Conventions

### API Communication
- All frontend API calls MUST use the centralized service layer in `frontend/src/services/api/`.
- Use `axiosClient` (configured in `src/lib/axiosClient.ts`) which handles JWT injection and 401 redirects.
- Backend APIs are prefixed with `/api/v1/`.

### State Management
- **Server State:** Use TanStack Query hooks (e.g., `useQuery`, `useMutation`). Avoid `useEffect` for data fetching.
- **Client State:** Use Redux Toolkit for UI state (sidebars, theme) and basic auth info.

### Authentication Flow
1. Login/Register returns a JWT.
2. Token is stored in `localStorage` (`fb_clone_token`).
3. Interceptors inject `Authorization: Bearer <token>` into all requests.
4. `AuthGuard` component protects routes in the `(main)` route group.

### Error Handling
- **Global Exception Handler:** The backend uses `@RestControllerAdvice` in `com.fbclone.exception.GlobalExceptionHandler` to unify error responses.
- **Unified Format:** All errors return a consistent JSON structure (`ErrorResponse.java`): `{ "message": "...", "status": 4xx/5xx, "timestamp": "...", "path": "..." }`.
- **Custom Exceptions:** Use specific exceptions for different scenarios:
    - `NotFoundException`: Returns HTTP 404.
    - `BadRequestException`: Returns HTTP 400.
    - `UnauthorizedException`: Returns HTTP 401.
- **Service Standard:** Do NOT use complex `if-else` or `try-catch` in Controllers for error handling. Throw custom exceptions in the Service layer, and let the Global Handler catch them.

### Development Standards
- **Strict TypeScript:** No `any` types; define explicit interfaces in `types/index.ts`.
- **CSS:** Use Tailwind v4 classes and existing CSS variables for consistency.
- **Backend:** Use DTOs for request/response mapping; avoid exposing JPA Entities directly in controllers.
- **Testing:** Add tests for new features (Playwright for FE, Spring Boot Test for BE).

---

## Key Directories

### Frontend (`frontend/src/`)
- `app/`: Next.js App Router (Auth vs Main route groups).
- `components/shared/`: Reusable components (Navbar, PostCard).
- `services/api/`: Service layer for all backend interactions.
- `hooks/`: Custom business logic hooks (e.g., `useAuth`, `useFeed`).

### Backend (`backend/src/main/java/com/fbclone/`)
- `config/`: Security, JWT, and Cloud Storage configurations.
- `controller/`: REST endpoints for Auth, Posts, and Storage.
- `dto/`: Data Transfer Objects for API contracts.
- `service/`: Core business logic implementation.
