# YouTube Playlist Summarizer - Anonymous Flow Update

This update implements the "Anonymous-First" flow, allowing users to generate summaries without logging in and then claim them by creating an account.

## New Features

1.  **Anonymous Summarization**:
    -   Users can enter a YouTube playlist URL and get a summary immediately.
    -   An anonymous ID is generated and stored in `localStorage`.
    -   The summary is displayed in a "Glass Card" with a futuristic design.

2.  **Locked Chat Interface**:
    -   For anonymous users, the Chat interface is blurred and locked.
    -   A "Sign in to Chat" overlay prompts the user to authenticate.

3.  **Authentication & Claiming**:
    -   **Auth Modal**: A new custom modal for Login and Registration using `framer-motion` for smooth animations.
    -   **Claim Flow**: Upon successful login, the application automatically "claims" the anonymous conversation, linking it to the new user account.
    -   **Unlock**: Once claimed, the Chat interface is unlocked, allowing the user to interact with the LLM.

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Ensure your `.env` file contains the `NEXT_PUBLIC_API_URL` pointing to your backend (e.g., `http://localhost:8000`).

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build**:
    ```bash
    npm run build
    ```

## Key Files Created/Modified

-   `src/lib/api.ts`: Updated `fetchAPI` for Bearer tokens, added Auth endpoints and `claimConversation`.
-   `src/hooks/use-auth.ts`: New hook for managing User state and Login/Register mutations.
-   `src/hooks/use-claim.ts`: New hook for the Claim mutation.
-   `src/components/auth/auth-modal.tsx`: The Login/Register modal component.
-   `src/components/chat/locked-chat-overlay.tsx`: The UI overlay for anonymous users.
-   `src/app/page.tsx`: Integrated the full flow (Summary -> Locked Chat -> Auth -> Claim -> Unlocked Chat).
