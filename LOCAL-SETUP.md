# SOLID TV Ghana — local setup and admin API fix

The Vite development server now runs the two existing `/api/` handlers locally through a Vite middleware plugin. On Vercel the existing `api/*.js` serverless functions remain available.

1. Copy your existing `.env` file into this folder (do not share it or commit it).
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the frontend.
3. Add the following **server-only** entries to `.env` (without `VITE_` prefixes):

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_SERVICE_ROLE_KEY
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
YOUTUBE_CHANNEL_ID=YOUR_YOUTUBE_CHANNEL_ID
```

The YouTube entries are optional until live detection is configured. Never expose the service role key in client code, screenshots, or Git. Keep `.env` untracked.

4. Run `npm install`, then `npm run dev`. Restart the server after changing `.env`.
5. In the browser, open `http://localhost:5173/api/live-status` to check the local API. It should return JSON.
6. Sign in with your confirmed Super Admin account, and create a staff account using a password of at least 12 characters.
7. If creation fails, the dashboard now displays the backend error or HTTP status instead of the generic invalid response.

For deployment, set the same server-only variables in the Vercel project environment settings. The frontend public variables must also be configured there.

Do not run `supabase/schema.sql` again; your existing database remains untouched.
