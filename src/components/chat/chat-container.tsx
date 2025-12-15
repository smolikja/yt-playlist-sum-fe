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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 w-full max-w-4xl"
        >
            <div className="flex flex-col gap-6">
                <MessageList messages={messages} isLoading={isLoading} conversationId={conversationId} />
                <ChatInput 
                    onSend={submitMessage} 
                    isLoading={isLoading} 
                    isEmpty={messages.length === 0}
                    onInteract={onInteract}
                />
            </div>
        </motion.div>
    );
}

