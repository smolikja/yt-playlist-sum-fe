/**
 * Application-wide constants for type-safe configuration.
 */

// Theme configuration
export const THEMES = {
    DARK: "dark",
    LIGHT: "light",
    SYSTEM: "system",
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

// LocalStorage keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    ANONYMOUS_ID: "anonymous_user_id",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Scroll behavior options
export const SCROLL_BEHAVIOR = {
    SMOOTH: "smooth",
    AUTO: "auto",
    INSTANT: "instant",
} as const;

export type ScrollBehaviorOption = (typeof SCROLL_BEHAVIOR)[keyof typeof SCROLL_BEHAVIOR];

// Icon positions for buttons
export const ICON_POSITION = {
    LEFT: "left",
    RIGHT: "right",
} as const;

export type IconPosition = (typeof ICON_POSITION)[keyof typeof ICON_POSITION];

// =============================================================================
// API Configuration
// =============================================================================

/**
 * Pagination configuration for API requests.
 * These match backend validation: limit 1-100, offset >= 0
 */
export const API_PAGINATION = {
    /** Default number of conversations per request */
    DEFAULT_LIMIT: 20,
    /** Maximum allowed limit per request */
    MAX_LIMIT: 100,
    /** Minimum allowed limit per request */
    MIN_LIMIT: 1,
    /** Default offset for pagination */
    DEFAULT_OFFSET: 0,
    /** Minimum allowed offset */
    MIN_OFFSET: 0,
} as const;

/**
 * API Rate limits (requests per minute).
 * Used for client-side throttling and user feedback.
 */
export const API_RATE_LIMITS = {
    /** POST /api/v1/summarize - 10 requests per minute */
    SUMMARIZE: 10,
    /** POST /api/v1/chat - 30 requests per minute */
    CHAT: 30,
} as const;

/**
 * Chat configuration matching backend validation.
 */
export const CHAT_CONFIG = {
    /** 
     * Number of recent messages used for LLM context.
     * Backend uses last 5 messages for context window.
     */
    CONTEXT_MESSAGE_COUNT: 5,
    /**
     * Maximum length of a chat message (1-10,000 characters).
     * Backend validates: message length 1-10,000
     */
    MAX_MESSAGE_LENGTH: 10_000,
    /** Minimum length of a chat message */
    MIN_MESSAGE_LENGTH: 1,
} as const;

// =============================================================================
// Job Configuration
// =============================================================================

/**
 * Configuration for background job processing.
 * These match backend settings for job management.
 */
export const JOB_CONFIG = {
    /** Polling interval in milliseconds (5 seconds) */
    POLL_INTERVAL_MS: 5000,
    /** Maximum concurrent jobs per user */
    MAX_CONCURRENT_JOBS: 3,
    /** Days until unclaimed jobs expire */
    EXPIRY_DAYS: 3,
} as const;

