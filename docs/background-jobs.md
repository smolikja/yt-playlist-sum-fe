# Background Jobs

This document describes the background job processing system for async playlist summarization.

## Overview

The application uses a dual-mode summarization system:

| User Type | Mode | Behavior |
|-----------|------|----------|
| **Unauthenticated** | Sync | Immediate response (max 100s timeout) |
| **Authenticated** | Async | Background job with polling |

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User        │────▶│  /summarize  │────▶│  Response    │
│  submits URL │     │  endpoint    │     │  mode check  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                     ┌───────────────────────────┼───────────────────────────┐
                     │                           │                           │
                     ▼                           ▼                           │
              ┌─────────────┐           ┌─────────────────┐                  │
              │ SYNC MODE   │           │ ASYNC MODE      │                  │
              │ (no token)  │           │ (with token)    │                  │
              │             │           │                 │                  │
              │ Immediate   │           │ Job created     │                  │
              │ summary     │           │ Poll for status │                  │
              │ returned    │           │ Claim when done │                  │
              └─────────────┘           └─────────────────┘                  │
```

## Components

### JobStatusIndicator (`src/components/jobs/JobStatusIndicator.tsx`)

Animated status icons using Framer Motion:
- `pending` - Pulsing clock icon (amber)
- `running` - Spinning loader (indigo)
- `completed` - Checkmark with glow (emerald)
- `failed` - X icon (red)

### JobCard (`src/components/jobs/JobCard.tsx`)

Full-detail job card displaying:
- Status indicator
- Playlist URL (truncated, clickable)
- Creation time (relative)
- Action buttons based on status

### JobsBanner (`src/components/jobs/JobsBanner.tsx`)

Collapsible floating banner shown in HeroSection:
- Status badges with counts
- List of JobCard components
- Expand/collapse toggle
- Max height with scroll

## Hooks

### useJobs (`src/hooks/use-jobs.ts`)

Manages all user jobs with React Query.

```typescript
const { 
  jobs,           // All jobs
  activeJobs,     // pending + running
  completedJobs,  // completed
  failedJobs,     // failed
  claimJob,       // Claim completed job
  retryJob,       // Retry failed job
  deleteJob,      // Delete/cancel job
} = useJobs();
```

### useJobPolling (`src/hooks/use-job-polling.ts`)

Polls a specific job status every 5 seconds.

```typescript
useJobPolling(jobId, {
  onComplete: (job) => { /* Navigate to conversation */ },
  onFailed: (job) => { /* Show error */ },
  onStatusChange: (job) => { /* Update UI */ },
});
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `POST /summarize` | POST | Create job (auth) or get sync result |
| `GET /jobs` | GET | List all user jobs |
| `GET /jobs/{id}` | GET | Get job status (polling) |
| `POST /jobs/{id}/claim` | POST | Claim completed job → conversation |
| `POST /jobs/{id}/retry` | POST | Retry failed job |
| `DELETE /jobs/{id}` | DELETE | Cancel/delete job |

## Error Handling

| HTTP Status | Error Class | User Message |
|-------------|-------------|--------------|
| 408 | `PublicTimeoutError` | Auth modal with timeout explanation |
| 429 | `JobLimitError` | Toast: "Max 3 concurrent jobs" |

## Configuration

```typescript
// src/lib/constants.ts
export const JOB_CONFIG = {
  POLL_INTERVAL_MS: 5000,      // 5 seconds
  MAX_CONCURRENT_JOBS: 3,
  EXPIRY_DAYS: 3,
};
```

## Translations

Job-related translations are in the `jobs` namespace:

```json
{
  "jobs": {
    "banner": { "title": "Active Tasks", ... },
    "status": { "pending": "Waiting in queue...", ... },
    "actions": { "view": "View Result", ... },
    "errors": { "timeout": "...", "limit": "..." }
  }
}
```
