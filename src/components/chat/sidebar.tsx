"use client";

import { ConversationList } from "./conversation-list";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete?: (id: string) => void;
}

export function Sidebar({ className, selectedId, onSelect, onNewChat, onDelete }: SidebarProps) {
  return (
    <div className={cn("flex flex-col h-full bg-black/40 backdrop-blur-xl border-r border-white/10 w-64", className)}>
      <div className="p-4 border-b border-white/10">
        <Button 
          onClick={onNewChat} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
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
      <SheetContent className="bg-black/90 border-r border-white/10 p-0 w-72">
        <SheetHeader className="p-4 border-b border-white/10 text-left">
           <SheetTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                History
           </SheetTitle>
        </SheetHeader>
        
        <div className="p-4">
            <Button 
            onClick={handleNewChat} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
            <Plus className="w-4 h-4" />
            New Chat
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
