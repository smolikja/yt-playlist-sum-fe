/**
 * Centralized TanStack Query Key Factory
 * Provides type-safe query keys for all queries in the application.
 */
export const queryKeys = {
    currentUser: ["currentUser"] as const,
    conversations: {
        all: ["conversations"] as const,
        detail: (id: string) => ["conversation", id] as const,
    },
} as const;
