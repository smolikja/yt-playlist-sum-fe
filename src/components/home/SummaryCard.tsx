"use client";

import { Youtube } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BorderBeam } from "@/components/ui/border-beam";

interface SummaryCardProps {
    title: string;
    date: string;
    summary: string;
}

export function SummaryCard({ title, date, summary }: SummaryCardProps) {
    return (
        <div className="bg-card/80 dark:bg-neutral-900/50 border border-border backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden group mb-8">
            <BorderBeam size={300} duration={20} delay={0} />
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <Youtube className="w-6 h-6 text-red-500" />
                <div>
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    <p className="text-xs text-muted-foreground">{date}</p>
                </div>
            </div>

            <div className="prose prose-lg dark:prose-invert prose-indigo max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-muted-foreground prose-li:text-muted-foreground">
                <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
        </div>
    );
}
