import { useEffect, useRef } from "react";
import { Message } from "@/hooks/use-chat";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length > 0 || isLoading) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

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
