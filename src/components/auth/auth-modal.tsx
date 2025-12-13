"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Mail, Lock } from "lucide-react";
import { InputWithGlow } from "@/components/ui/input-with-glow";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialView?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, onSuccess, initialView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { loginAsync, registerAsync, isLoggingIn, isRegistering } = useAuth();
  const isLoading = isLoggingIn || isRegistering;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (view === "register") {
        await registerAsync({ email, password });
        toast.success("Account created! Logging you in...");
        // Auto login after register
        await loginAsync({ username: email, password });
      } else {
        await loginAsync({ username: email, password });
      }
      
      toast.success(view === "register" ? "Welcome!" : "Welcome back!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
        // Error handling is partly done in fetchAPI but let's be safe
      toast.error(error.message || "Authentication failed");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">
                {view === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500 z-10" />
                  <InputWithGlow
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500 z-10" />
                  <InputWithGlow
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg font-medium shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
                    disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    view === "login" ? "Sign In" : "Sign Up"
                  )}
                </Button>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setView(view === "login" ? "register" : "login")}
                  className="text-sm text-zinc-500 hover:text-indigo-400 transition-colors"
                  disabled={isLoading}
                >
                  {view === "login"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
