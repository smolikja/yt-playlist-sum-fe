import { useEffect, useRef } from "react";
import { Message } from "@/hooks/use-chat";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    conversationId: string;
}

export function MessageList({ messages, isLoading, conversationId }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const prevConversationIdRef = useRef<string | null>(null);

    useEffect(() => {
        const isConversationChange = prevConversationIdRef.current !== conversationId;

        // Only scroll on conversation change, not on new messages
        if (isConversationChange && (messages.length > 0 || isLoading)) {
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
        }

        prevConversationIdRef.current = conversationId;
    }, [conversationId, messages.length, isLoading]);

    return (
        <div className="w-full space-y-6 px-4">
            {/* Intro Message - Removed */}

            {messages.map((msg, index) => (
                <MessageBubble key={index} role={msg.role} content={msg.content} />
            ))}

            {isLoading && (
                <div className="flex w-full flex-row gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-purple-500/10 border-purple-500/20 text-purple-500">
                        <span className="animate-pulse">...</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground animate-pulse">AI is thinking...</span>
                    </div>
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}
