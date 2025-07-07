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

## UI Framework - Skeleton v3

### Important Notes
- Skeleton v3 is CSS-only, no pre-built component classes
- Must import theme CSS files without the .css extension (the package.json exports handle this)
- Themes use `oklch()` color format for better color accuracy

### Theme Setup
1. Import themes in app.css:
```css
/* Base styles MUST come before themes */
@import '@skeletonlabs/skeleton';

/* Import themes - no .css extension! */
@import '@skeletonlabs/skeleton/themes/wintry';
@import '@skeletonlabs/skeleton/themes/rocket';
/* ... other themes */

/* Optional presets for buttons */
@import '@skeletonlabs/skeleton/optional/presets';
```

2. Set theme with `data-theme` attribute on `<html>` or `<body>`:
```html
<html data-theme="wintry">
```

3. Available theme paths:
- `@skeletonlabs/skeleton/themes/[theme-name]` (no .css extension)
- Themes are in `/dist/themes/` in node_modules

### Color Utilities
Skeleton v3 uses Tailwind-style color utilities with light/dark mode support:
- Use: `bg-surface-100 dark:bg-surface-900`
- NOT: `bg-surface-100-900` (this was v2 syntax)

### Components

#### Cards
- Base class: `card` (provides border-radius and hover states)
- Background presets: `preset-filled-surface-100-900` for primary cards
- Alternative: `preset-filled-surface-200-800` for nested/secondary cards
- Structure:
  ```html
  <div class="card preset-filled-surface-100-900 p-4">
    <header>...</header>
    <article>...</article>
    <footer>...</footer>
  </div>
  ```
- Add `card-hover` for hover effects on clickable cards
- The `card` class alone does NOT provide background colors

#### Buttons
- Button presets: `preset-filled-[color]-500`, `preset-tonal-[color]`, `preset-outlined-[color]-500`
- All components follow Tailwind utility patterns

### Common Issues & Solutions
1. **Theme not loading**: Check browser CSS cache, hard refresh with Cmd+Shift+R
2. **Import errors**: Remove .css extension from theme imports
3. **Colors not working**: Use separate light/dark classes, not combined syntax
4. **"Can't resolve" errors**: Package exports automatically add .css, don't include it in imports

### Project Structure for Styles
```
src/lib/styles/
├── base.css       # Base component styles
├── default.css    # Default interface style
├── glassmorphic.css
├── material.css
├── brutalist.css
├── neumorphic.css
└── index.css      # Import aggregator
```

### Interface Styles Implementation
Set with `data-style` attribute on `<html>` or `<body>`:
- `default` - Clean and simple
- `glassmorphic` - Blur and transparency effects
- `material` - Google Material Design with shadows
- `brutalist` - Bold borders and harsh shadows
- `neumorphic` - Soft extruded look

### Best Practices
1. Always check Skeleton docs for current component patterns
2. Use Skeleton's utility classes where possible
3. Import order matters: Tailwind → Skeleton base → Themes → Custom styles
4. Set both theme and style attributes early to prevent flash of unstyled content