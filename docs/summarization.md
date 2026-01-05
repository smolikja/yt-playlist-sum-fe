# Playlist Summarization

This document describes the playlist summarization feature.

## Overview

Users can paste a YouTube playlist URL to generate an AI-powered summary of all videos. The system uses **dual-mode** operation:

| User Type | Mode | Behavior |
|-----------|------|----------|
| Unauthenticated | Sync | Immediate response (max 100s) |
| Authenticated | Async | Background job with polling |

## User Flow

### Unauthenticated Users (Sync)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Paste URL      │────▶│  Loading State  │────▶│  Summary Card   │
│  (HeroSection)  │     │  (Progress)     │     │  + Chat         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

If timeout (408), auth modal is shown with context message.

### Authenticated Users (Async)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Paste URL      │────▶│  Job Created    │────▶│  Claim Job      │
│  (HeroSection)  │     │  (Poll status)  │     │  → Conversation │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

Jobs appear in the floating JobsBanner above the URL input.

## Components

### HeroSection (`src/components/home/HeroSection.tsx`)

The landing page component with URL input.

**Features:**
- URL input with validation
- Animated submit button (MagicButton)
- Loading progress indicator with steps
- **JobsBanner** for authenticated users
- Responsive design

### SummaryCard (`src/components/home/SummaryCard.tsx`)

Displays the generated playlist summary.

**Features:**
- Playlist title (clickable link to YouTube)
- Summary date
- Markdown-rendered summary content
- Animated border beam effect
- Gradient overlay

### DetailView (`src/components/home/DetailView.tsx`)

Container for summary and chat interface.

**Features:**
- Loading state handling
- Conditional chat display based on auth
- Claiming conversation for logged-in users

## Hooks

### useSummarize (`src/hooks/use-summarize.ts`)

Handles the playlist summarization API call with dual-mode response.

```typescript
const { mutate, isPending, data } = useSummarize();

mutate(playlistUrl, {
  onSuccess: (result) => {
    if (result.mode === 'sync') {
      // Immediate summary
      navigate(result.summary.conversation_id);
    } else {
      // Job created - add to jobs list and poll
      addJob(result.job);
    }
  }
});
```

### useJobs (`src/hooks/use-jobs.ts`)

Manages background jobs for authenticated users.

```typescript
const { jobs, claimJob, retryJob, deleteJob } = useJobs();
```

### useConversation (`src/hooks/use-conversation.ts`)

Fetches conversation details including summary.

```typescript
const { data, isLoading } = useConversation(conversationId);
// data.title
// data.summary
// data.playlist_url
// data.messages
```

### useConversations (`src/hooks/use-conversations.ts`)

Lists all user conversations with grouping.

```typescript
const { data, isLoading } = useConversations();
// data.today[]
// data.yesterday[]
// data.lastWeek[]
// data.older[]
```

## Loading States

During summarization, progress is shown with animated steps:

1. "Fetching playlist data..."
2. "Extracting video transcripts..."
3. "Analyzing content with Gemini..."
4. "Generating summary..."

## API Response Types

### Sync Mode (Unauthenticated)

```typescript
interface SummaryResult {
  playlist_title: string | null;
  video_count: number;
  summary_markdown: string;
  conversation_id: string;
}
```

### Async Mode (Authenticated)

```typescript
interface JobResponse {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  playlist_url: string;
  error_message: string | null;
  created_at: string;
}
```

## Conversation Persistence

- **Guest users**: Can generate summaries via sync mode
- **Logged-in users**: Get async jobs, summaries saved after claiming
- **Claiming**: Guest summaries can be claimed after login

## Related Documentation

- [Background Jobs](./background-jobs.md) - Detailed job system documentation

