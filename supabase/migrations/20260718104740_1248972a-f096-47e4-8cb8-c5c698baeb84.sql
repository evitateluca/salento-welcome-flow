
-- Fix search_path on helper (it was set inline but linter still warns; re-declare)
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.assign_first_admin() SET search_path = public;
ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = public;

-- Trigger functions must not be callable by clients
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_first_admin() FROM PUBLIC, anon, authenticated;
