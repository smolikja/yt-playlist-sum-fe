"use client";

import { useState } from "react";
import { useSummarize } from "@/hooks/use-summarize";
import { InputWithGlow } from "@/components/ui/input-with-glow";
import { MagicButton } from "@/components/ui/magic-button";
import { Spotlight } from "@/components/ui/spotlight";
import { MoveRight, Sparkles, Loader2, Youtube } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const { mutate, isPending, data, error } = useSummarize();

  // Simulated loading steps
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Fetching playlist data...",
    "Extracting video transcripts...",
    "Analyzing content with Gemini...",
    "Generating summary...",
  ];

  const handleSubmit = () => {
    if (!url) {
      toast.error("Please enter a playlist URL");
      return;
    }

    // Reset state
    setLoadingStep(0);

    // Start simulation
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2000);

    mutate(url, {
      onSuccess: () => {
        clearInterval(interval);
        toast.success("Summary generated successfully!");
      },
      onError: (err) => {
        clearInterval(interval);
        toast.error(err.message || "Failed to generate summary");
      },
    });
  };

  return (
    <div className="min-h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Playlist <br /> Summarizer
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg mx-auto">
            Transform hours of video content into concise, actionable summaries using advanced AI. Just paste your YouTube playlist URL below.
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-8">
          {/* Input Section */}
          <div className="relative z-10">
            <InputWithGlow
              placeholder="https://www.youtube.com/playlist?list=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isPending}
            />

            <div className="mt-6 flex justify-center">
              {isPending ? (
                <div className="flex flex-col items-center space-y-4 w-full">
                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-sm text-neutral-400 animate-pulse flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {loadingSteps[loadingStep]}
                  </p>
                </div>
              ) : (
                <MagicButton
                  title="Summarize Playlist"
                  icon={<Sparkles className="w-4 h-4" />}
                  position="right"
                  handleClick={handleSubmit}
                />
              )}
            </div>
          </div>

          {/* Result Section */}
          <AnimatePresence>
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full"
              >
                <div className="bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                  {/* Gradient Overlay */}
                  <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
                    <Youtube className="w-6 h-6 text-red-500" />
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {data.playlist_title || "Playlist Summary"}
                      </h2>
                      <p className="text-xs text-neutral-400">
                        {data.video_count} videos analyzed
                      </p>
                    </div>
                  </div>

                  {/* Markdown Content */}
                  <div className="prose prose-invert prose-indigo max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-p:text-neutral-300 prose-li:text-neutral-300">
                    <ReactMarkdown>
                      {data.summary_markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
