-- =====================================================================================
-- Supabase Schema for Portfolio Website
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/ywkcfpdoduaipyzruhnz/sql)
-- =====================================================================================

-- 1. Contact Messages Table (To receive messages from the ContactButton)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow anyone to insert (so website visitors can send messages)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
-- Only authenticated users (or service role) can read messages
CREATE POLICY "Only admins can view messages" ON public.contact_messages FOR SELECT USING (auth.role() = 'authenticated');


-- 2. Projects Table (For the ProjectsSection)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    live_link TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow anyone to read active projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active projects" ON public.projects FOR SELECT USING (is_active = true);


-- 3. Services Table (For the ServicesSection)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow anyone to read active services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);


-- 4. Gallery Images Table (For Marquee or ImageCircle Sections)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    section TEXT NOT NULL, -- 'marquee', 'circle_inner', 'circle_outer'
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow anyone to read active gallery images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active gallery images" ON public.gallery_images FOR SELECT USING (is_active = true);


-- =====================================================================================
-- Dummy Data Seeding (Optional: Run this to populate your website initially)
-- =====================================================================================

INSERT INTO public.projects (title, category, description, image_url) VALUES
('Space Voyage', 'Web Design', 'A deep space exploration landing page.', 'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif'),
('CodeNest', 'Branding', 'Developer portfolio branding and UI.', 'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif'),
('Vex Ventures', 'UX/UI', 'Venture capital firm website redesign.', 'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif');

INSERT INTO public.services (title, description) VALUES
('Brand Identity', 'Creating memorable and timeless visual identities that help businesses stand out.'),
('UI/UX Design', 'Designing intuitive, user-centric interfaces that engage and convert.'),
('Web Development', 'Building fast, responsive, and scalable modern web applications.');
