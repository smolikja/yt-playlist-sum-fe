import { useRef, useEffect } from "react";
import { useChat, Message } from "@/hooks/use-chat";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { motion } from "framer-motion";

interface ChatContainerProps {
    conversationId: string;
    initialMessages?: Message[];
    onInteract?: () => void;
}

export function ChatContainer({ conversationId, initialMessages, onInteract }: ChatContainerProps) {
    const { messages, isLoading, submitMessage } = useChat({ conversationId, initialMessages });
    const chatInputRef = useRef<HTMLDivElement>(null);
    const hasScrolledRef = useRef(false);

    // Simple scroll logic: scroll to chat input once after mount if there are messages
    useEffect(() => {
        // Only scroll once per mount, and only if there are initial messages
        if (hasScrolledRef.current) return;
        if (!initialMessages || initialMessages.length === 0) return;

        // Wait for animations to complete (0.5s duration + 0.2s delay = 0.7s)
        const timer = setTimeout(() => {
            chatInputRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
            hasScrolledRef.current = true;
        }, 750);

        return () => clearTimeout(timer);
    }, [initialMessages]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 w-full max-w-4xl"
        >
            <div className="flex flex-col gap-6">
                <MessageList messages={messages} isLoading={isLoading} />
                <div ref={chatInputRef}>
                    <ChatInput
                        onSend={submitMessage}
                        isLoading={isLoading}
                        onInteract={onInteract}
                    />
                </div>
            </div>
        </motion.div>
    );
}

