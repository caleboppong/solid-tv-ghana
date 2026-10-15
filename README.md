# SOLID TV Ghana — Phases 3–6

React + Vite website with Supabase editorial CMS and Vercel serverless endpoints.

## Local frontend
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run `npm run dev`.

The frontend works locally with Supabase, but `/api/*` endpoints require the Vercel runtime (`npx vercel dev`) or deployment. Do not expose the Supabase service-role key or YouTube API key through VITE-prefixed variables.

## Database
Run `supabase/phase3-6-hardening.sql` after the previously supplied complete SQL. It removes unsafe editor/staff mutation paths and permits only owners or admins to edit drafts. Existing data is retained.

## Vercel environment (server-only)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: server secret; **never place in VITE_ variables or source control**
- `YOUTUBE_API_KEY`: YouTube Data API v3 key, restrict appropriately
- `YOUTUBE_CHANNEL_ID`: actual channel ID beginning with `UC` (not @handle)
- Optional `YOUTUBE_LIVE_VIDEO_ID`: manually override live video detection (clear when finished)

Vercel supports the `api/*.js` endpoints. `/api/live-status` caches status for 10 minutes per running instance and uses platform caching to reduce YouTube quota. Search calls cost 100 units each; monitor your quota. No endpoint can guarantee zero delay in live detection.

## Admin
Sign in via Staff Portal. Super Admin can create staff users with a temporary password, change roles and delete non-super-admin accounts. These operations require the server-only admin endpoint and a verified bearer token. The service-role key must never reach the browser.

## Publishing
Staff submits unpublished content; editor/admin/super_admin may publish their own content. Admins can manage all content. News images upload to the `solid-tv-media` bucket. TikTok links open the original post; they are not yet in-page TikTok iframe embeds.

## Test before deployment
Verify sign-in, role checks, create/edit/delete, image upload, contact messages, admin API and YouTube Live. Test with multiple roles. The automatic live service requires server configuration and a real channel ID. Check accessibility and content with actual station personnel before launch.
