
-- Fix the security definer view - recreate with SECURITY INVOKER (default)
DROP VIEW IF EXISTS public.quiz_options_safe;

-- Recreate view explicitly with SECURITY INVOKER
CREATE VIEW public.quiz_options_safe 
WITH (security_invoker = true) AS
SELECT id, question_id, option_text, order_index
FROM public.quiz_options;
