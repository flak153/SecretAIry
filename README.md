# SecretAIry

Your AI-powered secretary built with SvelteKit, Skeleton UI, and Convex.

## Tech Stack

- **Frontend**: SvelteKit + Skeleton UI
- **Styling**: Tailwind CSS v4
- **Backend**: Convex
- **Deployment**: Netlify
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- [Convex](https://convex.dev) account
- [Netlify](https://netlify.com) account (for deployment)

### Development

1. Install dependencies:
```bash
bun install
```

2. Start the Convex development server:
```bash
bunx convex dev
```

3. In a new terminal, start the development server:
```bash
bun run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building

To create a production build:

```bash
bun run build
```

## Deployment

This project is configured to deploy to Netlify. You can deploy via:

1. **Git Integration** (Recommended):
   - Push to GitHub/GitLab/Bitbucket
   - Connect repository in Netlify dashboard
   - Auto-deploys on every push

2. **Netlify CLI**:
   ```bash
   netlify deploy --prod
   ```

## Features

- 🎨 Beautiful UI with Skeleton's Wintry theme
- 🚀 Real-time backend with Convex
- 📱 Fully responsive design
- ⚡ Lightning-fast with SvelteKit
- 🔒 Type-safe with TypeScript

## License

MIT