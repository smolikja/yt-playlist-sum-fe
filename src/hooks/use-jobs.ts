"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJobs, claimJob, retryJob, deleteJob } from "@/lib/api";
import { JobResponse, JobClaimResponse, JobStatus } from "@/lib/types";
import { queryKeys } from "@/lib/queryKeys";
import { JOB_CONFIG } from "@/lib/constants";
import { useMemo } from "react";

/**
 * Hook for managing user's background summarization jobs.
 * Provides queries for fetching jobs and mutations for claim/retry/delete.
 */
export function useJobs(enabled = true) {
    const queryClient = useQueryClient();

    // Query for fetching all user jobs
    // Automatically refetches when returning to the page and polls when there are active jobs
    const {
        data: jobs = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: queryKeys.jobs.all,
        queryFn: getJobs,
        enabled,
        staleTime: 0, // Always fetch fresh data
        refetchOnMount: true, // Refetch when component mounts
        refetchOnWindowFocus: true, // Refetch when window regains focus
        // Auto-poll when there are active (pending/running) jobs
        refetchInterval: (query) => {
            const data = query.state.data as JobResponse[] | undefined;
            const hasActiveJobs = data?.some(
                (job) => job.status === "pending" || job.status === "running"
            );
            // Poll every 5 seconds if there are active jobs
            return hasActiveJobs ? JOB_CONFIG.POLL_INTERVAL_MS : false;
        },
    });

    // Computed job lists by status
    const { pendingJobs, runningJobs, completedJobs, failedJobs, activeJobs } = useMemo(() => {
        const pending = jobs.filter((j) => j.status === "pending");
        const running = jobs.filter((j) => j.status === "running");
        const completed = jobs.filter((j) => j.status === "completed");
        const failed = jobs.filter((j) => j.status === "failed");
        const active = [...pending, ...running];

        return {
            pendingJobs: pending,
            runningJobs: running,
            completedJobs: completed,
            failedJobs: failed,
            activeJobs: active,
        };
    }, [jobs]);

    // Mutation for claiming a completed job
    const claimMutation = useMutation({
        mutationFn: (jobId: string) => claimJob(jobId),
        onSuccess: (_data, jobId) => {
            // Remove job from cache
            queryClient.setQueryData<JobResponse[]>(queryKeys.jobs.all, (old) =>
                old?.filter((j) => j.id !== jobId)
            );
            // Invalidate conversations to show the new one
            queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
        },
    });

    // Mutation for retrying a failed job
    const retryMutation = useMutation({
        mutationFn: (jobId: string) => retryJob(jobId),
        onSuccess: (updatedJob) => {
            // Update job in cache
            queryClient.setQueryData<JobResponse[]>(queryKeys.jobs.all, (old) =>
                old?.map((j) => (j.id === updatedJob.id ? updatedJob : j))
            );
        },
    });

    // Mutation for deleting/canceling a job
    const deleteMutation = useMutation({
        mutationFn: (jobId: string) => deleteJob(jobId),
        onSuccess: (_data, jobId) => {
            // Remove job from cache
            queryClient.setQueryData<JobResponse[]>(queryKeys.jobs.all, (old) =>
                old?.filter((j) => j.id !== jobId)
            );
        },
    });

    // Add a job to the cache (used when a new job is created)
    const addJob = (job: JobResponse) => {
        queryClient.setQueryData<JobResponse[]>(queryKeys.jobs.all, (old) => [
            job,
            ...(old || []),
        ]);
    };

    // Update a specific job in cache
    const updateJob = (updatedJob: JobResponse) => {
        queryClient.setQueryData<JobResponse[]>(queryKeys.jobs.all, (old) =>
            old?.map((j) => (j.id === updatedJob.id ? updatedJob : j))
        );
    };

    return {
        // Data
        jobs,
        pendingJobs,
        runningJobs,
        completedJobs,
        failedJobs,
        activeJobs,

        // Query state
        isLoading,
        isError,
        error,
        refetch,

        // Mutations
        claimJob: claimMutation.mutateAsync,
        isClaiming: claimMutation.isPending,

        retryJob: retryMutation.mutateAsync,
        isRetrying: retryMutation.isPending,

        deleteJob: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,

        // Cache updates
        addJob,
        updateJob,
    };
}
