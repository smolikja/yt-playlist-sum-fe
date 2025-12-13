import { cn, formatRelativeTime } from "@/lib/utils";
import { ConversationResponse } from "@/lib/types";
import { motion } from "framer-motion";
import { MessageSquare, Clock, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteConversation } from "@/hooks/use-conversations";
import { useState } from "react";

interface ConversationItemProps {
  conversation: ConversationResponse;
  isActive: boolean;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export function ConversationItem({ conversation, isActive, onClick, onDelete }: ConversationItemProps) {
  const { mutate: deleteConversation, isPending } = useDeleteConversation();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const confirmDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default action if any
    deleteConversation(conversation.id, {
        onSuccess: () => {
            onDelete?.(conversation.id);
            setIsAlertOpen(false);
        }
    });
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "group relative w-full flex flex-col items-start gap-2 p-3 rounded-lg border transition-all duration-300 text-left cursor-pointer pr-8",
        isActive
          ? "bg-neutral-800/80 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          : "bg-neutral-900/30 border-neutral-800/50 hover:bg-neutral-800/50 hover:border-neutral-700"
      )}
    >
      {/* Active Indicator Line */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full"
        />
      )}

      <div className="flex items-center gap-2 w-full">
        <MessageSquare className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-neutral-500")} />
        <span className={cn("text-sm font-medium truncate w-full", isActive ? "text-neutral-200" : "text-neutral-400 group-hover:text-neutral-300")}>
          {conversation.title || "Untitled Conversation"}
        </span>
      </div>

      {conversation.summary_snippet && (
        <p className="text-xs text-neutral-500 line-clamp-2 pl-6">
          {conversation.summary_snippet}
        </p>
      )}
      
      <div className="flex items-center gap-1 pl-6 mt-1">
        <Clock className="w-3 h-3 text-neutral-600" />
        <span className="text-[10px] text-neutral-600">
            {formatRelativeTime(conversation.updated_at || conversation.created_at)}
        </span>
      </div>

      {/* Delete Action */}
      <div 
        className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <button className="p-1 text-neutral-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all">
              <Trash className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-black/90 border-neutral-800 backdrop-blur-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Conversation?</AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-400">
                Are you sure you want to delete this conversation? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700 hover:text-white">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                disabled={isPending}
                className="bg-red-600 text-white hover:bg-red-700 border-none"
              >
                {isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}
