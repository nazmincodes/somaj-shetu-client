# QA Report

Project: `C:\server` (Express + MongoDB API, "Shomaj Setu") and `C:\client` (Next.js 16 App Router + BetterAuth + daisyUI)
Date: 2026-11-02 · Tester: automated QA run (curl + Playwright-core/system Chrome) · Source code: **not modified**

## 1. Summary

**Overall verdict: PASS** (with 5 minor/non-blocking problems listed below)

| Status | Count |
|---|---|
| PASS | 79 |
| FAIL | 0 |
| SKIPPED | 3 |
| **Total** | **82** |

Every functional test required by the checklist passed: public API, auth (BetterAuth sign-up → JWT → JWKS), event CRUD with validation, ownership 403s, join/leave/409 duplicate handling, past-event rejection, tampered-token 401, all 10 client routes, and all 10 browser UI checks (register toast, navbar state, create-event redirect, `/manage-events` reload without bounce to `/login`, theme toggle, 9 screenshots).

**Top 5 problems**

1. **Missing favicon → 404 console error on every page load.** `GET http://localhost:3000/favicon.ico` returns 404; no `public/favicon.ico` and no `app/icon.*` file, and `metadata` in `C:\client\src\app\layout.js:9-12` declares no `icons`. It is the only browser console error collected.
2. **README "Live site" URL is a placeholder** (`C:\client\README.md:3` = `https://your-live-site-url.vercel.app`) — the README claims a live URL that does not exist.
3. **Server dependencies have 2 moderate npm-audit vulnerabilities** (`minimatch` via `nodemon`, `C:\server\package.json:18`). Note `nodemon` sits in `"dependencies"` although the start script uses plain `node`.
4. **Ports 5000/3000 were already occupied by stale processes** from a previous run (Express `src/index.js`, `next dev`, `next start`, `npm run dev`). My first start attempt failed with `EADDRINUSE`; I had to kill the leftovers before the apps would start. Not a code defect, but a real startup/ops hazard.
5. **No MongoDB "connected" logging.** Server log contains only `Server running on port 5000`; connection health had to be proven indirectly by DB-backed responses (all of which succeeded).

Skipped (3): Google OAuth social login, UI submit on `/manage-events/[id]`, UI submit on `/profile` — reasons in §9.

## 2. Environment

- **Node:** `v24.18.0`  ·  **npm:** `11.16.0`
- **Ports used:** server `5000` (`PORT=5000` in `server/.env`), client `3000` (default `next start`; `BETTER_AUTH_URL`/`CLIENT_URL` = `http://localhost:3000`, `NEXT_PUBLIC_API_URL` = `http://localhost:5000`)
- **Versions in use (from `node_modules`):** Next.js 16.4.3 (Turbopack), daisyUI 5.7.50, BetterAuth 1.7.15 (`package.json` declares `^1.3.0`), Express 4.22.3, MongoDB driver 6.21.0

**Environment variables (names + SET/EMPTY only — no values printed)**

| File | Variable | Status |
|---|---|---|
| `server/.env` | `PORT` | SET |
| `server/.env` | `MONGODB_URI` | **SET** |
| `server/.env` | `DB_NAME` | SET |
| `server/.env` | `CLIENT_URL` | SET |
| `client/.env` | `NEXT_PUBLIC_API_URL` | SET |
| `client/.env` | `BETTER_AUTH_SECRET` | SET |
| `client/.env` | `BETTER_AUTH_URL` | SET |
| `client/.env` | `MONGODB_URI` | **SET** |
| `client/.env` | `MONGODB_DB` | SET |
| `client/.env` | `GOOGLE_CLIENT_ID` | SET |
| `client/.env` | `GOOGLE_CLIENT_SECRET` | SET |

`MONGODB_URI` is SET in **both** files → the run continued (rule satisfied). No variable was EMPTY. (`server/.env.example` exists but is empty — informational only.)

## 3. Build and install

**`npm install` in `C:\server`** — exit 0:
```
up to date, audited 113 packages in 6s

26 packages are looking for funding
  run `npm fund` for details

2 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force
```
Warning recorded: **2 moderate vulnerabilities** (see §5.2). No install errors.

