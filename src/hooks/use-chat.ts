import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/lib/api";
import { Role } from "@/lib/types";

export interface Message {
    role: Role;
    content: string;
}

interface UseChatProps {
    conversationId: string;
}

export function useChat({ conversationId }: UseChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);

    const { mutate: sendMessageMutation, isPending: isLoading } = useMutation({
        mutationFn: async ({ message, useTranscripts }: { message: string; useTranscripts: boolean }) => {
            // Optimistic update handled in the wrapper function
            return sendMessage(conversationId, message, useTranscripts);
        },
        onSuccess: (data) => {
            setMessages((prev) => [
                ...prev,
                { role: Role.AI, content: data.response },
            ]);
        },
        onError: (error) => {
            console.error("Failed to send message:", error);
            // Remove the optimistic user message or show error state
            // For now, let's just append an error message system-side
            setMessages((prev) => [
                ...prev,
                { role: Role.AI, content: "Sorry, I encountered an error responding to your message." },
            ]);
        },
    });

    const submitMessage = (message: string, useTranscripts: boolean) => {
        if (!message.trim()) return;

        // Optimistic update: Add user message immediately
        setMessages((prev) => [...prev, { role: Role.USER, content: message }]);

        // Trigger API call
        sendMessageMutation({ message, useTranscripts });
    };

    return {
        messages,
        isLoading,
        submitMessage,
    };
}
