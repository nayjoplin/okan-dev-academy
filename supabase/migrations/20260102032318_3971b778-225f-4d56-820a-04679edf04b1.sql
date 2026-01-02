-- Admin policies for tracks
CREATE POLICY "Admins can insert tracks" ON public.tracks FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update tracks" ON public.tracks FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete tracks" ON public.tracks FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all tracks" ON public.tracks FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for courses
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all courses" ON public.courses FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for modules
CREATE POLICY "Admins can insert modules" ON public.modules FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update modules" ON public.modules FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete modules" ON public.modules FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all modules" ON public.modules FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for lessons
CREATE POLICY "Admins can insert lessons" ON public.lessons FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update lessons" ON public.lessons FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete lessons" ON public.lessons FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all lessons" ON public.lessons FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for lesson_materials
CREATE POLICY "Admins can insert materials" ON public.lesson_materials FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update materials" ON public.lesson_materials FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete materials" ON public.lesson_materials FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for certificates
CREATE POLICY "Admins can insert certificates" ON public.certificates FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update certificates" ON public.certificates FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete certificates" ON public.certificates FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all certificates" ON public.certificates FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for enrollments
CREATE POLICY "Admins can view all enrollments" ON public.enrollments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update enrollments" ON public.enrollments FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete enrollments" ON public.enrollments FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for quizzes and questions
CREATE POLICY "Admins can insert quizzes" ON public.quizzes FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update quizzes" ON public.quizzes FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete quizzes" ON public.quizzes FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert quiz questions" ON public.quiz_questions FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update quiz questions" ON public.quiz_questions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete quiz questions" ON public.quiz_questions FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert quiz options" ON public.quiz_options FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update quiz options" ON public.quiz_options FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete quiz options" ON public.quiz_options FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all quiz options" ON public.quiz_options FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Mentor policies - mentors can view courses they are assigned to (using is_instructor in profiles)
CREATE POLICY "Mentors can view all published courses" ON public.courses FOR SELECT USING (has_role(auth.uid(), 'mentor'::app_role));
CREATE POLICY "Mentors can view all modules" ON public.modules FOR SELECT USING (has_role(auth.uid(), 'mentor'::app_role));
CREATE POLICY "Mentors can view all lessons" ON public.lessons FOR SELECT USING (has_role(auth.uid(), 'mentor'::app_role));
CREATE POLICY "Mentors can view all enrollments" ON public.enrollments FOR SELECT USING (has_role(auth.uid(), 'mentor'::app_role));
CREATE POLICY "Mentors can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'mentor'::app_role));
CREATE POLICY "Mentors can view lesson progress" ON public.lesson_progress FOR SELECT USING (has_role(auth.uid(), 'mentor'::app_role));
CREATE POLICY "Mentors can view all tracks" ON public.tracks FOR SELECT USING (has_role(auth.uid(), 'mentor'::app_role));