**`npm install` in `C:\client`** — exit 0:
```
up to date, audited 80 packages in 5s

17 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**`npm run build` in `C:\client`** — **SUCCESS** (exit 0):
```
Next.js 16.4.3 (Turbopack)
- Environments: .env
Running next.config.mjs took 68ms

  Creating an optimized production build ...
/*! 🌼 daisyUI 5.7.50 */
Compiled successfully in 16.9s
  Running TypeScript ...
  Finished TypeScript in 35ms ...
  Generating static pages using 7 workers (10/10) in 1133ms
  Finalizing page optimization ...

Route (app)
✓ /
✓ /_not-found
ƒ /api/auth/[...all]
✓ /create-event
✓ /events
ƒ /events/[id]
✓ /joined-events
✓ /login
✓ /manage-events
ƒ /manage-events/[id]
✓ /profile
✓ /register
```
Generated routes: 12 (`/`, `/_not-found`, `/api/auth/[...all]`, `/create-event`, `/events`, `/events/[id]`, `/joined-events`, `/login`, `/manage-events`, `/manage-events/[id]`, `/profile`, `/register`). ✓ = static prerender, ƒ = dynamic.

**Starting the apps (STEP 3):** first attempt failed because the ports were already taken by leftover processes (full error in §5.3). After stopping those, both apps started cleanly:
- server log: `Server running on port 5000`
- client log: `▲ Next.js 16.4.3` / `- Local: http://localhost:3000` / `✓ Ready in 1032ms`

`GET http://localhost:5000/` → **200** `{"ok":true,"name":"Shomaj Setu API"}`
MongoDB: **no connection errors in any log**; the connection is lazy (`getDb()` on first request) and is proven by every DB-backed response below (queries, inserts, updates, unique-index 409, aggregate `$lookup`).

## 4. Results table

