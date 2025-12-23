# Playlist Summarization

This document describes the playlist summarization feature.

## Overview

Users can paste a YouTube playlist URL to generate an AI-powered summary of all videos in the playlist. The summary is displayed in a card format with the ability to ask follow-up questions.

## User Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Paste URL      │────▶│  Loading State  │────▶│  Summary Card   │
│  (HeroSection)  │     │  (Progress)     │     │  + Chat         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Components

### HeroSection (`src/components/home/HeroSection.tsx`)

The landing page component with URL input.

**Features:**
- URL input with validation
- Animated submit button (MagicButton)
- Loading progress indicator with steps
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

Handles the playlist summarization API call.

```typescript
const { mutate, isPending, data } = useSummarize();

mutate(playlistUrl, {
  onSuccess: (result) => {
    // result.conversation_id
    // result.summary_markdown
    // result.playlist_title
  }
});
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

## API Response

```typescript
interface SummaryResult {
  playlist_title: string | null;
  video_count: number;
  summary_markdown: string;
  conversation_id: string;
}
```

## Conversation Persistence

- **Guest users**: Can generate summaries, but they're not saved
- **Logged-in users**: Summaries are saved to their account
- **Claiming**: Guest summaries can be claimed after login

## Sidebar Integration

Logged-in users can:
- View conversation history in sidebar
- Click to load previous summaries
- Delete conversations
- Start new summaries
