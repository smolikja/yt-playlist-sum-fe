import { useState, useCallback } from "react";
import { useSummarize } from "@/hooks/use-summarize";
import { useAuth } from "@/hooks/use-auth";
import { useClaimConversation } from "@/hooks/use-claim";
import { useConversation } from "@/hooks/use-conversation";
import { toast } from "sonner";
import { Message } from "@/hooks/use-chat";
import { Role } from "@/lib/types";

const LOADING_STEPS = [
    "Fetching playlist data...",
    "Extracting video transcripts...",
    "Analyzing content with Gemini...",
    "Generating summary...",
];

export function useHomeView() {
    // URL input state
    const [url, setUrl] = useState("");

    // Navigation state
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auth modal state
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    // Loading progress state
    const [loadingStep, setLoadingStep] = useState(0);

    // Hooks
    const { mutate: summarize, isPending: isSummarizing, data: summaryData } = useSummarize();
    const { user, isAuthenticated, logout } = useAuth();
    const { mutate: claimConversation, isPending: isClaiming } = useClaimConversation();
    const { data: conversationData, isLoading: isLoadingConversation } = useConversation(
        activeConversationId || ""
    );

    // Computed values
    const isDetailView = !!activeConversationId;
    const isJustSummarized = summaryData?.conversation_id === activeConversationId;

    const displayTitle =
        conversationData?.title ||
        (isJustSummarized ? summaryData?.playlist_title : null) ||
        "Playlist Summary";

    const displaySummary =
        conversationData?.summary ||
        (isJustSummarized ? summaryData?.summary_markdown : null);

    const displayDate = conversationData?.created_at
        ? new Date(conversationData.created_at).toLocaleDateString()
        : "Just now";

    const initialMessages: Message[] =
        conversationData?.messages.map((m) => ({
            role: m.role as Role,
            content: m.content,
        })) || [];

    // Event handlers
    const handleNewChat = useCallback(() => {
        setActiveConversationId(null);
        setUrl("");
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        handleNewChat();
    }, [logout, handleNewChat]);

    const handleSubmit = useCallback(() => {
        if (!url) {
            toast.error("Please enter a playlist URL");
            return;
        }

        setLoadingStep(0);
        setActiveConversationId(null);

        const interval = setInterval(() => {
            setLoadingStep((prev) =>
                prev < LOADING_STEPS.length - 1 ? prev + 1 : prev
            );
        }, 2000);

        summarize(url, {
            onSuccess: (result) => {
                clearInterval(interval);
                toast.success("Summary generated successfully!");
                setActiveConversationId(result.conversation_id);
            },
            onError: (err) => {
                clearInterval(interval);
                toast.error(err.message || "Failed to generate summary");
            },
        });
    }, [url, summarize]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !isSummarizing) {
                handleSubmit();
            }
        },
        [isSummarizing, handleSubmit]
    );

    const handleAuthSuccess = useCallback(() => {
        if (activeConversationId) {
            claimConversation(activeConversationId, {
                onSuccess: () => {
                    toast.success("Conversation claimed successfully!");
                },
                onError: () => {
                    toast.error("Failed to claim conversation.");
                },
            });
        }
    }, [activeConversationId, claimConversation]);

    const handleDeleteConversation = useCallback(
        (id: string) => {
            if (activeConversationId === id) {
                setActiveConversationId(null);
            }
        },
        [activeConversationId]
    );

    const handleSelectConversation = useCallback((id: string) => {
        setActiveConversationId(id);
    }, []);

    return {
        // State
        url,
        activeConversationId,
        loadingStep,
        loadingSteps: LOADING_STEPS,
        isMobileMenuOpen,
        isAuthModalOpen,
        isSummarizing,
        isClaiming,
        isLoadingConversation,

        // User data
        user,
        isAuthenticated,

        // Computed
        isDetailView,
        isJustSummarized,
        displayTitle,
        displaySummary,
        displayDate,
        initialMessages,

        // Actions
        setUrl,
        setMobileMenuOpen: setIsMobileMenuOpen,
        setAuthModalOpen,
        handleSubmit,
        handleKeyDown,
        handleNewChat,
        handleLogout,
        handleSelectConversation,
        handleAuthSuccess,
        handleDeleteConversation,
    };
}
