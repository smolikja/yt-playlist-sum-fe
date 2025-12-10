"use client";

import { useState } from "react";
import { useSummarize } from "@/hooks/use-summarize";
import { InputWithGlow } from "@/components/ui/input-with-glow";
import { MagicButton } from "@/components/ui/magic-button";
import { Spotlight } from "@/components/ui/spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { Sparkles, Loader2, Youtube, X } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContainer } from "@/components/chat/chat-container";

export default function Home() {
  const [url, setUrl] = useState("");
  const { mutate, isPending, data, error } = useSummarize();

  // Track successful URL to toggle visibility
  const [lastSummarizedUrl, setLastSummarizedUrl] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

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

    // If new URL or re-summarizing, reset and start
    setLoadingStep(0);
    setShowSummary(false); // Hide potentially old summary first

    // Start simulation
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2000);

    mutate(url, {
      onSuccess: () => {
        clearInterval(interval);
        setLastSummarizedUrl(url);
        setShowSummary(true);
        toast.success("Summary generated successfully!");
      },
      onError: (err) => {
        clearInterval(interval);
        toast.error(err.message || "Failed to generate summary");
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isPending) {
      handleSubmit();
    }
  };

  // derived state for button text/icon
  const isShowingCurrentSummary = showSummary && url === lastSummarizedUrl && !!data;

  return (
    <div className="min-h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 fixed"
        fill="white"
      />

      <motion.div
        layout
        className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          layout
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 pt-10 md:pt-20 pb-4">
            YouTube Playlist Summarizer
          </h1>
          <p className="mt-8 font-normal text-base text-neutral-300 max-w-lg mx-auto">
            Transform hours of video content into concise, actionable summaries using advanced AI. Just paste your YouTube playlist URL below.
          </p>
        </motion.div>

        <div className="w-full space-y-8">
          {/* Input Section */}
          <motion.div layout className="relative z-10 max-w-xl mx-auto">
            <InputWithGlow
              placeholder="https://www.youtube.com/playlist?list=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
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
          </motion.div>

          {/* Result Section */}
          <AnimatePresence mode="popLayout">
            {isShowingCurrentSummary && data && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  duration: 0.4
                }}
                className="w-full max-w-4xl mx-auto"
              >
                <div className="bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                  {/* Border Beam Effect - Dynamic Duration */}
                  {/* Base 15s + 1s per 100 characters of summary */}
                  <BorderBeam
                    size={300}
                    duration={Math.max(20, 15 + (data.summary_markdown.length / 100))}
                    delay={0}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

                  {/* Header */}
                  <a
                    href={lastSummarizedUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4 hover:bg-white/5 transition-colors p-2 rounded-md -mx-2"
                  >
                    <Youtube className="w-6 h-6 text-red-500" />
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {data.playlist_title || "Playlist Summary"}
                      </h2>
                      <p className="text-xs text-neutral-400">
                        {data.video_count} videos analyzed
                      </p>
                    </div>
                  </a>
                  {/* Markdown Content */}
                  <div className="prose prose-lg prose-invert prose-indigo max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-neutral-300 prose-li:text-neutral-300">
                    <ReactMarkdown>
                      {data.summary_markdown}
                    </ReactMarkdown>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Section */}
          <AnimatePresence>
            {isShowingCurrentSummary && data && (
              <ChatContainer conversationId={data.conversation_id} />
            )}
          </AnimatePresence>
        </div>

      </motion.div >
    </div >
  );
}
