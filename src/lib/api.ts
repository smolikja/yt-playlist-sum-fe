import { v4 as uuidv4 } from "uuid";
import {
    PlaylistRequest,
    SummaryResult,
    ChatRequest,
    ChatResponse,
    UserCreate,
    Body_auth_jwt_login_auth_jwt_login_post,
    BearerResponse,
    UserRead,
    ConversationResponse,
    ConversationDetailResponse,
    ApiError,
    ProblemDetails,
    isProblemDetails,
    // Job types
    SummarizeResponse,
    JobResponse,
    JobClaimResponse,
    PublicTimeoutError,
    JobLimitError,
} from "./types";
import { API_PAGINATION } from "./constants";

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
 * Parses error response and extracts user-friendly message.
 * Supports RFC 7807 Problem Details and legacy formats.
 */
async function parseErrorResponse(
    response: Response
): Promise<{ message: string; problemDetails?: ProblemDetails }> {
    let message = `HTTP error! status: ${response.status}`;
    let problemDetails: ProblemDetails | undefined;

    // Handle rate limiting specifically
    if (response.status === 429) {
        return {
            message: "Too many requests. Please wait a moment and try again.",
        };
    }

    try {
        const data = await response.json();

        // RFC 7807 Problem Details format
        if (isProblemDetails(data)) {
            problemDetails = data;
            message = data.detail || data.title;
        }
        // Legacy format with detail field
        else if (data.detail) {
            if (Array.isArray(data.detail)) {
                // Validation errors
                message = data.detail
                    .map((e: { msg: string }) => e.msg)
                    .join(", ");
            } else {
                message =
                    typeof data.detail === "string"
                        ? data.detail
                        : JSON.stringify(data.detail);
            }
        }
    } catch {
        // If JSON parsing fails, use default message
    }

    return { message, problemDetails };
}

/**
 * Generic fetch wrapper with error handling and default headers.
 * Supports RFC 7807 error responses and rate limiting.
 */
async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAccessToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const { message, problemDetails } = await parseErrorResponse(response);
        throw new ApiError(message, response.status, problemDetails);
    }

    // Handle 204 No Content and empty responses
    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return undefined as T;
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
        const { message, problemDetails } = await parseErrorResponse(response);
        throw new ApiError(message, response.status, problemDetails);
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
 * Returns dual-mode response based on authentication status:
 * - Authenticated: async mode with job
 * - Unauthenticated: sync mode with immediate result
 * 
 * @throws {PublicTimeoutError} When unauthenticated user's request times out (408)
 * @throws {JobLimitError} When user has reached max concurrent jobs (429)
 */
export async function summarizePlaylist(url: string): Promise<SummarizeResponse> {
    const token = getAccessToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/summarize`, {
        method: "POST",
        headers,
        body: JSON.stringify({ url } as PlaylistRequest),
    });

    if (!response.ok) {
        const { message, problemDetails } = await parseErrorResponse(response);

        // Handle specific error codes
        if (response.status === 408) {
            throw new PublicTimeoutError(message, problemDetails);
        }
        if (response.status === 429) {
            throw new JobLimitError(message, problemDetails);
        }
        throw new ApiError(message, response.status, problemDetails);
    }

    return response.json();
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
export async function sendMessage(conversationId: string, message: string, useRag: boolean): Promise<ChatResponse> {
    return fetchAPI<ChatResponse>("/api/v1/chat", {
        method: "POST",
        body: JSON.stringify({
            conversation_id: conversationId,
            message,
            use_rag: useRag,
        } as ChatRequest),
    });
}

/**
 * Retrieves the history of conversations for the authenticated user.
 */
export async function getConversations(
    limit = API_PAGINATION.DEFAULT_LIMIT,
    offset = API_PAGINATION.DEFAULT_OFFSET
): Promise<ConversationResponse[]> {
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

// ============================================================
// JOB API ENDPOINTS
// ============================================================

/**
 * Retrieves all jobs for the authenticated user.
 */
export async function getJobs(): Promise<JobResponse[]> {
    return fetchAPI<JobResponse[]>("/api/v1/jobs");
}

/**
 * Retrieves a specific job by ID.
 * Used for polling job status.
 */
export async function getJob(jobId: string): Promise<JobResponse> {
    return fetchAPI<JobResponse>(`/api/v1/jobs/${jobId}`);
}

/**
 * Claims a completed job and returns the created conversation.
 * The job is automatically deleted after claiming.
 */
export async function claimJob(jobId: string): Promise<JobClaimResponse> {
    return fetchAPI<JobClaimResponse>(`/api/v1/jobs/${jobId}/claim`, {
        method: "POST",
    });
}

/**
 * Retries a failed job.
 * Resets the job status to 'pending'.
 */
export async function retryJob(jobId: string): Promise<JobResponse> {
    return fetchAPI<JobResponse>(`/api/v1/jobs/${jobId}/retry`, {
        method: "POST",
    });
}

/**
 * Deletes/cancels a job.
 * Can be used for pending or failed jobs.
 */
export async function deleteJob(jobId: string): Promise<void> {
    return fetchAPI<void>(`/api/v1/jobs/${jobId}`, {
        method: "DELETE",
    });
}

