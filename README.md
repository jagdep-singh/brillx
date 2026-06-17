# BrillX

BrillX is a real-time AI learning platform built with Next.js. Users can create personalized learning companions, launch voice-based lessons, browse a companion library, and track their own session history.

The app is designed around three core integrations:

- Clerk for authentication
- Supabase for storage and data access
- Vapi for voice assistant sessions

## What the app does

- Lets signed-in users create custom learning companions
- Lists companions on the home page and in the library
- Opens a dedicated lesson page for each companion
- Records session history for the signed-in user
- Shows a personal dashboard with created companions and recent sessions
- Uses a pricing/subscription page through Clerk

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Clerk
- Supabase
- Vapi
- Sentry

## Project Structure

Key folders and files:

- [app/page.tsx](/Users/jagdeepsingh/Desktop/brillx/brillx/app/page.tsx): home page
- [app/companions/page.tsx](/Users/jagdeepsingh/Desktop/brillx/brillx/app/companions/page.tsx): companion library
- [app/companions/new/page.tsx](/Users/jagdeepsingh/Desktop/brillx/brillx/app/companions/new/page.tsx): create companion form
- [app/companions/[id]/page.tsx](/Users/jagdeepsingh/Desktop/brillx/brillx/app/companions/%5Bid%5D/page.tsx): companion lesson/session page
- [app/my-journy/page.tsx](/Users/jagdeepsingh/Desktop/brillx/brillx/app/my-journy/page.tsx): user dashboard
- [app/subscription/page.tsx](/Users/jagdeepsingh/Desktop/brillx/brillx/app/subscription/page.tsx): Clerk pricing table
- [components/](/Users/jagdeepsingh/Desktop/brillx/brillx/components): shared UI pieces
- [lib/actions/companion.action.ts](/Users/jagdeepsingh/Desktop/brillx/brillx/lib/actions/companion.action.ts): server actions for companions and sessions
- [lib/supabase.ts](/Users/jagdeepsingh/Desktop/brillx/brillx/lib/supabase.ts): Supabase client helpers
- [utils/supabase/](/Users/jagdeepsingh/Desktop/brillx/brillx/utils/supabase): SSR, browser, and middleware clients
- [supabase/seed.sql](/Users/jagdeepsingh/Desktop/brillx/brillx/supabase/seed.sql): dummy data for local/testing use

## Features

- Authentication with Clerk
- Personalized companion creation
- Companion browsing and search
- Subject filtering
- Voice lesson sessions
- Recent session tracking
- User profile dashboard
- Subscription page
- Supabase-backed data layer

## Prerequisites

- Node.js 18.18 or newer
- npm
- A Supabase project
- A Clerk application
- A Vapi web token

## Installation

```bash
npm install
```

## Environment Variables

Create a local env file in the project root. The app reads both `.env.local` and `.env`, but `.env.local` is the normal local-dev file.

Required variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# Optional fallback if you prefer the older name:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Required for server-side writes that bypass RLS in the current app code
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_VAPI_WEB_TOKEN=
```

Notes:

- The code supports both `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY` is required for the current server actions that create companions and write session history.
- The app falls back to hardcoded Supabase defaults if the public values are missing, but you should still set your own project values for real use.

## Supabase Setup

1. Create a Supabase project.
2. Run your schema SQL in the Supabase SQL editor.
3. Add the required env vars to `.env.local`.
4. If you want sample data, run [supabase/seed.sql](/Users/jagdeepsingh/Desktop/brillx/brillx/supabase/seed.sql).

The app currently uses these tables:

- `companions`
- `session_history`
- `bookmarks` is present in comments and can be added later if you want saved items

## Seeding Dummy Data

If you want immediate local content:

1. Open [supabase/seed.sql](/Users/jagdeepsingh/Desktop/brillx/brillx/supabase/seed.sql)
2. Paste it into the Supabase SQL editor
3. Run it

That seed file:

- Clears `companions` and `session_history`
- Inserts several realistic companions
- Inserts matching session history rows

## Running Locally

```bash
npm run dev
```

Then open:

- `http://localhost:3000` for the home page
- `http://localhost:3000/companions` for the library
- `http://localhost:3000/companions/new` to create a companion
- `http://localhost:3000/my-journy` for your dashboard

## Available Scripts

- `npm run dev` - start the development server with Turbopack
- `npm run build` - build the app for production
- `npm run start` - run the production build
- `npm run lint` - run Next.js linting

## Authentication Flow

- Clerk handles sign-in and user identity
- Protected pages redirect unauthenticated users to `/sign-in`
- `middleware.ts` refreshes the Supabase session alongside Clerk auth

Relevant files:

- [middleware.ts](/Users/jagdeepsingh/Desktop/brillx/brillx/middleware.ts)
- [app/layout.tsx](/Users/jagdeepsingh/Desktop/brillx/brillx/app/layout.tsx)
- [app/sign-in/[[...sign-in]]/page.tsx](/Users/jagdeepsingh/Desktop/brillx/brillx/app/sign-in/%5B%5B...sign-in%5D%5D/page.tsx)

## Data Flow

- The home page loads popular companions and recent sessions
- The library page supports search and subject filtering
- The companion creation form submits to a server action
- The lesson page loads a single companion and starts the voice session component
- The dashboard loads the current user's companions and session history

Important server action file:

- [lib/actions/companion.action.ts](/Users/jagdeepsingh/Desktop/brillx/brillx/lib/actions/companion.action.ts)

## Voice and Lessons

BrillX uses Vapi to power the lesson experience. Companion voice and style are selected when a companion is created, then used to configure the assistant for the session.

Relevant files:

- [lib/vapi.sdk.ts](/Users/jagdeepsingh/Desktop/brillx/brillx/lib/vapi.sdk.ts)
- [lib/utils.ts](/Users/jagdeepsingh/Desktop/brillx/brillx/lib/utils.ts)
- [components/CompanionComponent.tsx](/Users/jagdeepsingh/Desktop/brillx/brillx/components/CompanionComponent.tsx)

## Troubleshooting

If companion creation fails with an RLS error:

- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Restart the dev server after editing env files
- Confirm the Supabase `companions` table exists and matches the expected schema

If the app cannot load Supabase data:

- Check `NEXT_PUBLIC_SUPABASE_URL`
- Check `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- If you are using the alternate name, set `NEXT_PUBLIC_SUPABASE_ANON_KEY` too

If sign-in redirects are wrong:

- Verify the Clerk redirect env vars
- Make sure your Clerk app allows the local callback URLs

## Notes

- This is a single Next.js app, not a split frontend/backend repo.
- The old README described MongoDB and separate folders, but that is no longer accurate for this codebase.
- `env.txt` files are not required for runtime and are just workspace notes.

## License

No license has been specified yet.
