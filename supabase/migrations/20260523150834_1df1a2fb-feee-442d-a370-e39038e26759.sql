
revoke execute on function public.set_updated_at() from anon, authenticated, public;
revoke execute on function public.create_initial_event() from anon, authenticated, public;
revoke execute on function public.log_status_change() from anon, authenticated, public;
revoke execute on function public.handle_new_user_role() from anon, authenticated, public;