| ID | Test | Expected | Actual | Result |
|---|---|---|---|---|
| E1 | Node/npm versions printed | versions shown | v24.18.0 / 11.16.0 | PASS |
| E2 | `server/.env` var status | all listed | 4 SET, 0 EMPTY | PASS |
| E3 | `client/.env` var status | all listed | 7 SET, 0 EMPTY | PASS |
| E4 | `MONGODB_URI` set in both files | SET | SET in both → proceeded | PASS |
| B1 | `npm install` (server) | success | exit 0, 113 pkgs, 2 moderate vulns warning | PASS |
| B2 | `npm install` (client) | success | exit 0, 80 pkgs, 0 vulns | PASS |
| B3 | `npm run build` (client) | success + routes | exit 0, 12 routes listed | PASS |
| S1 | Start server + `GET /` | `{"ok":true,...}` | 200 `{"ok":true,"name":"Shomaj Setu API"}` | PASS |
| S2 | MongoDB connection (no errors in logs) | no errors | no errors; all DB ops succeeded | PASS |
| S3 | Start client (`next start`) | ready | `✓ Ready in 1032ms`, HTTP 200 | PASS |
| R1 | `GET /` (client) | 200 | 200 | PASS |
| R2 | `GET /events` | 200 | 200 | PASS |
| R3 | `GET /login` | 200 | 200 | PASS |
| R4 | `GET /register` | 200 | 200 | PASS |
| R5 | `GET /create-event` | 200 | 200 | PASS |
| R6 | `GET /manage-events` | 200 | 200 | PASS |
| R7 | `GET /joined-events` | 200 | 200 | PASS |
| R8 | `GET /profile` | 200 | 200 | PASS |
| R9 | `GET /events/000000000000000000000000` | 200 | 200 | PASS |
| R10 | `GET /random-unknown-path-xyz` | 404 page, no crash | 404, custom Next HTML 404 page served | PASS |
| A1 | `GET /events` (public) | 200 | 200 `[]` (DB empty at the time) | PASS |
| A2 | `GET /events?limit=6` | 200 | 200 `[]` | PASS |
| A3 | `GET /events?search=a&type=all` | 200 | 200 `[]` | PASS |
| A4 | `GET /events/not-a-valid-id` | 404 | 404 `{"message":"Event not found"}` | PASS |
| U1 | `POST /events` no token | 401 | 401 `Unauthorized: access token is missing` | PASS |
| U2 | `GET /events/mine` no token | 401 | 401 same message | PASS |
| U3 | `GET /joins/me` no token | 401 | 401 same message | PASS |
| U4 | `POST /joins/<id>` no token | 401 | 401 same message | PASS |
| AU1 | Sign-up user A (`sign-up/email`, cookie jar, Origin header) | success | 200, user id `6ae835c542b5a087c8a176c8`, email `qa-a-1793602971@example.com` | PASS |
| AU2 | `GET /api/auth/token` (user A) | JWT | 200, 623-char EdDSA JWT saved to file | PASS |
| AU3 | `GET /api/auth/jwks` | keys present | 200, 1 key `{"alg":"EdDSA","crv":"Ed25519",...}` | PASS |
| AU4 | Sign-up user B | success | 200, user id `6ae835d542b5a087c8a176cb` | PASS |
| AU5 | `GET /api/auth/token` (user B) | JWT | 200, 623-char JWT saved | PASS |
| C1 | `POST /events` valid data (user A) | 201 + insertedId | 201 `{"insertedId":"6ae8360644f0933e9ad38fb0",...}` | PASS |
| C2 | Validation: past eventDate | 400 + errors | 400 `errors.eventDate="Event date must be in the future"` | PASS |
| C3 | Validation: empty title | 400 + errors | 400 `errors.title="Title must be at least 5 characters"` | PASS |
| C4 | Validation: short description | 400 + errors | 400 `errors.description="Description must be at least 20 characters"` | PASS |
| C5 | Validation: invalid thumbnail URL | 400 + errors | 400 `errors.thumbnail="Please enter a valid image URL"` | PASS |
| C6 | Validation: invalid eventType | 400 + errors | 400 `errors.eventType="Please choose a valid event type"` | PASS |
| C7 | `GET /events/mine` contains new event | contains it | 200, 1 event, title present | PASS |
| C8 | `GET /events/<id>` | returns it | 200, full event JSON | PASS |
| C9 | `GET /events` (upcoming) includes it | included | count=1, included | PASS |
| C10 | `PUT /events/<id>` changed title → verify | 200 + new title | 200 `Event updated successfully`; GET shows `QA Test Cleanup Drive UPDATED` | PASS |
| J1 | User B `PUT` user A's event | 403 | 403 `You can only update your own events` | PASS |
| J2 | User B `DELETE` user A's event | 403 | 403 `You can only delete your own events` | PASS |
| J3 | User B `POST /joins/<id>` | 201 | 201 `You have joined the event` | PASS |
| J4 | participants after join | 1 | `participants=1` | PASS |
| J5 | Duplicate join | 409, no double count | 409 `You have already joined this event`, participants still 1 | PASS |
| J6 | `GET /joins/me` (user B) | contains event | 200, array with event + `joinId` + `joinedAt` | PASS |
| J7 | `GET /joins/status/<id>` (user B) | `joined:true` | 200 `{"joined":true}` | PASS |
| J8 | `DELETE /joins/<id>` (leave) | 200 | 200 `You have left the event` | PASS |
| J9 | participants after leave | 0 | `participants=0` | PASS |
| J10 | Re-join (join record exists pre-deletion) | 201 | 201 `You have joined the event` | PASS |
| D1 | User A `DELETE` own event | 200 | 200 `Event deleted successfully` | PASS |
| D2 | `GET /events/<id>` after delete | 404 | 404 `{"message":"Event not found"}` | PASS |
| D3 | User B `GET /joins/me` after delete | empty | 200 `[]` (join cascade-deleted) | PASS |
| T1 | `POST /events` with random token | 401 | 401 `Unauthorized: invalid or expired token` | PASS |
| T2 | `POST /events` with modified JWT (last char flipped) | 401 | 401 `Unauthorized: invalid or expired token` | PASS |
| P1 | Insert event with past `eventDate` (node script) | inserted | `INSERTED_ID=6ae836f1b7a5e79f09b2faaa` | PASS |
| P2 | `GET /events` excludes past event | not returned | `count=0 containsPastEvent=False` | PASS |
| P3 | `POST /joins/<past id>` | 400 "already ended" | 400 `This event has already ended` | PASS |
| P4 | Delete the past test event afterwards | deleted | `DELETED_EVENTS=1 DELETED_JOINS=0` | PASS |
| UI1 | Register through UI → success toast | toast appears | `"Account created! Welcome to Shomaj Setu."` | PASS |
| UI2 | Register → redirect | `/` | `http://localhost:3000/` | PASS |
| UI3 | Navbar shows Login when logged out | visible | visible | PASS |
| UI4 | Navbar shows avatar when logged in | visible | visible | PASS |
| UI5 | Navbar shows Logout when logged in | visible | visible (at 1280px) | PASS |
| UI6 | Create event via form → redirect | `/events` | `http://localhost:3000/events` | PASS |
| UI7 | New event visible on `/events` | visible | `QA UI Created Event` visible | PASS |
| UI8 | `/manage-events` reload stays (no bounce to `/login`) | stays | pathname `/manage-events` after reload | PASS |
| UI9 | Theme toggle changes `data-theme` | civic ↔ civicdark | `civic -> civicdark -> civic` | PASS |
| UI10 | 9 screenshots (375/768/1280 × /, /events, /login) | 9 files | 9 files in `./qa-report/screenshots/` | PASS |
| ST1 | Grep "Lorem"/"lorem ipsum" | none | 0 matches | PASS |
| ST2 | Grep `alert(` | none | 0 matches | PASS |
| ST3 | `localStorage` only in theme code | theme-only | only `layout.js:15` + `ThemeToggle.jsx:16` | PASS |
| ST4 | `.gitignore` lists `.env` (client) | listed | `.env`, `.env.local` present | PASS |
| ST5 | `.gitignore` lists `.env` (server) | listed | `.env` present | PASS |
| ST6 | README: site name + live URL line + ≥5 feature bullets | all 3 | name ✓, live URL line ✓ (placeholder value), 8 feature bullets ✓ | PASS |
| CL1 | Cleanup: delete test events/joins/users | removed | deleted 2 QA events + 4 QA users + 4 sessions + 4 accounts; QA joins already 0 (cascade-deleted with events); residue `qa events=0 joins=0 users=0` | PASS |
| X1 | Google OAuth social login (UI) | — | needs external Google consent flow/credentials | SKIPPED |
| X2 | Edit form submit on `/manage-events/[id]` (UI) | — | not in required checklist; only route status checked | SKIPPED |
| X3 | Profile update save (UI) | — | not in required checklist; only route status checked | SKIPPED |

