"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Menu, Sparkles, User } from "lucide-react";

interface AppHeaderProps {
    isAuthenticated: boolean;
    userEmail?: string;
    isDetailView: boolean;
    onMenuOpen: () => void;
    onNewChat: () => void;
    onLogout: () => void;
    onSignIn: () => void;
}

export function AppHeader({
    isAuthenticated,
    userEmail,
    isDetailView,
    onMenuOpen,
    onNewChat,
    onLogout,
    onSignIn,
}: AppHeaderProps) {
    return (
        <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
            {/* Left side - Mobile Menu & New Summary */}
            <div className="pointer-events-auto flex items-center gap-2">
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
                        New Summary
                    </Button>
                )}
            </div>

            {/* Right side - User Controls */}
            <div className="flex items-center gap-4 pointer-events-auto">
                {isAuthenticated ? (
                    <>
                        <div className="text-white text-sm hidden md:block">
                            {userEmail}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onLogout}
                            title="Sign Out"
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
                        Sign In
                    </Button>
                )}
            </div>
        </div>
    );
}
