"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { JobCard } from "./JobCard";
import { JobResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface JobsBannerProps {
    jobs: JobResponse[];
    onClaim: (jobId: string) => void;
    onRetry: (jobId: string) => void;
    onDelete: (jobId: string) => void;
    isClaiming?: boolean;
    isRetrying?: boolean;
    isDeleting?: boolean;
    pollingJobId?: string | null;
    className?: string;
}

/**
 * Floating banner component for displaying active jobs.
 * Shows above the URL input in HeroSection.
 * Collapsible with smooth animations.
 */
export function JobsBanner({
    jobs,
    onClaim,
    onRetry,
    onDelete,
    isClaiming,
    isRetrying,
    isDeleting,
    pollingJobId,
    className,
}: JobsBannerProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const t = useTranslations("jobs.banner");

    // Don't render if no jobs
    if (jobs.length === 0) {
        return null;
    }

    // Count by status
    const activeCount = jobs.filter(j => j.status === "pending" || j.status === "running").length;
    const completedCount = jobs.filter(j => j.status === "completed").length;
    const failedCount = jobs.filter(j => j.status === "failed").length;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
                "w-full mb-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden",
                className
            )}
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-medium text-foreground">
                        {t("title")}
                    </span>

                    {/* Status badges */}
                    <div className="flex items-center gap-1.5 ml-2">
                        {activeCount > 0 && (
                            <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-400">
                                {activeCount}
                            </span>
                        )}
                        {completedCount > 0 && (
                            <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400">
                                {completedCount}
                            </span>
                        )}
                        {failedCount > 0 && (
                            <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                                {failedCount}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">
                        {isExpanded ? t("hide") : t("showAll")}
                    </span>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 pt-0 space-y-2 max-h-64 overflow-y-auto">
                            <AnimatePresence mode="popLayout">
                                {jobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        onClaim={onClaim}
                                        onRetry={onRetry}
                                        onDelete={onDelete}
                                        isClaiming={isClaiming}
                                        isRetrying={isRetrying}
                                        isDeleting={isDeleting}
                                        isPolling={pollingJobId === job.id}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
