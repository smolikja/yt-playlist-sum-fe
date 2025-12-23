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
    const prevMessageCountRef = useRef(messages.length);

    // Scroll helper function
    const scrollToChatInput = (behavior: ScrollBehavior = "smooth") => {
        chatInputRef.current?.scrollIntoView({
            behavior,
            block: "end",
        });
    };

    // Initial scroll: scroll to chat input once after mount if there are messages
    useEffect(() => {
        if (hasScrolledRef.current) return;
        if (!initialMessages || initialMessages.length === 0) return;

        // Wait for animations to complete (0.5s duration + 0.2s delay = 0.7s)
        const timer = setTimeout(() => {
            scrollToChatInput("smooth");
            hasScrolledRef.current = true;
        }, 750);

        return () => clearTimeout(timer);
    }, [initialMessages]);

    // Scroll when new message arrives (user sends or AI responds)
    useEffect(() => {
        const messageCountChanged = messages.length !== prevMessageCountRef.current;

        if (messageCountChanged && messages.length > 0) {
            scrollToChatInput("smooth");
        }

        prevMessageCountRef.current = messages.length;
    }, [messages.length]);

    // Scroll when AI starts thinking (isLoading becomes true)
    useEffect(() => {
        if (isLoading) {
            scrollToChatInput("smooth");
        }
    }, [isLoading]);

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
