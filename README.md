# Traveloop

Traveloop is a full-stack trip planning workspace built with Next.js, Prisma, PostgreSQL, NextAuth, Tailwind CSS, and a collection of travel-focused UI and data tools. It helps users plan multi-city trips, manage stops and activities, track budgets, add notes and expenses, and share itineraries with others.

## Problem Statement

Planning a trip usually means juggling separate tools for maps, weather, budgets, notes, images, and itineraries. That makes it harder to keep everything consistent and even harder to share a trip plan with others.

Traveloop solves this by bringing the entire planning workflow into one workspace. It combines trip creation, city lookup, weather forecasts, expense tracking, shared trip access, and structured planning data in a single application.

## Key Features

- Multi-city trip creation and management.
- Interactive trip stops, activities, notes, and expenses.
- Live budget tracking with currency conversion support.
- Weather forecasts for destinations.
- City search and location lookup.
- Trip sharing through public share tokens.
- Authentication with credentials and optional Google sign-in.
- Dashboard-style workspace for managing all travel data.

## Tech Stack

- Next.js 14 with App Router
- React 18
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth
- Tailwind CSS
- Zustand for local/global state
- TanStack Query for server state
- Framer Motion for animation
- React Hook Form and Zod for form handling and validation
- Radix UI and Lucide React for UI primitives and icons

## Folder Structure

```text
.
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── trip/[tripId]/
│   │   └── trips/
│   ├── api/
│   │   ├── auth/
│   │   ├── external/
│   │   ├── share/
│   │   ├── stops/
│   │   └── trips/
│   ├── share/[shareToken]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── modals/
│   ├── providers/
│   └── workspace/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── utils.ts
│   ├── data/
│   ├── hooks/
│   ├── utils/
│   └── validations/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── store/
├── types/
├── middleware.ts
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

## Application Overview

The app is centered around a travel workspace where each trip can contain:

- A title, description, cover image, visibility, and optional budget target.
- Multiple stops, each with city, country, coordinates, and travel dates.
- Activities attached to each stop.
- Expenses with categories, amounts, dates, and currencies.
- Notes linked to the trip.
- Share links for public viewing when enabled.

The landing page introduces the product, and authenticated users can move into the dashboard to manage their trips.

## Data Model

The Prisma schema is built around these main entities:

- `User`
- `Trip`
- `TripStop`
- `Activity`
- `Expense`
- `Note`
- `AICache`
- NextAuth models for `Account`, `Session`, and `VerificationToken`

The database provider is PostgreSQL.

## External Integrations

Traveloop can use the following optional or required services depending on the configured environment:

- Google sign-in through NextAuth.
- GeoDB city search via RapidAPI.
- Exchange rate lookup for currency conversion.
- Unsplash for destination images.
- OpenWeather for weather forecasts.

## Environment Variables

Create a `.env.local` file in the project root and configure the following variables as needed:

```bash
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=
RAPIDAPI_KEY=
RAPIDAPI_HOST=
EXCHANGERATE_API_KEY=
UNSPLASH_ACCESS_KEY=
OPENWEATHER_API_KEY=
```

Notes:

- `DATABASE_URL` is required for Prisma and PostgreSQL.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` enable Google sign-in when present.
- `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` controls whether the Google login option is shown in the UI.
- The external API keys are used by the city, exchange, image, and weather routes.

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create `.env.local` and add the variables listed above.

### 3. Prepare the database

Run Prisma migrations or push the schema, depending on your workflow:

```bash
npx prisma migrate dev
```

If you want to load the seed data, run:

```bash
npx prisma db seed
```

### 4. Start the development server

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run postinstall
```

## Project Structure by Area

- `app/(auth)` contains authentication screens.
- `app/(dashboard)` contains the authenticated trip management experience.
- `app/api` contains route handlers for auth, trips, stops, sharing, and external services.
- `components/workspace` contains the main workspace layout and panels.
- `components/modals` contains dialog flows for trip-related actions.
- `lib/hooks` and `store` contain reusable client logic and state management.
- `prisma` contains the database schema and seed script.

## Deployment Notes

The app can be deployed to any environment that supports Next.js, Prisma, and PostgreSQL. Make sure the production environment has the correct database URL and API keys configured before deployment.

## Development Notes

- The project uses App Router and server components where appropriate.
- Prisma client generation is handled by the `postinstall` script.
- The UI is built with Tailwind CSS and several Radix-based components.

## License

No license has been specified in this repository.
