import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/lib/api";

export interface Message {
    role: "user" | "ai";
    content: string;
}

interface UseChatProps {
    conversationId: string;
}

export function useChat({ conversationId }: UseChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);

    const { mutate: sendMessageMutation, isPending: isLoading } = useMutation({
        mutationFn: async (message: string) => {
            // Optimistic update handled in the wrapper function
            return sendMessage(conversationId, message);
        },
        onSuccess: (data) => {
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: data.response },
            ]);
        },
        onError: (error) => {
            console.error("Failed to send message:", error);
            // Remove the optimistic user message or show error state
            // For now, let's just append an error message system-side
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Sorry, I encountered an error responding to your message." },
            ]);
        },
    });

    const submitMessage = (message: string) => {
        if (!message.trim()) return;

        // Optimistic update: Add user message immediately
        setMessages((prev) => [...prev, { role: "user", content: message }]);

        // Trigger API call
        sendMessageMutation(message);
    };

    return {
        messages,
        isLoading,
        submitMessage,
    };
}
