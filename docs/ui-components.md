# UI Components

This document describes the reusable UI components in the application.

## Overview

The application uses a combination of custom components and Radix UI primitives, styled with Tailwind CSS and enhanced with Framer Motion animations.

## Core Components

### Button (`src/components/ui/button.tsx`)

A versatile button component using `class-variance-authority` for variants.

**Variants:**
| Variant | Description |
|---------|-------------|
| `default` | Primary button with solid background |
| `destructive` | Red button for dangerous actions |
| `outline` | Bordered button |
| `secondary` | Muted background |
| `ghost` | Transparent, hover effect only |
| `link` | Styled as a link |

**Sizes:** `default`, `sm`, `lg`, `icon`

```tsx
<Button variant="default" size="lg">
  Click me
</Button>
```

### MagicButton (`src/components/ui/magic-button.tsx`)

An animated button with a rotating gradient border.

**Features:**
- Conic gradient animation
- Icon support (left/right position)
- Theme-aware colors

```tsx
<MagicButton 
  title="Summarize" 
  icon={<Sparkles />} 
  position="left"
/>
```

### InputWithGlow (`src/components/ui/input-with-glow.tsx`)

A text input with animated glow effect on focus.

**Features:**
- Gradient glow animation
- Theme-aware colors
- Forwarded ref support

### BorderBeam (`src/components/ui/border-beam.tsx`)

An animated beam that travels around a container's border.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | 200 | Beam size |
| `duration` | `number` | 15 | Animation duration (seconds) |
| `delay` | `number` | 0 | Animation delay |

### Spotlight (`src/components/ui/spotlight.tsx`)

A decorative spotlight effect for backgrounds.

```tsx
<Spotlight
  className="-top-40 left-0 md:left-60"
  fill="white"
/>
```

## Dialog Components

### Sheet (`src/components/ui/sheet.tsx`)

A slide-in drawer component for mobile navigation.

**Features:**
- Linear slide animation
- Backdrop blur
- Body scroll lock

### AlertDialog (Radix UI)

Used for confirmation dialogs (e.g., delete conversation).

## Tooltip (`src/components/ui/tooltip.tsx`)

Radix UI tooltip with custom styling.

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Job Components (`src/components/jobs/`)

Components for background job management.

### JobStatusIndicator

Animated status icon using Framer Motion.

| Status | Icon | Color | Animation |
|--------|------|-------|-----------|
| `pending` | Clock | Amber | Pulsing |
| `running` | Loader | Indigo | Spinning |
| `completed` | CheckCircle | Emerald | Spring pop |
| `failed` | XCircle | Red | Spring pop |

```tsx
<JobStatusIndicator status="running" size="md" />
```

### JobCard

Full-detail job card with status, URL, time, and action buttons.

### JobsBanner

Collapsible floating banner containing JobCards. Shows status badges with counts.

## Animation Patterns

### Entry Animations

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

### Exit Animations

```tsx
<AnimatePresence mode="wait">
  {condition && (
    <motion.div
      exit={{ opacity: 0, y: 20 }}
    >
```

### Layout Animations

```tsx
<motion.div layout>
  {/* Content that changes size */}
</motion.div>
```

## Utility Functions

### cn (`src/lib/utils.ts`)

Combines class names with Tailwind merge support:

```typescript
import { cn } from "@/lib/utils";

className={cn(
  "base-class",
  condition && "conditional-class",
  className
)}
```
