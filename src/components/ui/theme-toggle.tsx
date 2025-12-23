"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { THEMES } from "@/lib/constants";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations("theme");

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <div className="w-5 h-5" />
            </Button>
        );
    }

    // Toggle between light and dark based on resolved theme
    // If current is "system", use resolvedTheme to determine what to switch to
    const toggleTheme = () => {
        const currentTheme = theme === THEMES.SYSTEM ? resolvedTheme : theme;
        setTheme(currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
    };

    // Use resolvedTheme for display (handles "system" case)
    const isDark = resolvedTheme === THEMES.DARK;

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isDark ? t("dark") : t("light")}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

