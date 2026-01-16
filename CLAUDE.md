# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Climate Research Explorer - a SvelteKit web application for exploring and comparing cities worldwide based on climate, geography, cost of living, and livability metrics. Uses Svelte 5 runes for state management and DaisyUI/Tailwind CSS 4 for styling.

## Development Commands

All commands run from the `web/` directory using bun:

```bash
# Development
bun run dev           # Start dev server on localhost:5173

# Type checking and linting
bun run check         # Run svelte-check for TypeScript errors

# Testing
bun run test          # Run vitest in watch mode
bun run test:run      # Run tests once

# Build
bun run build         # Build for production (outputs to web/build/)
bun run preview       # Preview production build

# Data conversion
bun run convert-data  # Convert city_data.csv to cities.json
```

## Architecture

### Data Flow

1. **Source Data**: `city_data.csv` in project root contains raw city metrics
2. **Conversion**: `web/scripts/convert-data.ts` transforms CSV to JSON with calculated scores
3. **JSON Storage**: `web/src/lib/data/cities.json` - imported directly by the store
4. **Store**: `web/src/lib/stores/cities.svelte.ts` - Svelte 5 runes-based singleton store that:
   - Loads city data on initialization
   - Recalculates scores dynamically based on user weight preferences
   - Handles filtering, sorting, and city selection

### Scoring System

The scoring algorithm in `web/src/lib/utils/scoring.ts` calculates weighted scores across 6 categories:
- Climate (30 default weight): sunny days, humidity, temperature mildness
- Geography (10): mountains + ocean proximity (both = 10pts, one = 3pts)
- Accessibility (15): walk score + airport distance
- Cost (15): cost of living index (inverted - lower cost = higher score)
- Family (15): safety + kid-friendliness
- Sustainability (15): bike score + EV infrastructure

Weights are user-adjustable via sliders and normalized to 100 total. Scores and ranks recalculate reactively.

### URL State Sync

Filter and weight state syncs to URL query params via `web/src/lib/stores/urlState.ts`, enabling shareable filtered views.

### Key Components

- `CityTable.svelte` / `CityCard.svelte` - list views with selection support
- `FilterPanel.svelte` - region, country, population, climate, geography filters
- `ScoreSliders.svelte` - weight adjustment for each scoring category
- `charts/*.svelte` - D3-based visualizations (scatter, bar, radar, world map)

### Routes

- `/` - Main dashboard with filters, weights, and visualizations
- `/city/[slug]` - Individual city detail page
- `/compare?cities=slug1,slug2` - Side-by-side city comparison
- `/research` - Research articles section
- `/methodology` - Scoring methodology explanation
- `/sources` - Data sources documentation

## Tech Stack

- **Framework**: SvelteKit 2 with Svelte 5 (using runes: `$state`, `$derived`, `$props`)
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Visualization**: D3.js for charts and maps
- **Testing**: Vitest with jsdom + @testing-library/svelte
- **Build**: Vite 7 with static adapter (SPA fallback to 200.html)
- **Package Manager**: bun

## Nix Development Environment

The project uses a Nix flake for reproducible dev environments. Enter with `nix develop` or use direnv with `.envrc`.
