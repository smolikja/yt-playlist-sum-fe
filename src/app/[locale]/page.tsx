"use client";

import { useRef } from "react";
import { useHomeView } from "@/hooks/use-home-view";
import { HeroSection, AppHeader, DetailView } from "@/components/home";
import { Sidebar, MobileSidebar } from "@/components/chat/sidebar";
import { AuthModal } from "@/components/auth/auth-modal";
import { Spotlight } from "@/components/ui/spotlight";
import { motion, AnimatePresence } from "framer-motion";
import { use } from "react";

type Props = {
    params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
    const { locale } = use(params);
    const mainRef = useRef<HTMLElement>(null);

    const {
        // State
        url,
        activeConversationId,
        loadingStep,
        loadingSteps,
        isMobileMenuOpen,
        isAuthModalOpen,
        authModalContextMessage,
        isSummarizing,
        isClaiming,
        isLoadingConversation,
        // User data
        user,
        isAuthenticated,
        // Computed
        isDetailView,
        isJustSummarized,
        displayTitle,
        displaySummary,
        displayDate,
        displayPlaylistUrl,
        initialMessages,
        // Jobs data
        jobs,
        isClaimingJob,
        isRetrying,
        isDeleting,
        pollingJobId,
        // Actions
        setUrl,
        setMobileMenuOpen,
        setAuthModalOpen,
        handleCloseAuthModal,
        handleSubmit,
        handleKeyDown,
        handleNewChat,
        handleLogout,
        handleSelectConversation,
        handleAuthSuccess,
        handleDeleteConversation,
        // Job actions
        handleClaimJob,
        handleRetryJob,
        handleDeleteJob,
    } = useHomeView();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background dark:bg-black/[0.96] antialiased bg-grid-foreground/[0.02] dark:bg-grid-white/[0.02]">
            {/* Desktop Sidebar */}
            {isAuthenticated && (
                <div className="hidden md:flex h-full">
                    <Sidebar
                        selectedId={activeConversationId}
                        onSelect={handleSelectConversation}
                        onNewChat={handleNewChat}
                        onDelete={handleDeleteConversation}
                    />
                </div>
            )}

            {/* Mobile Sidebar */}
            {isAuthenticated && (
                <MobileSidebar
                    open={isMobileMenuOpen}
                    onOpenChange={setMobileMenuOpen}
                    selectedId={activeConversationId}
                    onSelect={handleSelectConversation}
                    onNewChat={handleNewChat}
                    onDelete={handleDeleteConversation}
                />
            )}

            <main ref={mainRef} className="flex-1 h-full overflow-y-auto relative w-full">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20 fixed"
                    fill="white"
                />

                {/* Header */}
                <AppHeader
                    isAuthenticated={isAuthenticated}
                    userEmail={user?.email}
                    isDetailView={isDetailView}
                    onMenuOpen={() => setMobileMenuOpen(true)}
                    onNewChat={handleNewChat}
                    onLogout={handleLogout}
                    onSignIn={() => setAuthModalOpen(true)}
                    scrollContainerRef={mainRef}
                />

                {/* Main Content */}
                <motion.div
                    layout
                    className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-24 md:pt-28 h-full flex flex-col"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <AnimatePresence mode="wait">
                        {!isDetailView && (
                            <HeroSection
                                url={url}
                                onUrlChange={setUrl}
                                onSubmit={handleSubmit}
                                onKeyDown={handleKeyDown}
                                isPending={isSummarizing}
                                loadingStep={loadingStep}
                                loadingSteps={loadingSteps}
                                // Job props for authenticated users
                                jobs={isAuthenticated ? jobs : undefined}
                                onClaimJob={isAuthenticated ? handleClaimJob : undefined}
                                onRetryJob={isAuthenticated ? handleRetryJob : undefined}
                                onDeleteJob={isAuthenticated ? handleDeleteJob : undefined}
                                isClaimingJob={isClaimingJob}
                                isRetryingJob={isRetrying}
                                isDeletingJob={isDeleting}
                                pollingJobId={pollingJobId}
                            />
                        )}

                        {isDetailView && (
                            <DetailView
                                conversationId={activeConversationId!}
                                isLoading={isLoadingConversation}
                                isJustSummarized={isJustSummarized}
                                displayTitle={displayTitle}
                                displayDate={displayDate}
                                displaySummary={displaySummary}
                                playlistUrl={displayPlaylistUrl}
                                initialMessages={initialMessages}
                                isAuthenticated={isAuthenticated}
                                isClaiming={isClaiming}
                                onAuthRequired={() => setAuthModalOpen(true)}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Auth Modal */}
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={handleCloseAuthModal}
                    onSuccess={handleAuthSuccess}
                    contextMessage={authModalContextMessage}
                />
            </main>
        </div>
    );
}
