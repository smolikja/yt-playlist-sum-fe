"use client";

import { useState } from "react";
import { useSummarize } from "@/hooks/use-summarize";
import { useAuth } from "@/hooks/use-auth";
import { useClaimConversation } from "@/hooks/use-claim";
import { useConversation } from "@/hooks/use-conversation";
import { InputWithGlow } from "@/components/ui/input-with-glow";
import { MagicButton } from "@/components/ui/magic-button";
import { Spotlight } from "@/components/ui/spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { Sparkles, Loader2, Youtube, LogOut, User, Menu } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContainer } from "@/components/chat/chat-container";
import { LockedChatOverlay } from "@/components/chat/locked-chat-overlay";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebar } from "@/components/chat/sidebar";
import { Message } from "@/hooks/use-chat";
import { Role } from "@/lib/types";

export default function Home() {
  const [url, setUrl] = useState("");
  const { mutate, isPending, data: summaryData } = useSummarize();
  const { user, isAuthenticated, logout } = useAuth();
  const { mutate: claimConversation, isPending: isClaiming } = useClaimConversation();

  // Navigation State
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch active conversation details
  const { data: conversationData, isLoading: isLoadingConversation } = useConversation(activeConversationId || "");

  const handleLogout = () => {
    logout();
    setActiveConversationId(null);
    setUrl("");
  };

  // Auth Modal State
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Simulated loading steps for new summary
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

    setLoadingStep(0);
    setActiveConversationId(null); // Ensure we are in "new" mode technically, but loading

    // Start simulation
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2000);

    mutate(url, {
      onSuccess: (result) => {
        clearInterval(interval);
        toast.success("Summary generated successfully!");
        // Set the active conversation to the new one
        setActiveConversationId(result.conversation_id);
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

  const handleAuthSuccess = () => {
    // If we just generated a summary (activeConversationId is set), try to claim it
    if (activeConversationId) {
        claimConversation(activeConversationId, {
            onSuccess: () => {
                toast.success("Conversation claimed successfully!");
            },
            onError: () => {
                toast.error("Failed to claim conversation.");
            }
        });
    }
  };

  const handleDeleteConversation = (id: string) => {
    if (activeConversationId === id) {
        setActiveConversationId(null);
    }
  };

    // Logic to determine what to display

    // 1. If activeConversationId is set:

    //    - If loading conversation: Show loader (unless we have summaryData)

    //    - If conversation loaded: Show Summary + Chat

    // 2. If no activeConversationId:

    //    - Show Input (New Summary)

    

    const isDetailView = !!activeConversationId;

  

    // Determine which data to show

    // If we just summarized, we might have summaryData but no conversationData yet (or fetch failed/is pending)

    const isJustSummarized = summaryData?.conversation_id === activeConversationId;

    

    const displayTitle = conversationData?.title || (isJustSummarized ? summaryData?.playlist_title : null) || "Playlist Summary";

    const displaySummary = conversationData?.summary || (isJustSummarized ? summaryData?.summary_markdown : null);

    const displayDate = conversationData?.created_at ? new Date(conversationData.created_at).toLocaleDateString() : "Just now";

    

    // Transform messages for chat container

    const initialMessages: Message[] = conversationData?.messages.map(m => ({

          role: m.role as Role,

          content: m.content

      })) || [];

  

    return (

      <div className="flex h-screen w-full overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">

        

        {/* Sidebar (Desktop) */}

        {isAuthenticated && (

          <div className="hidden md:flex h-full">

              <Sidebar 

                  selectedId={activeConversationId} 

                  onSelect={setActiveConversationId} 

                  onNewChat={() => setActiveConversationId(null)}
                  
                  onDelete={handleDeleteConversation}

              />

          </div>

        )}

  

        {/* Mobile Sidebar */}

        {isAuthenticated && (

          <MobileSidebar 

              open={isMobileMenuOpen} 

              onOpenChange={setIsMobileMenuOpen}

              selectedId={activeConversationId}

              onSelect={setActiveConversationId}

              onNewChat={() => setActiveConversationId(null)}
              
              onDelete={handleDeleteConversation}

          />

        )}

  

        <main className="flex-1 h-full overflow-y-auto relative w-full">

            <Spotlight

              className="-top-40 left-0 md:left-60 md:-top-20 fixed"

              fill="white"

            />

  

              {/* Header / User Controls */}

              <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">

                   {/* Mobile Menu Trigger */}

                  <div className="pointer-events-auto">

                      {isAuthenticated && (

                          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-white">

                              <Menu className="w-5 h-5" />

                          </Button>

                      )}

                  </div>

  

                  <div className="flex items-center gap-4 pointer-events-auto">

                      {isAuthenticated ? (

                          <>

                              <div className="text-white text-sm hidden md:block">

                                  {user?.email}

                              </div>

                                                            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign Out">

                                                                <LogOut className="w-5 h-5 text-neutral-400 hover:text-white" />

                                                            </Button>

                          </>

                      ) : (

                          <Button variant="ghost" onClick={() => setAuthModalOpen(true)} className="text-neutral-400 hover:text-white">

                              <User className="w-5 h-5 mr-2" />

                              Sign In

                          </Button>

                      )}

                  </div>

              </div>

  

              <motion.div

                  layout

                  className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-10 h-full flex flex-col"

                  transition={{ type: "spring", stiffness: 300, damping: 30 }}

              >

              <motion.div
                  layout
                  className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-10 h-full flex flex-col"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                  <AnimatePresence mode="wait">
                  {( (!isAuthenticated || !isDetailView) ) && (
                      <motion.div 
                          key="hero-section"
                          layout
                          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className={`flex flex-col items-center w-full ${!isDetailView ? "flex-1 justify-center" : "mb-12 mt-8"}`}
                      >

                          <motion.div layout className="text-center mb-12">
                            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 pb-4">
                                YouTube Playlist Summarizer
                            </h1>
                            <p className="mt-8 font-normal text-base text-neutral-300 max-w-lg mx-auto">
                                Transform hours of video content into concise, actionable summaries using advanced AI. Just paste your YouTube playlist URL below.
                            </p>
                          </motion.div>
  

                          <motion.div layout className="relative z-10 max-w-xl mx-auto w-full">
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
                      </motion.div>
                  )}

                  {isDetailView && (
                      <motion.div 
                          key="detail-view"
                          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                          transition={{ duration: 0.35, ease: "easeInOut", delay: 0.1 }}
                          className="w-full max-w-4xl mx-auto pb-10"
                      >
                          {(isLoadingConversation && !isJustSummarized) ? (
                               <div className="flex h-64 items-center justify-center">
                                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                              </div>
                          ) : (displaySummary) ? (
                              <div>
                                  {/* Summary Card */}
                                  <div className="bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden group mb-8">
                                      <BorderBeam size={300} duration={20} delay={0} />
                                      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
  
                                      <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
                                          <Youtube className="w-6 h-6 text-red-500" />
                                          <div>
                                              <h2 className="text-lg font-semibold text-white">
                                                  {displayTitle}
                                              </h2>
                                              <p className="text-xs text-neutral-400">
                                                  {displayDate}
                                              </p>
                                          </div>
                                      </div>
                                      
                                      <div className="prose prose-lg prose-invert prose-indigo max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-neutral-300 prose-li:text-neutral-300">
                                          <ReactMarkdown>
                                          {displaySummary}
                                          </ReactMarkdown>
                                      </div>
                                  </div>
  
                                  {/* Chat Interface */}
                                  {isAuthenticated ? (
                                      isClaiming ? (
                                          <div className="h-[200px] flex items-center justify-center border border-neutral-800 rounded-xl bg-neutral-900/50">
                                              <div className="flex flex-col items-center gap-2">
                                                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                                  <p className="text-neutral-400">Syncing conversation...</p>
                                              </div>
                                          </div>
                                      ) : (
                                          <ChatContainer 
                                              conversationId={activeConversationId!} 
                                              initialMessages={initialMessages} 
                                          />
                                      )
                                  ) : (
                                      <LockedChatOverlay onClaim={() => setAuthModalOpen(true)} />
                                  )}
                              </div>
                          ) : (
                              <div className="text-center text-neutral-500 mt-20">
                                  Failed to load conversation.
                              </div>
                          )}
                      </motion.div>
                  )}
                  </AnimatePresence>

              </motion.div>

              </motion.div>

  

          <AuthModal 

              isOpen={isAuthModalOpen} 

              onClose={() => setAuthModalOpen(false)} 

              onSuccess={handleAuthSuccess}

          />

        </main>

      </div>

    );

  }

  