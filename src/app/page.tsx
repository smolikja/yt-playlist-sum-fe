"use client";

import React, { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { InputWithGlow } from "@/components/ui/input-with-glow";
import { MagicButton } from "@/components/ui/magic-button";
import { Sparkles, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");

  const handleSummarize = () => {
    console.log("Summarizing:", url);
    // Add logic here
  };

  return (
    <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
          <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Youtube Playlist <br /> Summarizer
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            Transform hours of video content into concise, actionable summaries. 
            Just paste your playlist link below and let AI do the rest.
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 max-w-xl mx-auto flex flex-col items-center gap-6"
        >
             <div className="w-full relative">
                <InputWithGlow 
                    placeholder="Paste Youtube Playlist URL..." 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-12"
                />
                <PlaySquare className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
             </div>
             
             <MagicButton 
                title="Summarize Playlist"
                icon={<Sparkles className="w-4 h-4 text-[#E2CBFF]" />}
                position="right"
                handleClick={handleSummarize}
             />
        </motion.div>
      </div>

      {/* Grid Background */}
      <div className="absolute h-full w-full left-0 top-0 pointer-events-none flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}
