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
    const prevConversationIdRef = useRef(conversationId);

    useEffect(() => {
        const isConversationChange = prevConversationIdRef.current !== conversationId;
        const behavior = isConversationChange ? "instant" : "smooth"; // 'auto' is effectively instant

        // Ensure we scroll if there are messages or if loading
        if (messages.length > 0 || isLoading) {
            // Use 'auto' instead of 'instant' for better compatibility if needed, 
            // but 'instant' is supported in modern browsers for scrollIntoView options 
            // (though TS might complain about ScrollBehavior). 
            // Actually, for scrollIntoView, the values are "auto" | "smooth". "auto" is instant.
            bottomRef.current?.scrollIntoView({ behavior: behavior === "instant" ? "auto" : "smooth" });
        }

        prevConversationIdRef.current = conversationId;
    }, [messages, isLoading, conversationId]);

    return (
        <div className="w-full space-y-6 px-4">
            {/* Intro Message */}
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground opacity-50">
                    <p className="text-sm">Ask questions about the playlist content...</p>
                </div>
            )}

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
