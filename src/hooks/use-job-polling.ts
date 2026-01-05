"use client";

import { useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJob } from "@/lib/api";
import { JobResponse, JobStatus } from "@/lib/types";
import { queryKeys } from "@/lib/queryKeys";
import { JOB_CONFIG } from "@/lib/constants";

interface UseJobPollingOptions {
    /** Callback when job completes successfully */
    onComplete?: (job: JobResponse) => void;
    /** Callback when job fails */
    onFailed?: (job: JobResponse) => void;
    /** Callback on every status update */
    onStatusChange?: (job: JobResponse) => void;
}

/**
 * Hook for polling a specific job's status.
 * Automatically stops polling when job is completed or failed.
 * 
 * @param jobId - The job ID to poll, or null to disable
 * @param options - Callbacks for job status changes
 */
export function useJobPolling(
    jobId: string | null,
    options: UseJobPollingOptions = {}
) {
    const { onComplete, onFailed, onStatusChange } = options;
    const queryClient = useQueryClient();
    const previousStatusRef = useRef<JobStatus | null>(null);

    // Determine if we should be polling
    const shouldPoll = !!jobId;

    const { data: job, isLoading, isError, error } = useQuery({
        queryKey: queryKeys.jobs.detail(jobId || ""),
        queryFn: () => getJob(jobId!),
        enabled: shouldPoll,
        refetchInterval: (query) => {
            const data = query.state.data;
            // Stop polling if completed or failed
            if (data?.status === "completed" || data?.status === "failed") {
                return false;
            }
            return JOB_CONFIG.POLL_INTERVAL_MS;
        },
        staleTime: 0,
    });

    // Handle status changes
    useEffect(() => {
        if (!job) return;

        const previousStatus = previousStatusRef.current;
        const currentStatus = job.status;

        // Only trigger callbacks on actual status changes
        if (previousStatus !== currentStatus) {
            onStatusChange?.(job);

            // Update the job in the jobs list cache
            queryClient.setQueryData<JobResponse[]>(queryKeys.jobs.all, (old) =>
                old?.map((j) => (j.id === job.id ? job : j))
            );

            if (currentStatus === "completed") {
                onComplete?.(job);
            } else if (currentStatus === "failed") {
                onFailed?.(job);
            }
        }

        previousStatusRef.current = currentStatus;
    }, [job, onComplete, onFailed, onStatusChange, queryClient]);

    // Reset ref when job ID changes
    useEffect(() => {
        previousStatusRef.current = null;
    }, [jobId]);

    return {
        job,
        isLoading,
        isError,
        error,
        isPolling: shouldPoll && (job?.status === "pending" || job?.status === "running"),
    };
}

/**
 * Hook for polling multiple active jobs.
 * Useful for tracking all pending/running jobs at once.
 */
export function useActiveJobsPolling(
    jobIds: string[],
    options: UseJobPollingOptions = {}
) {
    const queryClient = useQueryClient();

    // Poll all jobs using refetchInterval
    const queries = jobIds.map((jobId) =>
        useQuery({
            queryKey: queryKeys.jobs.detail(jobId),
            queryFn: () => getJob(jobId),
            enabled: !!jobId,
            refetchInterval: (query) => {
                const data = query.state.data;
                if (data?.status === "completed" || data?.status === "failed") {
                    return false;
                }
                return JOB_CONFIG.POLL_INTERVAL_MS;
            },
            staleTime: 0,
        })
    );

    // Sync updates to jobs list cache
    useEffect(() => {
        queries.forEach((query) => {
            if (query.data) {
                queryClient.setQueryData<JobResponse[]>(queryKeys.jobs.all, (old) =>
                    old?.map((j) => (j.id === query.data.id ? query.data : j))
                );

                // Trigger callbacks
                if (query.data.status === "completed") {
                    options.onComplete?.(query.data);
                } else if (query.data.status === "failed") {
                    options.onFailed?.(query.data);
                }
            }
        });
    }, [queries, queryClient, options]);

    return {
        isPolling: queries.some((q) => q.data?.status === "pending" || q.data?.status === "running"),
    };
}
