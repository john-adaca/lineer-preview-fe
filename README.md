# LinkedIn Topics Generator

A Next.js application that generates topics and perspectives from LinkedIn posts with real-time streaming.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Server-Sent Events (SSE)** - Real-time streaming

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

This will create a static export in the `out` directory, ready for Cloudflare Pages deployment.

## Environment Variables

Create a `.env.local` file (optional):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

If not set, it defaults to `http://localhost:8787`.

## Cloudflare Pages Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Cloudflare Pages:
   - Connect your repository to Cloudflare Pages
   - Set build command: `npm run build`
   - Set build output directory: `out`
   - Set Node.js version: `18` or higher

3. Set environment variables in Cloudflare Pages dashboard:
   - `NEXT_PUBLIC_API_BASE_URL` - Your API base URL

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles with Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page component
├── components/          # React components
│   ├── Header.tsx
│   ├── FormSection.tsx
│   ├── StatusSection.tsx
│   ├── TopicCard.tsx
│   ├── PerspectiveItem.tsx
│   ├── EmailDraft.tsx
│   ├── ErrorDisplay.tsx
│   └── EmptyState.tsx
├── hooks/               # Custom React hooks
│   └── useSSE.ts        # SSE connection hook
├── types/               # TypeScript type definitions
│   └── index.ts
└── utils/               # Utility functions
    └── config.ts        # Configuration
```

## Features

- Real-time streaming of LinkedIn topics and perspectives
- Email draft generation for perspectives
- Responsive design with Tailwind CSS
- Type-safe with TypeScript
- Modular component architecture



