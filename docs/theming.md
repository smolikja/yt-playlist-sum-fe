# Theming

This document describes the theme system implementation for light and dark modes.

## Overview

The application uses `next-themes` for theme management with Tailwind CSS class-based dark mode. Themes are controlled via CSS variables defined in `globals.css`.

## Configuration

### Tailwind Config

```typescript
// tailwind.config.ts
darkMode: ["class"]
```

### Theme Provider

```tsx
// src/providers/ThemeProvider.tsx
<NextThemesProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</NextThemesProvider>
```

## Color Palette

### Light Mode (`:root`)

| Variable | Value | Description |
|----------|-------|-------------|
| `--background` | `220 20% 98%` | Off-white with blue tint |
| `--foreground` | `220 20% 10%` | Dark blue-grey |
| `--card` | `0 0% 100%` | Pure white |
| `--primary` | `245 80% 55%` | Indigo |
| `--secondary` | `220 15% 92%` | Subtle blue-grey |
| `--muted` | `220 20% 95%` | Light grey |
| `--accent` | `240 80% 96%` | Light purple |
| `--border` | `220 15% 88%` | Light grey border |

### Dark Mode (`.dark`)

| Variable | Value | Description |
|----------|-------|-------------|
| `--background` | `0 0% 0%` | Pure black |
| `--foreground` | `210 40% 98%` | Off-white |
| `--card` | `0 0% 3.9%` | Near-black |
| `--primary` | `217.2 91.2% 59.8%` | Blue |
| `--secondary` | `217.2 32.6% 17.5%` | Dark blue |
| `--muted` | `217.2 32.6% 17.5%` | Dark muted |
| `--accent` | `217.2 32.6% 17.5%` | Dark accent |
| `--border` | `217.2 32.6% 17.5%` | Dark border |

## Components

### ThemeToggle (`src/components/ui/theme-toggle.tsx`)

A button component that toggles between light and dark themes.

**Behavior:**
1. On first visit: Uses system preference (`defaultTheme="system"`)
2. On toggle: Switches between `light` and `dark`
3. Icon changes based on current theme:
   - 🌙 Moon = Dark mode
   - ☀️ Sun = Light mode

**Implementation:**
```tsx
const { theme, setTheme, resolvedTheme } = useTheme();

const toggleTheme = () => {
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  setTheme(currentTheme === "dark" ? "light" : "dark");
};
```

## Usage in Components

Components use theme-aware classes following this pattern:

```tsx
// Light mode first, dark mode override
className="bg-background dark:bg-black/40"

// Using CSS variables
className="text-foreground"
className="border-border"
className="bg-muted"
```

## Responsive Theme Colors

For elements that need different colors per theme:

```tsx
// Gradients
className="bg-gradient-to-b from-slate-800 to-slate-500 dark:from-neutral-50 dark:to-neutral-400"

// Backgrounds with opacity
className="bg-card/80 dark:bg-neutral-900/50"
```

## Persistence

Theme preference is automatically persisted in `localStorage` by `next-themes` and restored on subsequent visits.
