"use client";

import { useState, KeyboardEvent, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SendHorizonal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { CHAT_CONFIG } from "@/lib/constants";

interface ChatInputProps {
    onSend: (message: string, useRag: boolean) => void;
    isLoading: boolean;
    onInteract?: () => void;
}

export function ChatInput({ onSend, isLoading, onInteract }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [isFastMode, setIsFastMode] = useState(true);
    const t = useTranslations("chat");

    // Character count and validation
    const charCount = input.length;
    const maxLength = CHAT_CONFIG.MAX_MESSAGE_LENGTH;
    const warningThreshold = Math.floor(maxLength * 0.9); // 90% = 9000 chars

    const charCountState = useMemo(() => {
        if (charCount >= maxLength) return "error";
        if (charCount >= warningThreshold) return "warning";
        return "normal";
    }, [charCount, maxLength, warningThreshold]);

    const isValidLength = charCount >= CHAT_CONFIG.MIN_MESSAGE_LENGTH && charCount <= maxLength;

    const handleSend = () => {
        if (!input.trim() || isLoading || !isValidLength) return;
        // Inverse logic: Fast Mode (true) => use_rag (false)
        onSend(input, !isFastMode);
        setInput("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (onInteract) {
            e.target.blur();
            onInteract();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow typing but respect maxLength
        if (value.length <= maxLength) {
            setInput(value);
        }
    };

    return (
        <div className="sticky bottom-0 z-30 w-full pt-2 pb-6 bg-gradient-to-t from-background via-background/80 to-transparent dark:from-black dark:via-black/80 px-4">
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-1">

                <div className="relative flex items-center w-full rounded-2xl p-[2px] overflow-hidden">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

                    <div className="relative flex items-center w-full h-full rounded-2xl bg-card dark:bg-zinc-950">
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
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            )}
                                        >
                                            <Zap className={cn("h-4 w-4", isFastMode && "fill-yellow-500")} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-card dark:bg-zinc-900 border-border dark:border-zinc-800 text-foreground dark:text-zinc-100">
                                        <p className="font-semibold">{isFastMode ? t("fastModeOn") : t("deepModeOn")}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {isFastMode ? t("fastModeDesc") : t("deepModeDesc")}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            placeholder={t("placeholder")}
                            disabled={isLoading}
                            maxLength={maxLength}
                            className={cn(
                                "flex h-12 w-full rounded-2xl py-2 text-base shadow-2xl transition-all",
                                "pl-12 pr-14", // Padding for left toggle and right send button
                                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
                                "border-transparent bg-transparent",
                                charCountState === "error" && "text-red-500"
                            )}
                        />

                        {/* Send Button (Right) */}
                        <div className="absolute right-1 top-1">
                            <Button
                                size="icon"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading || !isValidLength}
                                className={cn(
                                    "h-10 w-10 rounded-xl transition-all",
                                    input.trim() && isValidLength
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                                        : "bg-muted dark:bg-zinc-800 text-muted-foreground"
                                )}
                            >
                                <SendHorizonal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Character Counter - only visible when typing */}
                {charCount > 0 && (
                    <div className="w-full flex justify-end px-2">
                        <span
                            className={cn(
                                "text-xs font-medium transition-colors",
                                charCountState === "normal" && "text-muted-foreground",
                                charCountState === "warning" && "text-amber-500",
                                charCountState === "error" && "text-red-500"
                            )}
                        >
                            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

