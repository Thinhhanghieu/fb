---
name: fb-clone-fe
description: Frontend development guidelines for the fb-clone project using Next.js, React Query, Axios, and TypeScript.
---

# FB Clone Project Development Guide

## Project Structure (Monorepo)
- **Root:** Chứa các cấu hình chung và npm workspaces (`package.json` với `workspaces: ["frontend", "backend"]`).
- **`frontend/`:** Chứa mã nguồn Next.js (App Router). Chạy bằng `npm run dev:frontend` từ root.
- **`backend/`:** Chứa mã nguồn Backend (đang trong quá trình chuẩn bị).

---

## Tech Stack (Frontend)
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + CSS Variables (`globals.css`)
- **UI Library:** Shadcn/UI (base-ui primitives)
- **Data Fetching:** React Query (`@tanstack/react-query`)
- **HTTP Client:** Axios (via `lib/httpClient.ts` — centralized instance)
- **Global State:** Redux Toolkit (`store/index.ts`)

---

## Design System (Digital Curator / Stitch)
- **Primary color:** `#0058bc` (gradient: `linear-gradient(135deg, #0058bc, #0070eb)`)
- **Fonts:** `Plus Jakarta Sans` (headings) + `Be Vietnam Pro` (body)
- **Radius:** `1rem` base (use `rounded-2xl`, `rounded-3xl` for cards)
- **Shadows:** Premium shadow = `0 12px 32px rgba(0, 88, 188, 0.08)`
- **CSS Var:** `--shadow-premium`, `--gradient-primary`, `--surface-container-low`, `--surface-container-lowest`
- **No-Line Rule:** KHÔNG dùng `border: 1px solid`. Thay bằng tonal layering (background color shifts).
- **Glassmorphism:** Navbar sử dụng `backdrop-blur-2xl + rgba(247,249,252,0.7)` (không có border).

---

## Component Architecture

### Shared Components (`frontend/src/components/shared/`)
| Component | Dùng khi | Variants |
|---|---|---|
| `AppButton` | Mọi button trong app | `primary` (gradient), `secondary`, `ghost`, `danger`, `icon` |
| `AppInput` | Input có label + icon (form fields) | Standard, `passwordToggle` |  
| `SearchInput` | Thanh tìm kiếm ở Navbar, Marketplace, Groups, Video, Messages | — |
| `SectionCard` | Wrapper card với premium shadow | `noPadding`, `elevation` |
| `PageHeader` | Tiêu đề + subtitle của các trang (main) | `actions` prop |
| `Avatar` | Hiển thị ảnh đại diện | Sizes: `sm`, `md`, `lg`, `xl` |
| `PostCard` | Thẻ bài viết | `PostCardSkeleton` |
| `CreatePost` | Box tạo bài viết | — |
| `Navbar` | Navigation chính | — |
| `Sidebars` | Hai sidebar của Feed | `LeftSidebar`, `RightSidebar` |
| `StoryBar` | Thanh story | — |

> **Quy tắc:** KHÔNG tự viết inline `style` cho button hay card. Luôn dùng `AppButton` / `SectionCard`.

---

## HTTP Client & Services

### `lib/httpClient.ts`
Instance Axios duy nhất. Bao gồm:
- Request interceptor: tự inject `Authorization: Bearer <token>` từ localStorage
- Response interceptor: xử lý `401` (redirect login) và `403` (log warning)
- `tokenStorage` helper (SSR-safe): `get()`, `set()`, `remove()`

### Services (`frontend/src/services/api/`)
| File | Methods |
|---|---|
| `auth.api.ts` | `login`, `register`, `getMe`, `logout` |
| `posts.api.ts` | `getFeed`, `getById`, `create`, `toggleLike`, `getComments`, `delete` |
| `users.api.ts` | `getProfile`, `getFriends`, `updateProfile`, `sendFriendRequest` |
| `notifications.api.ts` | `getAll`, `markAsRead`, `markAllAsRead` |
| `messages.api.ts` | `getConversations`, `getMessages`, `sendMessage` |

> **Import:** Luôn import từ barrel `@/services/api` (không import trực tiếp từ file service).

```ts
import { authApi, postsApi } from '@/services/api';
```

---

## Custom Hooks

- Viết hook trong `frontend/src/hooks/` với tên `use{Feature}` (e.g., `usePosts`, `useAuth`).
- Dùng TanStack Query cho mọi server state. KHÔNG dùng `useEffect` để fetch.
- Mỗi hook wrap một API service method tương ứng.

```ts
// Ví dụ pattern chuẩn:
export function useFeed(page = 1) {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, page],
    queryFn: () => postsApi.getFeed(page),
  });
}
```

---

## Constants Management
- Routes: `constants/index.ts` → `ROUTES.*`
- API endpoints: `constants/index.ts` → `API_ENDPOINTS.*`
- Query keys: `constants/index.ts` → `QUERY_KEYS.*`
- Mock data: `constants/mockData.ts` → dùng trong giai đoạn chưa có BE

---

## TypeScript Rules
- **No `any`**. Dùng `unknown` nếu cần và cast rõ ràng.
- Types domain nằm ở `frontend/src/types/index.ts`.
- Props, API response đều phải có explicit interfaces.

---

## Pages hiện có (Cấu trúc App Router)
```
app/
  (auth)/
    login/page.tsx
    register/page.tsx
  (main)/
    layout.tsx         ← Navbar + padding
    feed/page.tsx
    profile/page.tsx
    notifications/page.tsx
    messages/page.tsx
    settings/page.tsx
    marketplace/page.tsx
    groups/page.tsx
    video/page.tsx
```
