import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { summarizePlaylist } from "@/lib/api";
import { SummaryResult } from "@/lib/types";

/**
 * Custom hook to handle playlist summarization.
 * 
 * @returns {UseMutationResult} The mutation object containing status, data, and error.
 */
export function useSummarize(): UseMutationResult<SummaryResult, Error, string> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (url: string) => summarizePlaylist(url),
        onSuccess: () => {
            // Invalidate the conversations list query so the sidebar updates immediately
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
    });
}
