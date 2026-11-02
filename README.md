# Shomaj Setu — Social Development Events Platform

**Live site:** 
**Server API:** https://3server-url.vercel.app.

Shomaj Setu is a community-driven platform where people create, join and track social
service events such as winter clothes drives, blanket distribution, cleanups and plantation days..

## Key features
- Email/password and Google login with BetterAuth, with password rules (uppercase, lowercase, 6+ characters)
- Create events with validation, including a rule that dates must be in the future
- Upcoming Events page with search, type filter and sorting; ended events never appear
- One-click Join Event on the details page, stored in MongoDB along with user and event data
- Manage Events (update and delete your own events only) and Joined Events sorted by date
- JWT-protected Express API, verified through BetterAuth's JWKS endpoint
- Light and dark theme toggle, loading skeletons, and a profile page to update name and photo
- Fully responsive design for mobile, tablet and desktop

## Tech stack
Next.js (App Router), daisyUI + Tailwind CSS, BetterAuth (MongoDB adapter + JWT), Express.js, MongoDB

## Run locally
1. `npm install`
2. Fill in `.env` (variable names are already listed):
   - `NEXT_PUBLIC_API_URL` – URL of the Express server
   - `BETTER_AUTH_SECRET` – any long random string
   - `BETTER_AUTH_URL` – URL of this client app (e.g. http://localhost:3000)
   - `MONGODB_URI`, `MONGODB_DB` – MongoDB connection string and database name
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` – Google OAuth credentials
3. `npm run dev`

Google OAuth redirect URI to add in Google Cloud Console: `<BETTER_AUTH_URL>/api/auth/callback/google`

Gallery photos: add `g1.jpg` to `g8.jpg` into `public/gallery/`.
