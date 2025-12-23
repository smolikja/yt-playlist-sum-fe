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
// Generate playlist summary
summarizePlaylist(url: string): Promise<SummaryResult>
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
  conversations: {
    all: () => ["conversations"],
    list: () => [...queryKeys.conversations.all(), "list"],
    detail: (id: string) => [...queryKeys.conversations.all(), id],
  },
};
```
