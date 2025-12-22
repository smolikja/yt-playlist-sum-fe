"use client";

import { RefObject } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
                "fixed top-0 right-0 z-50 px-4 py-3 md:py-4 bg-background/80 dark:bg-black/40 backdrop-blur-md border-b border-border/50 flex justify-between items-center",
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
                        className="md:hidden text-foreground"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                )}
                {!isAuthenticated && isDetailView && (
                    <Button
                        variant="ghost"
                        onClick={onNewChat}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t("newSummary")}
                    </Button>
                )}
            </div>

            {/* Right side - User Controls */}
            <div className="flex items-center gap-2 md:gap-4">
                <ThemeToggle />
                {isAuthenticated ? (
                    <>
                        <div className="text-foreground text-sm hidden md:block">
                            {userEmail}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onLogout}
                            title={t("signOut")}
                        >
                            <LogOut className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="ghost"
                        onClick={onSignIn}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <User className="w-5 h-5 mr-2" />
                        {t("signIn")}
                    </Button>
                )}
            </div>
        </motion.header>
    );
}

