# TrialWatch Web App

A beautiful web application for discovering free trials and tracking them to avoid unwanted charges.

## Features

- **Trial Discovery**: Browse 50+ curated premium free trials
- **Trial Tracking**: Track all your trials in one dashboard
- **Smart Alerts**: Get notified before trials expire
- **Money Savings**: Track how much you've saved by canceling on time
- **SEO Optimized**: Each trial has its own page for search engine visibility

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion animations
- **Icons**: Lucide React
- **Deployment**: Vercel (auto-deploy on push)

## Pages

- `/` - Landing page with trial discovery
- `/dashboard` - User dashboard to track trials

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
```

## Deployment

This app is configured for automatic deployment to Vercel:

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Every push to main branch auto-deploys!

## Environment Variables

None required for basic functionality. Add these for advanced features:

- `GMAIL_CLIENT_ID` - For Gmail auto-import
- `GMAIL_CLIENT_SECRET` - For Gmail auto-import
- `PLAID_CLIENT_ID` - For bank connection (charge prevention)

## License

MIT
