"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { InputWithGlow } from "@/components/ui/input-with-glow";
import { MagicButton } from "@/components/ui/magic-button";
import { LoadingProgress } from "./LoadingProgress";
import { useTranslations } from "next-intl";

interface HeroSectionProps {
    url: string;
    onUrlChange: (url: string) => void;
    onSubmit: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isPending: boolean;
    loadingStep: number;
    loadingSteps: string[];
}

export function HeroSection({
    url,
    onUrlChange,
    onSubmit,
    onKeyDown,
    isPending,
    loadingStep,
    loadingSteps,
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
                <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 pb-4">
                    {t("title")}
                </h1>
                <p className="mt-8 font-normal text-base text-neutral-300 max-w-lg mx-auto">
                    {t("description")}
                </p>
            </motion.div>

            <motion.div layout className="relative z-10 max-w-xl mx-auto w-full">
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
                            position="right"
                            handleClick={onSubmit}
                        />
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
