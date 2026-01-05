export interface PlaylistRequest {
  url: string;
}

export interface SummaryResult {
  playlist_title: string | null;
  video_count: number;
  summary_markdown: string;
  conversation_id: string;
}

export interface ChatRequest {
  conversation_id: string;
  message: string;
  use_rag?: boolean;
}

export interface ChatResponse {
  response: string;
}

export enum Role {
  USER = "user",
  MODEL = "model",
}

/**
 * Type guard for validating Role values from external sources (e.g., API responses).
 */
export function isRole(value: unknown): value is Role {
  return value === Role.USER || value === Role.MODEL;
}

/**
 * Safely parse a string to Role, returns undefined if invalid.
 */
export function parseRole(value: unknown): Role | undefined {
  return isRole(value) ? value : undefined;
}

export interface MessageButton {
  label: string;
  action: string;
}

export interface MessageResponse {
  id: number;
  role: Role;
  content: string;
  created_at: string;
}

export interface ConversationResponse {
  id: string;
  title: string | null;
  summary_snippet: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetailResponse {
  id: string;
  title: string | null;
  playlist_url: string | null;
  summary: string;
  created_at: string;
  updated_at: string;
  messages: MessageResponse[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface UserCreate {
  email: string;
  password: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
}

export interface UserRead {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}

export interface Body_auth_jwt_login_auth_jwt_login_post {
  username: string;
  password: string;
  grant_type?: string | null;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

export interface BearerResponse {
  access_token: string;
  token_type: string;
}

// RFC 7807 Problem Details
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

// Custom API Error class with RFC 7807 support
export class ApiError extends Error {
  status: number;
  isRateLimited: boolean;
  retryAfter?: number;
  problemDetails?: ProblemDetails;

  constructor(message: string, status: number, problemDetails?: ProblemDetails) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isRateLimited = status === 429;
    this.problemDetails = problemDetails;
  }
}

// Type guard for ProblemDetails
export function isProblemDetails(data: unknown): data is ProblemDetails {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    "title" in data &&
    "status" in data
  );
}

// ============================================================
// JOB TYPES
// ============================================================

/** Status of a background summarization job */
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

/** Background job response from the API */
export interface JobResponse {
  id: string;
  status: JobStatus;
  playlist_url: string;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

/**
 * Discriminated union for /summarize endpoint response.
 * - mode: 'sync' → immediate result for public users
 * - mode: 'async' → job created for authenticated users
 */
export type SummarizeResponse =
  | { mode: 'sync'; summary: SummaryResult; job?: undefined }
  | { mode: 'async'; job: JobResponse; summary?: undefined };

/** Response from POST /jobs/{id}/claim */
export interface JobClaimResponse {
  conversation: ConversationDetailResponse;
}

// ============================================================
// CUSTOM ERROR CLASSES
// ============================================================

/** Error thrown when public user's summarization times out (408) */
export class PublicTimeoutError extends ApiError {
  constructor(message: string, problemDetails?: ProblemDetails) {
    super(message, 408, problemDetails);
    this.name = 'PublicTimeoutError';
  }
}

/** Error thrown when user reaches concurrent job limit (429) */
export class JobLimitError extends ApiError {
  constructor(message: string, problemDetails?: ProblemDetails) {
    super(message, 429, problemDetails);
    this.name = 'JobLimitError';
  }
}