## 5. Failures in detail

No checklist test failed (0 FAIL). The items below are the defects/observations found, plus harness artifacts that are **not** product bugs.

### 5.1 (Defect, minor) favicon 404 — browser console error on every page
- **Request:** `GET http://localhost:3000/favicon.ico` → **HTTP 404**
- **Evidence (console probe):**
```
CONSOLE_ERROR url=http://localhost:3000/favicon.ico text=Failed to load resource: the server responded with a status of 404 (Not Found)
```
  and `curl -s -o NUL -w "%{http_code}" http://localhost:3000/favicon.ico` → `404`
- **Responsible location:** `C:\client\src\app\layout.js:9-12` (`metadata` has no `icons` entry) and missing file — `C:\client\public\` contains only `gallery/g1.jpg…g8.jpg` + `.gitkeep`.
- **Impact:** one failed request + console error per page view; no functional impact.

### 5.2 (Defect, minor) 2 moderate npm-audit vulnerabilities in the server
- **Command:** `npm audit` in `C:\server` (exit 1)
```
minimatch  <11.0.1
Severity: moderate
minimatch has potential denial of service via globparts amplification - https://github.com/advisories/GHSA-g3hv-75wg-m249
fix available via `npm audit fix --force`
Will install nodemon@1.0.2, which is a breaking change
node_modules/minimatch
  nodemon  ... Depends on vulnerable versions of minimatch
