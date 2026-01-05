"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { InputWithGlow } from "@/components/ui/input-with-glow";
import { MagicButton } from "@/components/ui/magic-button";
import { LoadingProgress } from "./LoadingProgress";
import { JobsBanner } from "@/components/jobs";
import { useTranslations } from "next-intl";
import { ICON_POSITION } from "@/lib/constants";
import { JobResponse } from "@/lib/types";

interface HeroSectionProps {
    url: string;
    onUrlChange: (url: string) => void;
    onSubmit: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isPending: boolean;
    loadingStep: number;
    loadingSteps: string[];
    // Jobs props (optional - only present for authenticated users)
    jobs?: JobResponse[];
    onClaimJob?: (jobId: string) => void;
    onRetryJob?: (jobId: string) => void;
    onDeleteJob?: (jobId: string) => void;
    isClaimingJob?: boolean;
    isRetryingJob?: boolean;
    isDeletingJob?: boolean;
    pollingJobId?: string | null;
}

export function HeroSection({
    url,
    onUrlChange,
    onSubmit,
    onKeyDown,
    isPending,
    loadingStep,
    loadingSteps,
    jobs = [],
    onClaimJob,
    onRetryJob,
    onDeleteJob,
    isClaimingJob,
    isRetryingJob,
    isDeletingJob,
    pollingJobId,
}: HeroSectionProps) {
    const t = useTranslations("hero");

    return (
        <motion.div
            key="hero-section"
            layout
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex flex-col items-center w-full flex-1 justify-center"
        >
            <motion.div layout className="text-center mb-12">
                <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-800 to-slate-500 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50 pb-4">
                    {t("title")}
                </h1>
                <p className="mt-8 font-normal text-base text-muted-foreground max-w-lg mx-auto">
                    {t("description")}
                </p>
            </motion.div>

            <motion.div layout className="relative z-10 max-w-xl mx-auto w-full">
                {/* Jobs Banner - shown only when user has jobs */}
                {jobs.length > 0 && onClaimJob && onRetryJob && onDeleteJob && (
                    <JobsBanner
                        jobs={jobs}
                        onClaim={onClaimJob}
                        onRetry={onRetryJob}
                        onDelete={onDeleteJob}
                        isClaiming={isClaimingJob}
                        isRetrying={isRetryingJob}
                        isDeleting={isDeletingJob}
                        pollingJobId={pollingJobId}
                    />
                )}

                <InputWithGlow
                    placeholder={t("placeholder")}
                    value={url}
                    onChange={(e) => onUrlChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    disabled={isPending}
                />

                <div className="mt-6 flex justify-center">
                    {isPending ? (
                        <LoadingProgress currentStep={loadingStep} steps={loadingSteps} />
                    ) : (
                        <MagicButton
                            title={t("button")}
                            icon={<Sparkles className="w-4 h-4" />}
                            position={ICON_POSITION.RIGHT}
                            handleClick={onSubmit}
                        />
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

