import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { summarizePlaylist } from "@/lib/api";
import { SummarizeResponse } from "@/lib/types";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Custom hook to handle playlist summarization.
 * Returns a discriminated union based on user authentication:
 * - mode: 'sync' → immediate summary result (unauthenticated)
 * - mode: 'async' → job created for background processing (authenticated)
 * 
 * @returns {UseMutationResult} The mutation object containing status, data, and error.
 */
export function useSummarize(): UseMutationResult<SummarizeResponse, Error, string> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (url: string) => summarizePlaylist(url),
        onSuccess: (result) => {
            // Only invalidate conversations if sync mode returned a conversation
            if (result.mode === 'sync') {
                queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
            }
            // For async mode, job management is handled separately
        },
    });
}
