# Architecture Overview

This document provides a high-level overview of the YouTube Playlist Summarizer frontend architecture.

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **TanStack Query** | Server state management |
| **Framer Motion** | Animations |
| **next-intl** | Internationalization |
| **next-themes** | Theme management |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Locale-based routing
│   │   ├── layout.tsx      # Root layout with providers
│   │   └── page.tsx        # Main application page
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── auth/               # Authentication components
│   ├── chat/               # Chat interface components
│   ├── home/               # Home page components
│   └── ui/                 # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API client, types
├── providers/              # React context providers
└── i18n/                   # Internationalization config
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  Hooks  │───▶│ TanStack     │───▶│ API Client       │   │
│  │         │    │ Query        │    │ (lib/api.ts)     │   │
│  └─────────┘    └──────────────┘    └──────────────────┘   │
│       │                                      │              │
│       ▼                                      ▼              │
│  ┌─────────────┐                    ┌──────────────────┐   │
│  │ Components  │                    │ Backend API      │   │
│  └─────────────┘                    └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Key Patterns

### 1. Custom Hooks for Business Logic
All business logic is encapsulated in custom hooks (`src/hooks/`), keeping components focused on presentation.

### 2. CSS Variables for Theming
Theme colors are defined as CSS variables in `globals.css`, enabling seamless light/dark mode switching.

### 3. Locale-based Routing
The app uses `[locale]` dynamic segment for internationalization, supporting English and Czech.

### 4. Optimistic Updates
TanStack Query is used for caching and optimistic updates where applicable.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
