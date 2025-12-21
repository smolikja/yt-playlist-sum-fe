"use client";

import { RefObject } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Sparkles, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
    isAuthenticated: boolean;
    userEmail?: string;
    isDetailView: boolean;
    onMenuOpen: () => void;
    onNewChat: () => void;
    onLogout: () => void;
    onSignIn: () => void;
    scrollContainerRef?: RefObject<HTMLElement | null>;
}

export function AppHeader({
    isAuthenticated,
    userEmail,
    isDetailView,
    onMenuOpen,
    onNewChat,
    onLogout,
    onSignIn,
    scrollContainerRef,
}: AppHeaderProps) {
    const t = useTranslations("header");
    const isHeaderVisible = useScrollDirection(scrollContainerRef);

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: isHeaderVisible ? 0 : "-100%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={cn(
                "fixed top-0 right-0 z-50 px-4 py-3 md:py-4 bg-black/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center",
                isAuthenticated ? "left-0 md:left-64" : "left-0"
            )}
        >
            {/* Left side - Mobile Menu & New Summary */}
            <div className="flex items-center gap-2">
                {isAuthenticated && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMenuOpen}
                        className="md:hidden text-white"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                )}
                {!isAuthenticated && isDetailView && (
                    <Button
                        variant="ghost"
                        onClick={onNewChat}
                        className="text-neutral-400 hover:text-white"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t("newSummary")}
                    </Button>
                )}
            </div>

            {/* Right side - User Controls */}
            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <div className="text-white text-sm hidden md:block">
                            {userEmail}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onLogout}
                            title={t("signOut")}
                        >
                            <LogOut className="w-5 h-5 text-neutral-400 hover:text-white" />
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="ghost"
                        onClick={onSignIn}
                        className="text-neutral-400 hover:text-white"
                    >
                        <User className="w-5 h-5 mr-2" />
                        {t("signIn")}
                    </Button>
                )}
            </div>
        </motion.header>
    );
}
