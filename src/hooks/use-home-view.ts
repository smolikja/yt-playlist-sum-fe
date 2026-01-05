import { useState, useCallback, useMemo } from "react";
import { useSummarize } from "@/hooks/use-summarize";
import { useAuth } from "@/hooks/use-auth";
import { useClaimConversation } from "@/hooks/use-claim";
import { useConversation } from "@/hooks/use-conversation";
import { useJobs } from "@/hooks/use-jobs";
import { useJobPolling } from "@/hooks/use-job-polling";
import { toast } from "sonner";
import { Message } from "@/hooks/use-chat";
import { Role, isRole, PublicTimeoutError, JobLimitError, JobResponse } from "@/lib/types";
import { useTranslations } from "next-intl";
import { JOB_CONFIG } from "@/lib/constants";

export function useHomeView() {
    const t = useTranslations("toast");
    const tLoading = useTranslations("loading");
    const tCommon = useTranslations("common");
    const tTime = useTranslations("time");
    const tJobs = useTranslations("jobs");

    // Translated loading steps
    const loadingSteps = useMemo(
        () => [
            tLoading("fetchingPlaylist"),
            tLoading("extractingTranscripts"),
            tLoading("analyzingContent"),
            tLoading("generatingSummary"),
        ],
        [tLoading]
    );

    // URL input state
    const [url, setUrl] = useState("");

    // Navigation state
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auth modal state
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalContextMessage, setAuthModalContextMessage] = useState<string | null>(null);

    // Loading progress state
    const [loadingStep, setLoadingStep] = useState(0);

    // Current polling job ID (for newly created job)
    const [pollingJobId, setPollingJobId] = useState<string | null>(null);

    // Hooks
    const { mutate: summarize, isPending: isSummarizing, data: summaryData } = useSummarize();
    const { user, isAuthenticated, logout } = useAuth();
    const { mutate: claimConversation, isPending: isClaiming } = useClaimConversation();
    const { data: conversationData, isLoading: isLoadingConversation } = useConversation(
        activeConversationId || ""
    );

    // Computed values - need to compute early to pass to useJobs
    const isDetailView = !!activeConversationId;

    // Jobs hook - only enabled for authenticated users
    // Polling only runs when jobs view is visible (not in detail view)
    const {
        jobs,
        activeJobs,
        completedJobs,
        failedJobs,
        isLoading: isLoadingJobs,
        claimJob,
        isClaiming: isClaimingJob,
        retryJob,
        isRetrying,
        deleteJob,
        isDeleting,
        addJob,
        updateJob,
    } = useJobs(isAuthenticated, !isDetailView);

    // Poll the newly created job
    useJobPolling(pollingJobId, {
        onComplete: (job) => {
            setPollingJobId(null);
            toast.success(tJobs("status.completed"));
        },
        onFailed: (job) => {
            setPollingJobId(null);
            toast.error(job.error_message || tJobs("status.failed"));
        },
        onStatusChange: (job) => {
            updateJob(job);
        },
    });

    // Computed values
    const isJustSummarized = summaryData?.mode === 'sync' && summaryData.summary?.conversation_id === activeConversationId;

    const displayTitle =
        conversationData?.title ||
        (isJustSummarized && summaryData?.mode === 'sync' ? summaryData.summary?.playlist_title : null) ||
        tCommon("playlistSummary");

    const displaySummary =
        conversationData?.summary ||
        (isJustSummarized && summaryData?.mode === 'sync' ? summaryData.summary?.summary_markdown : null);

    const displayDate = conversationData?.created_at
        ? new Date(conversationData.created_at).toLocaleDateString()
        : tTime("justNow");

    // URL is available from backend response or from just-summarized state
    const displayPlaylistUrl = conversationData?.playlist_url || (isJustSummarized ? url : undefined);

    const initialMessages: Message[] =
        conversationData?.messages
            .filter((m) => isRole(m.role))
            .map((m) => ({
                role: m.role,
                content: m.content,
            })) || [];

    // Event handlers
    const handleNewChat = useCallback(() => {
        setActiveConversationId(null);
        setUrl("");
        setPollingJobId(null);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        handleNewChat();
    }, [logout, handleNewChat]);

    const handleSubmit = useCallback(() => {
        if (!url) {
            toast.error(t("error.enterPlaylistUrl"));
            return;
        }

        setLoadingStep(0);
        setActiveConversationId(null);

        const interval = setInterval(() => {
            setLoadingStep((prev) =>
                prev < loadingSteps.length - 1 ? prev + 1 : prev
            );
        }, 2000);

        summarize(url, {
            onSuccess: (result) => {
                clearInterval(interval);

                if (result.mode === 'sync') {
                    // Unauthenticated user - immediate result
                    toast.success(t("success.summaryGenerated"));
                    setActiveConversationId(result.summary.conversation_id);
                } else {
                    // Authenticated user - job created
                    toast.success(tJobs("status.pending"));
                    addJob(result.job);
                    setPollingJobId(result.job.id);
                    setUrl(""); // Clear input after job is created
                }
            },
            onError: (err) => {
                clearInterval(interval);

                if (err instanceof PublicTimeoutError) {
                    // Show auth modal with timeout context
                    setAuthModalContextMessage(tJobs("errors.timeout"));
                    setAuthModalOpen(true);
                } else if (err instanceof JobLimitError) {
                    // Show job limit error
                    toast.error(tJobs("errors.limit", { count: JOB_CONFIG.MAX_CONCURRENT_JOBS }));
                } else {
                    toast.error(err.message || t("error.failedToGenerate"));
                }
            },
        });
    }, [url, summarize, loadingSteps.length, t, tJobs, addJob]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !isSummarizing) {
                handleSubmit();
            }
        },
        [isSummarizing, handleSubmit]
    );

    const handleAuthSuccess = useCallback(() => {
        setAuthModalContextMessage(null);
        if (activeConversationId) {
            claimConversation(activeConversationId, {
                onSuccess: () => {
                    toast.success(t("success.conversationClaimed"));
                },
                onError: () => {
                    toast.error(t("error.failedToClaim"));
                },
            });
        }
    }, [activeConversationId, claimConversation, t]);

    const handleCloseAuthModal = useCallback(() => {
        setAuthModalOpen(false);
        setAuthModalContextMessage(null);
    }, []);

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

    // Handler for when unauthenticated user tries to use chat
    const handleChatAuthRequired = useCallback(() => {
        setAuthModalContextMessage(tJobs("errors.chatAuth"));
        setAuthModalOpen(true);
    }, [tJobs]);

    // Job action handlers
    const handleClaimJob = useCallback(async (jobId: string) => {
        try {
            const result = await claimJob(jobId);
            toast.success(t("success.conversationClaimed"));
            setActiveConversationId(result.conversation.id);
        } catch (error) {
            toast.error(t("error.failedToClaim"));
        }
    }, [claimJob, t]);

    const handleRetryJob = useCallback(async (jobId: string) => {
        try {
            const job = await retryJob(jobId);
            setPollingJobId(job.id);
            toast.success(tJobs("status.pending"));
        } catch (error) {
            toast.error(t("error.failedToGenerate"));
        }
    }, [retryJob, tJobs, t]);

    const handleDeleteJob = useCallback(async (jobId: string) => {
        try {
            await deleteJob(jobId);
            if (pollingJobId === jobId) {
                setPollingJobId(null);
            }
        } catch (error) {
            toast.error(t("error.failedToDelete"));
        }
    }, [deleteJob, pollingJobId, t]);

    return {
        // State
        url,
        activeConversationId,
        loadingStep,
        loadingSteps,
        isMobileMenuOpen,
        isAuthModalOpen,
        authModalContextMessage,
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
        displayPlaylistUrl,
        initialMessages,

        // Jobs data
        jobs,
        activeJobs,
        completedJobs,
        failedJobs,
        isLoadingJobs,
        isClaimingJob,
        isRetrying,
        isDeleting,
        pollingJobId,

        // Actions
        setUrl,
        setMobileMenuOpen: setIsMobileMenuOpen,
        setAuthModalOpen,
        handleCloseAuthModal,
        handleSubmit,
        handleKeyDown,
        handleNewChat,
        handleLogout,
        handleSelectConversation,
        handleAuthSuccess,
        handleDeleteConversation,
        handleChatAuthRequired,

        // Job actions
        handleClaimJob,
        handleRetryJob,
        handleDeleteJob,
    };
}
