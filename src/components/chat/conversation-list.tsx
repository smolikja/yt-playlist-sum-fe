"use client";

import { useConversations } from "@/hooks/use-conversations";
import { ConversationItem } from "./conversation-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationResponse } from "@/lib/types";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ConversationListProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ConversationList({ selectedId, onSelect, onDelete }: ConversationListProps) {
  const { data: conversations, isLoading, error } = useConversations();
  const t = useTranslations("conversations");
  const tTime = useTranslations("time");

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full bg-neutral-900/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-sm text-center">{t("loadFailed")}</div>;
  }

  if (!conversations || conversations.length === 0) {
    return <div className="p-4 text-neutral-500 text-sm text-center">{t("noHistory")}</div>;
  }

  const grouped = groupConversations(conversations, tTime);

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6 pb-10">
        {Object.entries(grouped).map(([label, items]) => (
          items.length > 0 && (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xs font-semibold text-neutral-500 mb-3 px-1 uppercase tracking-wider">
                {label}
              </h3>
              <div className="space-y-2">
                {items.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={selectedId === conv.id}
                    onClick={() => onSelect(conv.id)}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </motion.div>
          )
        ))}
      </div>
    </ScrollArea>
  );
}

function groupConversations(
  conversations: ConversationResponse[],
  t: (key: string) => string
) {
  // Sort by updated_at descending
  const sorted = [...conversations].sort((a, b) =>
    new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
  );

  const labels = {
    today: t("today"),
    yesterday: t("yesterday"),
    previous7Days: t("previous7Days"),
    older: t("older"),
  };

  const groups: Record<string, ConversationResponse[]> = {
    [labels.today]: [],
    [labels.yesterday]: [],
    [labels.previous7Days]: [],
    [labels.older]: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  sorted.forEach((conv) => {
    const date = new Date(conv.updated_at || conv.created_at);
    // Reset time for comparison
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (compareDate.getTime() === today.getTime()) {
      groups[labels.today].push(conv);
    } else if (compareDate.getTime() === yesterday.getTime()) {
      groups[labels.yesterday].push(conv);
    } else if (compareDate > lastWeek) {
      groups[labels.previous7Days].push(conv);
    } else {
      groups[labels.older].push(conv);
    }
  });

  return groups;
}
