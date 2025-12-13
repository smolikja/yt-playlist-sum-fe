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
  use_transcripts?: boolean;
}

export interface ChatResponse {
  response: string;
}

export enum Role {
  USER = "user",
  AI = "ai",
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
  summary: string;
  created_at: string;
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
