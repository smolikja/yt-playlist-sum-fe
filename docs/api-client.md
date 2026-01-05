# API Client

This document describes the API client implementation and patterns.

## Overview

The API client (`src/lib/api.ts`) provides a centralized interface for all backend communication. It handles authentication, error handling, and type-safe request/response handling.

## Configuration

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

## Core Functions

### makeRequest

A generic function for making typed API requests.

```typescript
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T>
```

**Features:**
- Automatic token injection
- JSON content-type headers
- RFC 7807 Problem Details error handling
- Type-safe responses

### Authentication Helpers

```typescript
// Get stored access token
getAccessToken(): string | null

// Store access token
setAccessToken(token: string): void

// Clear access token  
clearAccessToken(): void
```

## API Endpoints

### Authentication

```typescript
// Login
login(email: string, password: string): Promise<BearerResponse>

// Register
register(data: UserCreate): Promise<UserRead>

// Get current user
getCurrentUser(): Promise<UserRead>
```

### Summarization

```typescript
// Generate playlist summary (dual-mode)
summarizePlaylist(url: string): Promise<SummarizeResponse>

// Response is a discriminated union:
// - { mode: 'sync', summary: SummaryResult }  (unauthenticated)
// - { mode: 'async', job: JobResponse }       (authenticated)
```

### Jobs (Authenticated Users)

```typescript
// List all user jobs
getJobs(): Promise<JobResponse[]>

// Get single job status (for polling)
getJob(jobId: string): Promise<JobResponse>

// Claim completed job → returns conversation
claimJob(jobId: string): Promise<JobClaimResponse>

// Retry failed job
retryJob(jobId: string): Promise<JobResponse>

// Delete/cancel job
deleteJob(jobId: string): Promise<void>
```

### Conversations

```typescript
// List user conversations
getConversations(): Promise<ConversationResponse[]>

// Get conversation details
getConversation(id: string): Promise<ConversationDetailResponse>

// Delete conversation
deleteConversation(id: string): Promise<void>

// Claim guest conversation
claimConversation(id: string): Promise<void>
```

### Chat

```typescript
// Send chat message
sendMessage(request: ChatRequest): Promise<ChatResponse>
```

## Error Handling

### ApiError Class

```typescript
class ApiError extends Error {
  status: number;
  isRateLimited: boolean;
  retryAfter?: number;
  problemDetails?: ProblemDetails;
}
```

### RFC 7807 Problem Details

The API uses RFC 7807 format for error responses:

```typescript
interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}
```

## TanStack Query Integration

API functions are used with TanStack Query for caching and state management:

```typescript
// Query hook example
const { data, isLoading } = useQuery({
  queryKey: queryKeys.conversations.list(),
  queryFn: getConversations,
});

// Mutation hook example
const { mutate } = useMutation({
  mutationFn: (url: string) => summarizePlaylist(url),
  onSuccess: (data) => {
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.conversations.list() 
    });
  },
});
```

## Query Keys

Centralized query keys for cache management:

```typescript
// src/lib/queryKeys.ts
export const queryKeys = {
  currentUser: ["currentUser"] as const,
  conversations: {
    all: ["conversations"] as const,
    detail: (id: string) => ["conversation", id] as const,
  },
  jobs: {
    all: ["jobs"] as const,
    detail: (id: string) => ["jobs", id] as const,
  },
};
```

## Rate Limits

The backend enforces rate limits on certain endpoints:

| Endpoint | Limit |
|----------|-------|
| `POST /api/v1/summarize` | 10 requests/minute |
| `POST /api/v1/chat` | 30 requests/minute |
| Other endpoints | No limit |

Rate limit constants are available in `src/lib/constants.ts`:

```typescript
import { API_RATE_LIMITS } from "@/lib/constants";

API_RATE_LIMITS.SUMMARIZE  // 10
API_RATE_LIMITS.CHAT       // 30
```

When rate limited, the API returns HTTP 429 with a user-friendly message.

## Pagination

The conversations endpoint supports pagination:

```typescript
import { API_PAGINATION } from "@/lib/constants";

getConversations(
  API_PAGINATION.DEFAULT_LIMIT,  // 20
  API_PAGINATION.DEFAULT_OFFSET  // 0
);
```

