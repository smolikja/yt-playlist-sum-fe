import { useMutation } from "@tanstack/react-query";
import { claimConversation } from "@/lib/api";

export function useClaimConversation() {
  return useMutation({
    mutationFn: (conversationId: string) => claimConversation(conversationId),
  });
}