2 moderate severity vulnerabilities
```
- **Responsible location:** `C:\server\package.json:18` — `"nodemon": "^3.1.14"` is listed under `"dependencies"` although `dev`/`start` scripts don't use it.
- **Log lines:** from `npm install` output (§3). Client project: `found 0 vulnerabilities`.

### 5.3 (Environment, not a code defect) `EADDRINUSE` — stale processes held ports 5000 and 3000
- **Command:** `npm run start` in `C:\server` (first attempt)
```
Error: listen EADDRINUSE: address already in use :::5000
    at Server.setupListenHandle [as _listen2] (node:net:2009:16)
    at Server.listen (C:\server\node_modules\express\lib\application.js:635:24)
    at file:///C:/server/src/index.js:37:7
Node.js v24.18.0
```
  and in `C:\client`:
```
⨯ Failed to start server
Error: listen EADDRINUSE: address already in use :::3000
```
- **Diagnosis:** `Get-CimInstance Win32_Process` showed leftover processes from a previous session: `node src/index.js`, `node --watch src/index.js`, `next dist/bin/next dev`, `next .../start-server.js`, and two `npm run dev`.
- **Resolution:** stopped those PIDs, confirmed `both ports free`, started fresh instances (which then passed every test).

### 5.4 (Not a product bug) README live-URL placeholder
- **File:** `C:\client\README.md:3` → `**Live site:** https://your-live-site-url.vercel.app`
- The *line* exists (checklist satisfied) but the URL is a placeholder, so the README's live-site claim cannot be verified. Server README was not required.

### 5.5 (Not a product bug) Test-harness artifacts observed during the run
- `POST /api/auth/sign-up/email` first returned **400 `{"message":"Invalid JSON in request body","code":"BAD_REQUEST"}`** — caused by PowerShell quoting mangling the inline JSON body; re-sent from a file with `-d @file` → 200. Server behavior on malformed JSON is correct.
- Two `HTTP 000` results from `curl` — caused by a trailing newline inside a variable used in the URL (harness bug), re-run cleanly → 200.
- 34 "failed request" entries in the browser run, all benign:
  - `https://example.com/ui.png|ui-event.png :: net::ERR_BLOCKED_BY_ORB` — my dummy thumbnail URLs return 404 and Chrome's Opaque Response Blocking stops them (test data, not app code).
  - `http://localhost:3000/events/<id>?_rsc=... :: net::ERR_ABORTED` — normal Next.js RSC prefetch cancellation on navigation.

## 6. Console and server log excerpts

**Server log (`npm run start`, `C:\server`) — complete, no errors:**
```
> shomaj-setu-server@1.0.0 start
> node src/index.js

Server running on port 5000
```
No MongoDB errors, no stack traces, no 5xx-related `console.error` output across the whole run (the Express error handler at `C:\server\src\index.js` never fired).

**Client log (`npm run start`, `C:\client`) — complete, no errors:**
```
> shomaj-setu-client@1.0.0 start
> next start

▲ Next.js 16.4.3
- Local:   http://localhost:3000
- Network: http://192.168.0.101:3000
✓ Ready in 1032ms
✓ Running next.config.mjs took 108ms
```
No compile warnings, no request errors, no hydration warnings.

**Browser console (Playwright run, all pages):**
```
CONSOLE ERRORS (1)
[main] Failed to load resource: the server responded with a status of 404 (Not Found)   ← favicon.ico (§5.1)

FAILED REQUESTS (34)
[main] FAILED https://example.com/ui.png        :: net::ERR_BLOCKED_BY_ORB   (dummy test image, 404)
[main] FAILED https://example.com/ui-event.png  :: net::ERR_BLOCKED_BY_ORB   (dummy test image, 404)
[main] FAILED http://localhost:3000/events/<id>?_rsc=... :: net::ERR_ABORTED  (RSC prefetch cancel, benign)
... same three categories only
```
No `PAGEERROR` (uncaught exception) was recorded, and no request to the API (`localhost:5000`) returned 4xx/5xx during the browser session.

