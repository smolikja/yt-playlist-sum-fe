"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { MagicButton } from "@/components/ui/magic-button";

interface LockedChatOverlayProps {
  onClaim: () => void;
}

export function LockedChatOverlay({ onClaim }: LockedChatOverlayProps) {
  return (
    <div className="relative w-full h-[500px] border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/30 backdrop-blur-sm flex items-center justify-center group">
      {/* Blurred Content Simulation */}
      <div className="absolute inset-0 p-6 opacity-30 blur-sm pointer-events-none select-none flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
            <div className={`w-2/3 h-16 rounded-xl ${i % 2 === 0 ? "bg-indigo-900/50" : "bg-neutral-800/50"}`} />
          </div>
        ))}
      </div>

      {/* Overlay Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center p-8 text-center max-w-sm mx-auto bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
      >
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
          <Lock className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">
          Unlock Interactive Chat
        </h3>
        
        <p className="text-neutral-400 mb-6 text-sm">
          Sign in to ask questions about this playlist, save your history, and get deeper insights.
        </p>

        <MagicButton 
          title="Sign in to Chat"
          icon={<Lock className="w-4 h-4" />}
          position="right"
          handleClick={onClaim}
          otherClasses="!bg-indigo-600/50 hover:!bg-indigo-600 !w-full"
        />
      </motion.div>

      {/* Background Beams/Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
    </div>
  );
}
