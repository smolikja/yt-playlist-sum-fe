"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingProgressProps {
    currentStep: number;
    steps: string[];
}

export function LoadingProgress({ currentStep, steps }: LoadingProgressProps) {
    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-indigo-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <p className="text-sm text-neutral-400 animate-pulse flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {steps[currentStep]}
            </p>
        </div>
    );
}
