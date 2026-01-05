"use client";

import { motion } from "framer-motion";
import { Clock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { JobStatus } from "@/lib/types";

interface JobStatusIndicatorProps {
    status: JobStatus;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
};

/**
 * Animated status indicator for job progress.
 * Uses different icons and animations based on job status.
 */
export function JobStatusIndicator({
    status,
    size = "md",
    className
}: JobStatusIndicatorProps) {
    const iconClass = cn(sizeClasses[size], className);

    switch (status) {
        case "pending":
            return (
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Clock className={cn(iconClass, "text-amber-400")} />
                </motion.div>
            );

        case "running":
            return (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Loader2 className={cn(iconClass, "text-indigo-400")} />
                </motion.div>
            );

        case "completed":
            return (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <CheckCircle className={cn(iconClass, "text-emerald-400")} />
                </motion.div>
            );

        case "failed":
            return (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <XCircle className={cn(iconClass, "text-red-400")} />
                </motion.div>
            );

        default:
            return null;
    }
}
