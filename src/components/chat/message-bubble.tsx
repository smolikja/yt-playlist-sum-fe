import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Role } from "@/lib/types";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface MessageBubbleProps {
    role: Role;
    content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
    const isUser = role === Role.USER;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex w-full gap-3",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                isUser ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-purple-500/10 border-purple-500/20 text-purple-500"
            )}>
                {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </div>

            {/* Message Content */}
            <div className={cn(
                "relative max-w-[calc(100%-3rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                isUser
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
            )}>
                <MarkdownContent
                    content={content}
                    variant={isUser ? "user" : "chat"}
                />
            </div>
        </motion.div>
    );
}
