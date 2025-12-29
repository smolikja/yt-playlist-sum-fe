"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type MarkdownVariant = "summary" | "chat" | "user";

interface MarkdownContentProps {
    content: string;
    variant?: MarkdownVariant;
    className?: string;
}

const variantStyles: Record<MarkdownVariant, string> = {
    summary: cn(
        "prose prose-lg dark:prose-invert prose-indigo max-w-none",
        "prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl",
        "prose-p:text-muted-foreground prose-li:text-muted-foreground",
        "prose-a:text-indigo-500 prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-code:text-indigo-400"
    ),
    chat: cn(
        "prose prose-base dark:prose-invert prose-indigo max-w-none",
        "prose-headings:font-bold prose-headings:text-white",
        "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
        "prose-p:text-zinc-300 prose-p:my-1.5",
        "prose-li:text-zinc-300 prose-li:my-0.5",
        "prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-white prose-code:text-indigo-400",
        "prose-ul:my-2 prose-ol:my-2"
    ),
    user: cn(
        "prose prose-base prose-invert max-w-none",
        "prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
        "prose-p:text-white prose-p:my-1.5",
        "prose-li:text-white prose-li:my-0.5",
        "prose-a:text-blue-200 prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-white prose-code:text-blue-200",
        "prose-ul:my-2 prose-ol:my-2"
    ),
};

/**
 * Unified markdown rendering component for consistent styling across the app.
 * 
 * Variants:
 * - `summary`: Rich, larger text for playlist summaries (prose-lg)
 * - `chat`: Balanced styling for AI assistant messages (prose-base)
 * - `user`: Light-on-dark styling for user messages in blue bubble (prose-base, inverted)
 */
export function MarkdownContent({ content, variant = "chat", className }: MarkdownContentProps) {
    return (
        <div className={cn(variantStyles[variant], className)}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
