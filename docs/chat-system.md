# Chat System

This document describes the AI chat interface implementation.

## Overview

The chat system allows users to ask questions about summarized YouTube playlists. It supports two modes: Fast Mode (summary-based) and Deep Mode (transcript-based).

## Components

### ChatContainer (`src/components/chat/chat-container.tsx`)

The main container component that orchestrates the chat interface.

**Features:**
- Manages chat state via `useChat` hook
- Automatic scroll to chat input on new messages
- Scroll on conversation change (only if messages exist)
- Framer Motion animations

### MessageList (`src/components/chat/message-list.tsx`)

Renders the list of messages in the conversation.

**Features:**
- Displays user and AI messages with different styling
- Loading indicator while AI is thinking
- ForwardRef for scroll anchoring

### MessageBubble (`src/components/chat/message-bubble.tsx`)

Individual message component with role-based styling.

**Features:**
- User messages: Blue background, right-aligned
- AI messages: Neutral background, left-aligned with border
- Markdown rendering for AI responses
- Responsive width (95% on mobile, 80% on desktop)

### ChatInput (`src/components/chat/chat-input.tsx`)

The input component for sending messages.

**Features:**
- Fast/Deep mode toggle with tooltip
- Animated gradient border
- Send button with loading state
- Keyboard support (Enter to send)

## Hooks

### useChat (`src/hooks/use-chat.ts`)

Manages chat state and message sending.

```typescript
const { messages, isLoading, submitMessage } = useChat({
  conversationId,
  initialMessages,
});
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `conversationId` | `string` | Active conversation ID |
| `initialMessages` | `Message[]` | Messages to initialize with |

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `messages` | `Message[]` | All messages in conversation |
| `isLoading` | `boolean` | AI is generating response |
| `submitMessage` | `function` | Send a new message |

## Chat Modes

### Fast Mode (Default)
- Uses summary and chat history only
- Faster responses
- Lower token usage
- Icon: ⚡ (yellow when active)

### Deep Mode
- Includes full video transcripts
- More detailed answers
- Higher token usage
- Icon: ⚡ (neutral when inactive)

## Scroll Behavior

The chat implements smart scrolling:

1. **On conversation load**: Scrolls to chat input if messages exist
2. **On new message**: Smooth scroll to chat input
3. **While AI thinking**: Keeps chat input visible
4. **Summary only**: No automatic scroll (user starts at top)

## API Integration

Messages are sent to `/chat` endpoint:

```typescript
interface ChatRequest {
  conversation_id: string;
  message: string;
  use_transcripts?: boolean; // true for Deep Mode
}
```
