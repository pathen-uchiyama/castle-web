# Castle Web

Welcome to the Castle Web frontend application. This is a React + TypeScript + Vite project designed as the pre-trip planning web app for the Castle system.

## Overview: The Sophisticated Whimsy Dashboard

Castle Web presents the "Sophisticated Whimsy" experience — a high-end, leather-bound travel journal interface. Navigation is organized into four Experience Collections:

1. **The Daily Pulse**: Real-time magic (The Hearth, The Active Adventure, The Compass).
2. **The Grand Plan**: Boutique strategy (The Intelligent Blueprint, The Magic Window, The Royal Carriage).
3. **The Field Kit**: Preparation & secrets (The Library of Whispers, The Traveler's Trunk, The Inner Circle).
4. **The Keepsake**: Memories (The Digital Gallery).

Design principles:
- Background: Aged Parchment (`#F9F7F2`)
- Typography: Publico Headline (Titles) & Inter (Utility text)
- Stationery Cards: Crisp white, 0px radius, Slate Plaid borders with Royal Thistle and Burnished Gold accents.

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
