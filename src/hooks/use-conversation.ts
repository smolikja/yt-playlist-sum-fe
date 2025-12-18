import { useQuery } from "@tanstack/react-query";
import { getConversation } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { queryKeys } from "@/lib/queryKeys";

export function useConversation(conversationId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.conversations.detail(conversationId),
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId && isAuthenticated,
  });
}

