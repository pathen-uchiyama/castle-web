# Castle Web

Welcome to the Castle Web frontend application. This is a React + TypeScript + Vite project designed as the pre-trip planning web app for the Castle system.

## Overview: The Sovereign Citadel Dashboard

Castle Web has been refactored into the "Sovereign Citadel" architecture—an immersive, card-based command center. Navigation is categorized into four strategic "Pillars":

1. **The Pulse**: Operational / Real-Time tools (Home Dashboard, My Upcoming Adventures, Interactive Map).
2. **The Blueprint**: Strategic Planning (Citadel Plan, Crowd Calendar, Transportation).
3. **The Library & Provisions**: Pre-trip prep (The Library, Smart Packing, Family & Friends).
4. **The Echo**: Post-trip reflections (Digital Keepsake).

The interface adheres to the `"Executive Plaid"` design philosophy:
- Background: Aged Parchment (`#F9F7F2`)
- Typography: Publico Headline (Titles) & Inter (Utility text)
- Containers: Stark white, 0px border-radius Sovereign Cards with Slate Plaid and Royal Thistle accents.

## Setup & Development

To get started with local development:

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

## Vercel Deployment

This project is configured to be deployed on **Vercel**. 

### Step-by-Step Deployment Guide

1. **GitHub Integration**: Ensure your latest code is pushed to the `main` branch of your GitHub repository.
2. **Import Project**: Log in to [Vercel](https://vercel.com) and click **Add New...** > **Project**.
3. **Select Repository**: Choose the `castle-web` repository from your linked GitHub account.
4. **Configure Build Settings**:
   - **Framework Preset**: Vercel should automatically detect **Vite**. If not, select it manually.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. **Environment Variables**: Add any necessary environment variables (e.g., Supabase credentials) in the Vercel project settings under **Settings > Environment Variables**.
6. **Deploy**: Click **Deploy**! Vercel will build the project and assign a live URL.

### Troubleshooting Builds

If the Vercel build fails due to TypeScript or ESLint errors, you can run the exact commands locally to catch them beforehand:

```bash
npm run tsc
npm run lint
```

Ensure these pass with `0 errors` before pushing to `main`. 

---

_Powered by Vite & React._
