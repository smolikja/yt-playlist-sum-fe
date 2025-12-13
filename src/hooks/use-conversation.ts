import { useQuery } from "@tanstack/react-query";
import { getConversation } from "@/lib/api";

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
  });
}
