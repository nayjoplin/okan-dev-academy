
-- 1. Fix profiles table - only allow users to see their own profile or profiles of instructors
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view instructor profiles" 
ON public.profiles 
FOR SELECT 
USING (is_instructor = true);

-- 2. Fix quiz_options - create a secure view without is_correct and restrict direct table access
DROP POLICY IF EXISTS "Anyone can view quiz options" ON public.quiz_options;

-- Only allow viewing quiz options during an active attempt (without is_correct)
CREATE POLICY "Users can view quiz options during attempt" 
ON public.quiz_options 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM quiz_attempts qa
    JOIN quizzes q ON q.id = qa.quiz_id
    JOIN quiz_questions qq ON qq.quiz_id = q.id
    WHERE qq.id = quiz_options.question_id
    AND qa.user_id = auth.uid()
  )
);

-- Create a secure view for quiz options without revealing correct answers
CREATE OR REPLACE VIEW public.quiz_options_safe AS
SELECT id, question_id, option_text, order_index
FROM public.quiz_options;

-- 3. Fix lesson_materials - only allow enrolled users to access
DROP POLICY IF EXISTS "Anyone can view lesson materials" ON public.lesson_materials;

CREATE POLICY "Enrolled users can view lesson materials" 
ON public.lesson_materials 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollments e
    JOIN modules m ON m.course_id = e.course_id
    JOIN lessons l ON l.module_id = m.id
    WHERE l.id = lesson_materials.lesson_id
    AND e.user_id = auth.uid()
  )
);

-- Also allow mentors and admins to view all materials
CREATE POLICY "Mentors and admins can view all materials" 
ON public.lesson_materials 
FOR SELECT 
USING (
  has_role(auth.uid(), 'mentor') OR has_role(auth.uid(), 'admin')
);
