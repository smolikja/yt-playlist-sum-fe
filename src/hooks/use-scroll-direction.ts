"use client";

import { useState, useEffect, useCallback, RefObject } from "react";

/**
 * Custom hook that detects scroll direction and returns visibility state.
 * Header should be visible when:
 * - Scrolling up (any amount)
 * - At the top of the page (scrollY < threshold)
 * 
 * @param scrollContainerRef - Optional ref to scroll container. If not provided, uses window.
 * @param threshold - Scroll position threshold to always show header (default 10px)
 */
export function useScrollDirection(
    scrollContainerRef?: RefObject<HTMLElement | null>,
    threshold = 10
) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        const currentScrollY = scrollContainerRef?.current?.scrollTop ?? window.scrollY;

        // Always show at top of page
        if (currentScrollY < threshold) {
            setIsVisible(true);
            setLastScrollY(currentScrollY);
            return;
        }

        // Scrolling up = show, scrolling down = hide
        const isScrollingUp = currentScrollY < lastScrollY;
        setIsVisible(isScrollingUp);
        setLastScrollY(currentScrollY);
    }, [lastScrollY, threshold, scrollContainerRef]);

    useEffect(() => {
        const scrollElement = scrollContainerRef?.current ?? window;

        // Throttle scroll events for performance
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        scrollElement.addEventListener("scroll", onScroll, { passive: true });
        return () => scrollElement.removeEventListener("scroll", onScroll);
    }, [handleScroll, scrollContainerRef]);

    return isVisible;
}

