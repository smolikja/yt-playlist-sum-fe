import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SendHorizonal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
    onSend: (message: string, useTranscripts: boolean) => void;
    isLoading: boolean;
    isEmpty: boolean;
}

export function ChatInput({ onSend, isLoading, isEmpty }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [isFastMode, setIsFastMode] = useState(true);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        // Inverse logic: Fast Mode (true) => use_transcripts (false)
        onSend(input, !isFastMode);
        setInput("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="sticky bottom-0 z-30 w-full pt-2 pb-6 bg-gradient-to-t from-black via-black/80 to-transparent px-4">
            <div className="max-w-2xl mx-auto flex items-center justify-center">

                <div className={cn(
                    "relative flex items-center w-full rounded-2xl",
                    isEmpty && "p-[2px] overflow-hidden" // Add padding for the border effect
                )}>
                    {isEmpty && (
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    )}

                    <div className={cn(
                        "relative flex items-center w-full h-full rounded-2xl",
                        // When empty (glow active), use solid dark background to contrast with glow
                        // When not empty, maintain original semi-transparent look
                        isEmpty ? "bg-zinc-950" : ""
                    )}>
                        {/* Integrated Toggle Button (Left) */}
                        <div className="absolute left-2 top-1.5 z-10">
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setIsFastMode(!isFastMode)}
                                            className={cn(
                                                "h-9 w-9 rounded-xl transition-all",
                                                isFastMode
                                                    ? "text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20"
                                                    : "text-zinc-500 hover:text-zinc-400 hover:bg-zinc-800"
                                            )}
                                        >
                                            <Zap className={cn("h-4 w-4", isFastMode && "fill-yellow-500")} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-zinc-900 border-zinc-800 text-zinc-100">
                                        <p className="font-semibold">{isFastMode ? "Fast Mode On" : "Deep Mode On"}</p>
                                        <p className="text-xs text-zinc-400">
                                            {isFastMode ? "Quick answers from summary" : "Detailed answers from transcripts"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isFastMode ? "Ask a quick question..." : "Ask a detailed question..."}
                            disabled={isLoading}
                            className={cn(
                                "flex h-12 w-full rounded-2xl py-2 text-sm shadow-2xl transition-all",
                                "pl-12 pr-14", // Padding for left toggle and right send button
                                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
                                isEmpty ? "border-transparent bg-transparent" : "border-zinc-200 dark:border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
                            )}
                        />

                        {/* Send Button (Right) */}
                        <div className="absolute right-1 top-1">
                            <Button
                                size="icon"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className={cn(
                                    "h-10 w-10 rounded-xl transition-all",
                                    input.trim()
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                                        : "bg-zinc-800 text-zinc-500"
                                )}
                            >
                                <SendHorizonal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
