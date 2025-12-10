import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { summarizePlaylist } from "@/lib/api";
import { SummaryResult } from "@/lib/types";

/**
 * Custom hook to handle playlist summarization.
 * 
 * @returns {UseMutationResult} The mutation object containing status, data, and error.
 */
export function useSummarize(): UseMutationResult<SummaryResult, Error, string> {
    return useMutation({
        mutationFn: (url: string) => summarizePlaylist(url),
    });
}
