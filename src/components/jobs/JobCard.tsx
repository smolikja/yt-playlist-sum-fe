"use client";

import { motion } from "framer-motion";
import { ExternalLink, RotateCcw, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobStatusIndicator } from "./JobStatusIndicator";
import { JobResponse } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface JobCardProps {
    job: JobResponse;
    onClaim?: (jobId: string) => void;
    onRetry?: (jobId: string) => void;
    onDelete?: (jobId: string) => void;
    isClaiming?: boolean;
    isRetrying?: boolean;
    isDeleting?: boolean;
    isPolling?: boolean;
}

/**
 * Truncate URL to show only the essential part
 */
function truncateUrl(url: string, maxLength = 40): string {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname + urlObj.search;
        if (path.length <= maxLength) return path;
        return path.substring(0, maxLength - 3) + "...";
    } catch {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength - 3) + "...";
    }
}

/**
 * Full-detail job card component.
 * Shows status, URL, creation time, and action buttons based on job status.
 */
export function JobCard({
    job,
    onClaim,
    onRetry,
    onDelete,
    isClaiming,
    isRetrying,
    isDeleting,
    isPolling,
}: JobCardProps) {
    const t = useTranslations("jobs");

    const isLoading = isClaiming || isRetrying || isDeleting;
    const isPendingOrRunning = job.status === "pending" || job.status === "running";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative p-3 rounded-lg border bg-card/50 backdrop-blur-sm",
                "border-border/50 hover:border-border transition-colors",
                job.status === "completed" && "border-emerald-500/30 bg-emerald-500/5",
                job.status === "failed" && "border-red-500/30 bg-red-500/5"
            )}
        >
            {/* Status and URL Row */}
            <div className="flex items-start gap-3">
                <JobStatusIndicator status={job.status} size="md" />

                <div className="flex-1 min-w-0">
                    {/* Status Text */}
                    <p className={cn(
                        "text-sm font-medium",
                        job.status === "pending" && "text-amber-400",
                        job.status === "running" && "text-indigo-400",
                        job.status === "completed" && "text-emerald-400",
                        job.status === "failed" && "text-red-400"
                    )}>
                        {t(`status.${job.status}`)}
                    </p>

                    {/* Playlist URL */}
                    <a
                        href={job.playlist_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mt-0.5 truncate"
                    >
                        {truncateUrl(job.playlist_url)}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>

                    {/* Creation Time - using shared formatRelativeTime from utils */}
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        {t("time.created", { time: formatRelativeTime(job.created_at) })}
                    </p>

                    {/* Error Message (if failed) */}
                    {job.status === "failed" && job.error_message && (
                        <p className="text-xs text-red-400/80 mt-1 line-clamp-2">
                            {job.error_message}
                        </p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-3">
                {job.status === "completed" && (
                    <Button
                        size="sm"
                        onClick={() => onClaim?.(job.id)}
                        disabled={isLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        {t("actions.view")}
                    </Button>
                )}

                {job.status === "failed" && (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRetry?.(job.id)}
                            disabled={isLoading}
                            className="flex-1 h-8 text-xs"
                        >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            {t("actions.retry")}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete?.(job.id)}
                            disabled={isLoading}
                            className="h-8 text-xs text-muted-foreground hover:text-red-400"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </>
                )}

                {job.status === "pending" && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete?.(job.id)}
                        disabled={isLoading}
                        className="ml-auto h-8 text-xs text-muted-foreground hover:text-red-400"
                    >
                        <X className="w-3 h-3 mr-1" />
                        {t("actions.cancel")}
                    </Button>
                )}
            </div>
        </motion.div>
    );
}
