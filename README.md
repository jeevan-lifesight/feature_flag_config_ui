# Feature Flag UI

Root repository that contains the React/Vite app located in `dynamic-screen-editor`. The root currently holds the committed build artifact `App.tsx` plus the Vite project for development.

## Structure
- `dynamic-screen-editor/` – main React + Vite project (TypeScript).
- `App.tsx` – built output snapshot.

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm (ships with Node)

## Setup & Scripts
```bash
cd dynamic-screen-editor
npm install

# Run locally
npm run dev

# Type-check and build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

## Development Notes
- API keys should remain server-side; the frontend should never receive them directly. Ensure any API calls are proxied through the backend so keys are injected there.
- The checked-in `dist/` output is currently ignored via `.gitignore`; run a fresh `npm run build` when producing deployable artifacts.

