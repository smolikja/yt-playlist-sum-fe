import { useQuery } from "@tanstack/react-query";
import { getConversation } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export function useConversation(conversationId: string) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId && isAuthenticated,
  });
}
