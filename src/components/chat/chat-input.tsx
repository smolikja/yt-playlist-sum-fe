import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="sticky bottom-0 z-30 w-full pt-4 pb-6 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
            <div className="relative flex items-center max-w-2xl mx-auto">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a follow-up question..."
                    disabled={isLoading}
                    className={cn(
                        "flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 py-2 pr-14 text-sm shadow-2xl transition-all",
                        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                />
                <div className="absolute right-1 top-1">
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        <SendHorizonal className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
