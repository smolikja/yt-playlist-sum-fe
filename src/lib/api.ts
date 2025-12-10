import { v4 as uuidv4 } from "uuid";
import { PlaylistRequest, SummaryResult, ChatRequest, ChatResponse } from "./types";

const ANONYMOUS_ID_KEY = "x-user-id";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Retrieves the anonymous user ID from localStorage or generates a new one.
 */
export function getOrCreateAnonymousId(): string {
    if (typeof window === "undefined") {
        return ""; // Server-side safety
    }

    let id = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (!id) {
        id = uuidv4();
        localStorage.setItem(ANONYMOUS_ID_KEY, id);
    }
    return id || ""; // Ensure never null
}

/**
 * Generic fetch wrapper with error handling and default headers.
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const userId = getOrCreateAnonymousId();

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        "x-user-id": userId,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Try to parse error message from JSON
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) {
                if (Array.isArray(errorData.detail)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    errorMessage = errorData.detail.map((e: any) => e.msg).join(", ");
                } else {
                    errorMessage = errorData.detail;
                }
            }
        } catch {
            // If parsing fails, use default message
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

/**
 * Summarizes a YouTube playlist given its URL.
 */
export async function summarizePlaylist(url: string): Promise<SummaryResult> {
    return fetchAPI<SummaryResult>("/api/v1/summarize", {
        method: "POST",
        body: JSON.stringify({ url } as PlaylistRequest),
    });
}

/**
 * Sends a chat message to the LLM within the context of a conversation.
 */
export async function sendMessage(conversationId: string, message: string, useTranscripts: boolean): Promise<ChatResponse> {
    return fetchAPI<ChatResponse>("/api/v1/chat", {
        method: "POST",
        body: JSON.stringify({
            conversation_id: conversationId,
            message,
            use_transcripts: useTranscripts,
        } as ChatRequest),
    });
}
