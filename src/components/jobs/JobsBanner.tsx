"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";
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
 * Linear job list component for displaying active jobs.
 * Shows above the title in HeroSection, no border/card wrapper.
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
            className={cn("w-full max-w-xl mx-auto mb-12", className)}
        >
            {/* Header with status badges */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-foreground">
                    {t("title")}
                </span>

                {/* Status badges */}
                <div className="flex items-center gap-1.5">
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

            {/* Job cards in a linear list */}
            <div className="space-y-3">
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
    );
}
