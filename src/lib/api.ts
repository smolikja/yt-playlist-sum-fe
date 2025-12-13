import { v4 as uuidv4 } from "uuid";
import { PlaylistRequest, SummaryResult, ChatRequest, ChatResponse, UserCreate, Body_auth_jwt_login_auth_jwt_login_post, BearerResponse, UserRead } from "./types";

const ANONYMOUS_ID_KEY = "x-user-id";
const ACCESS_TOKEN_KEY = "access_token";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Generic fetch wrapper with error handling and default headers.
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const anonymousId = getOrCreateAnonymousId();
    const token = getAccessToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers as Record<string, string>,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    } else {
        headers["x-user-id"] = anonymousId;
    }

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
                    errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
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
 * Auth Endpoints
 */
export async function loginUser(credentials: Body_auth_jwt_login_auth_jwt_login_post): Promise<BearerResponse> {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    
    const response = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return response.json();
}

export async function registerUser(data: UserCreate): Promise<UserRead> {
    return fetchAPI<UserRead>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function getCurrentUser(): Promise<UserRead> {
    return fetchAPI<UserRead>("/users/me");
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
 * Claims a conversation for the currently logged-in user.
 */
export async function claimConversation(conversationId: string): Promise<void> {
    return fetchAPI<void>(`/api/v1/conversations/${conversationId}/claim`, {
        method: "POST",
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

/**
 * Retrieves the history of conversations for the authenticated user.
 */
export async function getConversations(limit = 20, offset = 0): Promise<ConversationResponse[]> {
    const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
    });
    return fetchAPI<ConversationResponse[]>(`/api/v1/conversations?${params.toString()}`);
}

/**
 * Retrieves full details of a specific conversation.
 */
export async function getConversation(conversationId: string): Promise<ConversationDetailResponse> {
    return fetchAPI<ConversationDetailResponse>(`/api/v1/conversations/${conversationId}`);
}

/**
 * Deletes a specific conversation.
 */
export async function deleteConversation(conversationId: string): Promise<void> {
    return fetchAPI<void>(`/api/v1/conversations/${conversationId}`, {
        method: "DELETE",
    });
}
