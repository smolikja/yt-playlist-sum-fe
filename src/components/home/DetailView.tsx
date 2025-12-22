"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { SummaryCard } from "./SummaryCard";
import { ChatContainer } from "@/components/chat/chat-container";
import { Message } from "@/hooks/use-chat";
import { useTranslations } from "next-intl";

interface DetailViewProps {
    conversationId: string;
    isLoading: boolean;
    isJustSummarized: boolean;
    displayTitle: string;
    displayDate: string;
    displaySummary: string | null;
    initialMessages: Message[];
    isAuthenticated: boolean;
    isClaiming: boolean;
    onAuthRequired: () => void;
}

export function DetailView({
    conversationId,
    isLoading,
    isJustSummarized,
    displayTitle,
    displayDate,
    displaySummary,
    initialMessages,
    isAuthenticated,
    isClaiming,
    onAuthRequired,
}: DetailViewProps) {
    const t = useTranslations("detail");

    return (
        <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            transition={{ duration: 0.35, ease: "easeInOut", delay: 0.1 }}
            className="w-full max-w-4xl mx-auto pb-10"
        >
            {isLoading && !isJustSummarized ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            ) : displaySummary ? (
                <div>
                    {/* Summary Card */}
                    <SummaryCard
                        title={displayTitle}
                        date={displayDate}
                        summary={displaySummary}
                    />

                    {/* Chat Interface */}
                    {isAuthenticated ? (
                        isClaiming ? (
                            <div className="h-[200px] flex items-center justify-center border border-border rounded-xl bg-muted/50 dark:bg-neutral-900/50">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                    <p className="text-muted-foreground">{t("syncingConversation")}</p>
                                </div>
                            </div>
                        ) : (
                            <ChatContainer
                                key={conversationId}
                                conversationId={conversationId}
                                initialMessages={initialMessages}
                            />
                        )
                    ) : (
                        <ChatContainer
                            key={conversationId}
                            conversationId={conversationId}
                            initialMessages={initialMessages}
                            onInteract={onAuthRequired}
                        />
                    )}
                </div>
            ) : (
                <div className="text-center text-muted-foreground mt-20">
                    {t("loadFailed")}
                </div>
            )}
        </motion.div>
    );
}
