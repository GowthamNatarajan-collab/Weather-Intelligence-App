# Weather Intelligence Application

A sophisticated, high-performance weather dashboard built with React, Vite, and Tailwind CSS, featuring real-time data fetching and a custom Cloudflare-based proxy for reliable API communication.

## 🌟 Features

- **Real-time Weather Data**: Integrated with Open-Meteo for accurate, high-resolution global weather data.
- **Intelligent City Search**: Dynamic geocoding search with robust error handling and "no results" states.
- **Sophisticated UI**: 
  - Glassmorphic design with deep contrast.
  - Responsive layouts for mobile and desktop.
  - Elevated search results layer with high Z-index to prevent overlapping.
- **Robust Error Handling**: Clear visual feedback for invalid city searches and API connection errors.
- **Dual Deployment Support**: Configured for both Cloudflare Workers and Cloudflare Pages.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React (icons), Motion (animations).
- **Backend/Proxy**: 
  - **Cloudflare Workers**: Edge-side proxy script for production.
  - **Cloudflare Pages Functions**: Serverless functions support for Pages deployments.
  - **Express**: Local development server with Vite middleware.

## 🚀 Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The app will be available at `http://localhost:3000`.

### Cloudflare Deployment

#### Cloudflare Pages (Recommended for GitHub Sync)

1. Connect your GitHub repository to Cloudflare Pages.
2. Set the following build settings:
   - **Framework preset**: `None` (or Vite)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Cloudflare will automatically detect the `/functions` directory for the weather proxy.

#### Cloudflare Workers

1. Ensure you have `wrangler` installed and authenticated.
2. Deploy the worker:
   ```bash
   npm run deploy
   ```

## 📂 Project Structure

- `/src`: React application source code.
- `/src/components`: Reusable UI components (WeatherSearch, etc.).
- `/functions`: Cloudflare Pages serverless functions (Proxy API).
- `/server.ts`: Local development server implementation.
- `wrangler.toml`: Cloudflare Workers configuration.
- `src/worker.ts`: Cloudflare Workers entry point.

## 🧪 Acceptance Criteria Validated

- [x] **Valid City Search**: Searches for "London" or "New York" return correct coordinates and weather data.
- [x] **Invalid City Search**: Searching for non-existent locations shows a "No results found" state in the UI.
- [x] **API Error State**: Robust handling and visual "Retry" mechanisms for network or API failures.
- [x] **Z-Index Layering**: Search results now appear correctly over the weather dashboard elements.