## 7. Static check results

| Check | Command | Result |
|---|---|---|
| "Lorem" / "lorem ipsum" | `Select-String -Pattern 'Lorem\|lorem ipsum'` over `client/src` + `server/src` (js/jsx/ts/tsx/mjs/css) | **0 matches** ✅ |
| `alert(` (default alert) | `Select-String -Pattern 'alert\('` over both `src` trees | **0 matches** ✅ |
| `localStorage` outside theme code | `Select-String -Pattern 'localStorage'` | 2 hits, both theme code: `C:\client\src\app\layout.js:15` (pre-paint theme script) and `C:\client\src\components\ThemeToggle.jsx:16` (`localStorage.setItem("theme", next)`) ✅ |
| `.env` in `client/.gitignore` | read file | `.env` and `.env.local` listed ✅ (also `node_modules`, `.next`, `.vercel`) |
| `.env` in `server/.gitignore` | read file | `.env` listed ✅ (also `node_modules`, `.vercel`) |
| README site name | `C:\client\README.md:1` | `# Shomaj Setu — Social Development Events Platform` ✅ |
| README live URL line | `C:\client\README.md:3` | `**Live site:** https://your-live-site-url.vercel.app` — line present ✅, but placeholder value ⚠️ (§5.4) |
| README feature bullets | `C:\client\README.md:9-17` | **8 bullets** under "## Key features" (≥5 required) ✅ |

Bonus observations (not required): `server/README.md` exists; `server/vercel.json` exists; server `package.json` ships `nodemon` as a runtime dependency (§5.2).

## 8. Screenshots list

Saved to `C:\client\qa-report\screenshots\` (Playwright-core + system Chrome, `fullPage`, viewport heights 900):

| File | Size (bytes) |
|---|---|
| `home-375.png` | 580455 |
| `events-375.png` | 198070 |
| `login-375.png` | 158765 |
| `home-768.png` | 762035 |
| `events-768.png` | 202742 |
| `login-768.png` | 218875 |
| `home-1280.png` | 740898 |
| `events-1280.png` | 243566 |
| `login-1280.png` | 321447 |

9/9 captured (`UI-6 PASS`). Screenshots were taken in a logged-out browser context so `/login` shows the real login page.

## 9. Things you could not verify

1. **Google OAuth login** (`SocialLogin` component, `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are SET but their values were not inspected per the no-secrets rule) — requires an external Google consent flow and valid redirect registration → **SKIPPED**.
2. **UI submit on `/manage-events/[id]` (edit form)** and **`/profile` save** — not part of the required checklist; only their HTTP route status was verified (both 200) → **SKIPPED**.
3. **A real production deployment** — the README live URL is a placeholder, so no deployed environment was tested; everything ran against `localhost:3000` / `localhost:5000`.
4. **Correctness/strength of secret values** (`BETTER_AUTH_SECRET`, MongoDB credentials, Google secret) — intentionally not read; only SET/EMPTY recorded. Whether `BETTER_AUTH_SECRET` is strong enough, and whether the `.env` Google values are real or placeholder, is unknown.
5. **Concurrency/race behaviour** (parallel joins, double-submit) — only the duplicate-join unique-index path was exercised (single client).
6. **Other browsers/devices** — Chrome (system install) only; no Firefox/WebKit, no real mobile device. iOS Safari, screen readers, and zoom/a11y behaviour untested.
7. **Password reset / email verification flows** — not present in the UI/API surface I exercised; not tested.
8. **Long-run stability** — servers were up for the duration of the test session only (~10 minutes); no soak/load testing.

**Cleanup performed (STEP 8):** deleted the 2 QA events, all QA joins, all 4 QA users (BetterAuth `user`, `session`, `account` docs) — verified `REMAINING qa events=0 joins=0 users=0`, `TOTAL_EVENTS_REMAINING=0`. One pre-existing non-QA user (`msnazminakter690@gmail.com`) and their session/account were left untouched. All background processes stopped; `Get-NetTCPConnection` confirms **ports 5000 and 3000 are free**.
