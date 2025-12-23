# YouTube Playlist Summarizer

A modern web application that transforms hours of YouTube playlist content into concise, AI-powered summaries. Built with Next.js 16, React 19, and TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

- **AI-Powered Summaries** - Generate comprehensive summaries of entire YouTube playlists
- **Interactive Chat** - Ask follow-up questions about the content
- **Fast & Deep Modes** - Choose between quick answers or detailed transcript-based responses
- **Light & Dark Themes** - Modern, futuristic UI with theme switching
- **Internationalization** - English and Czech language support
- **Conversation History** - Save and revisit previous summaries
- **Responsive Design** - Optimized for desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/yt-playlist-sum-fe.git
cd yt-playlist-sum-fe

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📖 Documentation

Detailed documentation for each feature is available in the [`docs/`](./docs/) directory:

| Document | Description |
|----------|-------------|
| [Architecture](./docs/architecture.md) | System architecture and project structure |
| [Authentication](./docs/authentication.md) | User authentication and authorization |
| [Chat System](./docs/chat-system.md) | AI chat interface and message handling |
| [Summarization](./docs/summarization.md) | Playlist summarization feature |
| [Theming](./docs/theming.md) | Light/dark theme implementation |
| [Internationalization](./docs/internationalization.md) | Multi-language support (i18n) |
| [UI Components](./docs/ui-components.md) | Reusable component library |
| [API Client](./docs/api-client.md) | Backend communication layer |

## 🛠️ Tech Stack

### Core
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitives
- **[Lucide Icons](https://lucide.dev/)** - Icon library

### State & Data
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[next-intl](https://next-intl-docs.vercel.app/)** - Internationalization

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Locale-based routing
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── auth/               # Authentication components
│   ├── chat/               # Chat interface
│   ├── home/               # Home page components
│   └── ui/                 # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API, types
├── providers/              # React context providers
└── i18n/                   # Internationalization
```

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |

## 🎨 Theming

The application supports light and dark themes. Toggle via the button in the header.

- **System default** - Automatically matches OS preference on first visit
- **Manual toggle** - Switch between light ↔ dark modes
- **Persistent** - Preference saved in localStorage

## 🌐 Internationalization

Supported languages:
- 🇬🇧 English (`/en`)
- 🇨🇿 Czech (`/cs`)

Language is automatically detected from browser preferences.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for Next.js
- [Tailwind Labs](https://tailwindcss.com) for Tailwind CSS
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
