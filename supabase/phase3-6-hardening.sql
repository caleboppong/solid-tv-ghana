-- Apply after solid_tv_ghana_complete.sql; no data deletion.
-- Prevent a staff member from editing another user's content or publishing via direct API.
drop policy if exists "news edit" on public.news;
create policy "news edit" on public.news for update to authenticated
using ((select public.is_admin()) or ((select public.is_staff()) and author_id=(select auth.uid())))
with check (((select public.is_admin()) or ((select public.is_staff()) and author_id=(select auth.uid()))) and (not published or (select public.is_editor())));
drop policy if exists "videos edit" on public.videos;
create policy "videos edit" on public.videos for update to authenticated
using ((select public.is_admin()) or ((select public.is_staff()) and author_id=(select auth.uid())))
with check (((select public.is_admin()) or ((select public.is_staff()) and author_id=(select auth.uid()))) and (not published or (select public.is_editor())));
-- Contact submissions are public. Configure CAPTCHA/rate limiting before a high-traffic launch.
