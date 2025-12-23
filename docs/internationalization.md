# Internationalization (i18n)

This document describes the internationalization implementation using `next-intl`.

## Overview

The application supports multiple languages using locale-based routing. Currently supported locales:
- **English** (`en`) - Default
- **Czech** (`cs`)

## Configuration

### Routing (`src/i18n/routing.ts`)

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'cs'],
  defaultLocale: 'en'
});
```

### Middleware

The middleware handles locale detection and routing:
- Detects user's preferred language from browser
- Redirects to appropriate locale path
- Persists locale preference

## File Structure

```
messages/
├── en.json    # English translations
└── cs.json    # Czech translations

src/i18n/
├── routing.ts      # Routing configuration
├── request.ts      # Request-time config
└── navigation.ts   # Navigation helpers
```

## Translation Keys

Translations are organized by feature:

```json
{
  "hero": {
    "title": "YouTube Playlist Summarizer",
    "description": "...",
    "button": "Summarize Playlist"
  },
  "header": {
    "newSummary": "New Summary",
    "signIn": "Sign In"
  },
  "chat": {
    "fastModeOn": "Fast Mode On",
    "deepModeOn": "Deep Mode On"
  },
  "theme": {
    "dark": "Dark mode",
    "light": "Light mode"
  }
}
```

## Usage in Components

### Client Components

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('hero');
  return <h1>{t('title')}</h1>;
}
```

### With Parameters

```tsx
const t = useTranslations('time');
// messages: { "minutesAgo": "{count} min ago" }
t('minutesAgo', { count: 5 }); // "5 min ago"
```

### Multiple Namespaces

```tsx
function Component() {
  const tHero = useTranslations('hero');
  const tAuth = useTranslations('auth');
  
  return (
    <>
      <h1>{tHero('title')}</h1>
      <button>{tAuth('signIn')}</button>
    </>
  );
}
```

## URL Structure

```
/en          → English version
/cs          → Czech version
/en/...      → English with path
/cs/...      → Czech with path
```

## Adding New Translations

1. Add key to `messages/en.json`
2. Add translated key to `messages/cs.json`
3. Use in component with `useTranslations()`

Example:
```json
// messages/en.json
{ "newFeature": { "title": "New Feature" } }

// messages/cs.json
{ "newFeature": { "title": "Nová funkce" } }
```

## Language Switching

Language can be changed by navigating to the corresponding locale path. The middleware will handle the routing and persist the preference.
