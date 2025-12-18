"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Mail, Lock } from "lucide-react";
import { InputWithGlow } from "@/components/ui/input-with-glow";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const { loginAsync, registerAsync, isLoggingIn, isRegistering } = useAuth();
  const isLoading = isLoggingIn || isRegistering;

  // Reset state when view changes or modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  }, [isOpen]);

  const toggleView = () => {
    setView(view === "login" ? "register" : "login");
    // Optional: Clear passwords on toggle
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleInputChange = (setter: (val: string) => void, field: keyof typeof errors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (errors[field] || errors.general) {
      setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (view === "register") {
      if (password !== confirmPassword) {
        setErrors({ password: "Passwords do not match" });
        return;
      }
      if (password.length < 8) {
        setErrors({ password: "Password must be at least 8 characters" });
        return;
      }
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
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Authentication failed";
      const newErrors: typeof errors = {};

      if (msg.includes("REGISTER_USER_ALREADY_EXISTS")) {
        newErrors.email = "This email is already registered.";
      } else if (msg.includes("LOGIN_BAD_CREDENTIALS")) {
        newErrors.general = "Invalid email or password.";
      } else if (msg.includes("value is not a valid email address")) {
        newErrors.email = "Please enter a valid email address.";
      } else if (msg.toLowerCase().includes("password")) {
        newErrors.password = msg;
      } else {
        newErrors.general = msg;
      }

      setErrors(newErrors);
      // Fallback toast for general errors if no specific field error is set (or just always show generic toast if critical)
      if (newErrors.general) {
        toast.error(newErrors.general);
      }
    }
  };

  const passwordsMatch = !confirmPassword || password === confirmPassword;

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
                    onChange={handleInputChange(setEmail, 'email')}
                    className={cn("pl-10 transition-colors", errors.email ? "focus-visible:ring-red-500/50 text-red-100" : "")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 ml-1">
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500 z-10" />
                  <InputWithGlow
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={handleInputChange(setPassword, 'password')}
                    className={cn("pl-10 transition-colors", errors.password ? "focus-visible:ring-red-500/50 text-red-100" : "")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 ml-1">
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password Field (Register Only) */}
              <AnimatePresence initial={false}>
                {view === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-sm font-medium text-zinc-400 ml-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500 z-10" />
                      <InputWithGlow
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        className={cn(
                          "pl-10 transition-colors",
                          !passwordsMatch ? "focus-visible:ring-red-500/50 text-red-100" : ""
                        )}
                        disabled={isLoading}
                      />
                    </div>
                    {!passwordsMatch && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-400 ml-1"
                      >
                        Passwords do not match
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

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
                  onClick={toggleView}
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
