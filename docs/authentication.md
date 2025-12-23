# Authentication

This document describes the authentication system implementation.

## Overview

The application uses JWT-based authentication with the backend API. Authentication state is managed client-side using localStorage and a custom React hook.

## Components

### AuthModal (`src/components/auth/auth-modal.tsx`)

A modal component that handles both login and registration flows.

**Features:**
- Toggle between login and registration views
- Form validation with error messages
- Loading states during API calls
- Animated transitions using Framer Motion

### ThemeToggle (`src/components/ui/theme-toggle.tsx`)

Theme switching component integrated into the header, allowing users to toggle between light and dark modes.

## Hooks

### useAuth (`src/hooks/use-auth.ts`)

The primary hook for managing authentication state.

```typescript
const { user, isAuthenticated, login, logout, loading } = useAuth();
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `user` | `UserRead \| null` | Current user data |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `login` | `function` | Login with email/password |
| `logout` | `function` | Clear auth state |
| `loading` | `boolean` | Initial auth check in progress |

**Token Storage:**
- Access token stored in `localStorage` under key `access_token`
- Token automatically included in API requests via `getAccessToken()`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/jwt/login` | POST | Login with credentials |
| `/auth/register` | POST | Create new account |
| `/users/me` | GET | Get current user profile |

## Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  AuthModal   │────▶│   useAuth    │────▶│  API Client  │
│  (UI)        │     │   (Hook)     │     │  (lib/api)   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ localStorage │
                     │ (JWT Token)  │
                     └──────────────┘
```

## Conversation Claiming

When a guest user generates a summary and then logs in, the conversation can be "claimed" to their account using the `useClaimConversation` hook.

```typescript
const { mutate: claimConversation } = useClaimConversation();
claimConversation(conversationId);
```
