# Project Information

## Package Manager
This project uses **Bun** as the package manager, not npm.

### Common Commands
- Install dependencies: `bun install`
- Add packages: `bun add <package-name>`
- Run scripts: `bun run <script-name>`

## Deployment
This project is configured to deploy to Netlify with the following setup:
- Adapter: @sveltejs/adapter-netlify
- Build command: `bun run build`
- Publish directory: `build`

## Backend
- Using Convex for backend services
- Convex URL is configured in .env.local