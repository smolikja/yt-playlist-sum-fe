"use client";

import { ConversationList } from "./conversation-list";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SidebarProps {
  className?: string;
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete?: (id: string) => void;
}

export function Sidebar({ className, selectedId, onSelect, onNewChat, onDelete }: SidebarProps) {
  const t = useTranslations("sidebar");

  return (
    <div className={cn("flex flex-col h-full bg-background/80 dark:bg-black/40 backdrop-blur-xl border-r border-border w-64", className)}>
      <div className="p-4 border-b border-border">
        <Button
          onClick={onNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("newChat")}
        </Button>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        <ConversationList
          selectedId={selectedId || undefined}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete?: (id: string) => void;
}

export function MobileSidebar({ open, onOpenChange, selectedId, onSelect, onNewChat, onDelete }: MobileSidebarProps) {
  const t = useTranslations("sidebar");

  const handleNewChat = () => {
    onNewChat();
    onOpenChange(false);
  };

  const handleSelect = (id: string) => {
    onSelect(id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background/95 dark:bg-black/90 border-r border-border p-0 w-72">
        <SheetHeader className="p-4 border-b border-border text-left">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            {t("history")}
          </SheetTitle>
        </SheetHeader>

        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("newChat")}
          </Button>
        </div>

        <div className="flex-1 overflow-hidden pb-4">
          <ConversationList
            selectedId={selectedId || undefined}
            onSelect={handleSelect}
            onDelete={onDelete}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
