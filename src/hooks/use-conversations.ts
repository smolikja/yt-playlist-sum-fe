import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversations, deleteConversation } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ConversationResponse } from "@/lib/types";

export function useConversations() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    enabled: isAuthenticated,
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["conversations"] });

      // Snapshot the previous value
      const previousConversations = queryClient.getQueryData<ConversationResponse[]>(["conversations"]);

      // Optimistically update to the new value
      if (previousConversations) {
        queryClient.setQueryData<ConversationResponse[]>(["conversations"], (old) =>
          old ? old.filter((conv) => conv.id !== deletedId) : []
        );
      }

      // Return a context object with the snapshotted value
      return { previousConversations };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousConversations) {
        queryClient.setQueryData(["conversations"], context.previousConversations);
      }
      toast.error("Failed to delete conversation");
    },
    onSuccess: () => {
      toast.success("Conversation deleted");
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
