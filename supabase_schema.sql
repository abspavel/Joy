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


-- 5. Blog Posts Table (Text-only, SEO-optimized Articles)
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    keywords TEXT[],
    published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read_time_minutes INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access only where published = true
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts 
    FOR SELECT USING (published = true);

-- Full read/write access for admin
CREATE POLICY "Admins have full access to blog posts" ON public.blog_posts 
    FOR ALL USING (auth.role() = 'authenticated');


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

INSERT INTO public.blog_posts (title, slug, excerpt, content, keywords, published, read_time_minutes) VALUES
(
  'Optimizing 3D Web Experiences: WebGL, Three.js, and Modern Frontend Performance',
  'optimizing-3d-web-experiences-webgl-threejs-performance',
  'Discover key architectural techniques to deliver silky 60fps 3D graphics on the web without sacrificing initial page load speed or mobile responsiveness.',
  'Interactive 3D graphics have evolved from niche experimental demos into powerful visual anchors for modern web products. However, integrating Three.js or custom WebGL pipelines into production web applications introduces tangible performance tradeoffs if not engineered with discipline.

### The Golden Rule: Budgeting Your GPU and CPU Cycles

When a browser renders a 3D scene, it orchestrates a tight loop between JavaScript execution on the CPU and shader rasterization on the GPU. To maintain a locked 60 frames per second (or 120Hz on high-refresh displays), every frame must calculate and paint in under 16.6 milliseconds.

1. **Batch Your Draw Calls**: Minimize unique material and geometry instances. Instanced meshes allow hundreds of distinct entities to render with a single GPU draw call.
2. **Defer Canvas Initialization**: Never block the browser''s First Contentful Paint (FCP) with heavy WebGL texture uploads or shader compilation. Initialize the canvas lazily using requestIdleCallback or intersection observers.
3. **Dispose Geometry & Textures**: Single Page Applications do not automatically garbage collect WebGL buffers. Always call `.dispose()` on unused buffers when components unmount.

### Mobile-First Scaling & Device Profiling

Not every visitor carries a workstation GPU. Detecting device pixel ratios (`window.devicePixelRatio`) and clamping render resolutions between 1.0x and 1.5x on high-DPI screens preserves battery life while preventing thermal throttling.

By treating 3D as an enhancement layer rather than a blocker, your digital experiences remain blazing fast, accessible, and breathtaking.',
  ARRAY['webgl', 'threejs', 'web-performance', 'frontend', '3d-graphics', 'creative-tech'],
  true,
  4
),
(
  'Modern Web Animation Architecture: CSS vs Canvas vs Motion Physics',
  'modern-web-animation-architecture-css-canvas-motion',
  'A comprehensive breakdown of when to leverage hardware-accelerated CSS, GPU-bound Canvas loops, or component-level gesture physics in modern web applications.',
  'Fluid animations transform functional user interfaces into tactile, engaging digital artifacts. Yet choosing the wrong execution engine can introduce jank, stutter, and battery drain.

### Comparing Animation Paradigms

- **CSS Transitions and Transforms**: Ideal for micro-interactions, button hover states, and navigational reveals. CSS `transform` and `opacity` mutate elements on the compositor thread without triggering layout reflows.
- **Spring & Physics Libraries (Motion)**: Essential for natural gesture-driven UI components like drawers, magnetic buttons, and card carousels. Physics-based springs prevent artificial robotic linear movement.
- **Canvas & WebGL Renderers**: Built for procedural particle grids, rising lines, and organic fluid simulations where thousands of elements move simultaneously.

### Best Practices for Stutter-Free Motion

- Always mark animating layers with `will-change: transform` judiciously.
- Favor `requestAnimationFrame` over `setInterval` for any manual calculation.
- Throttle or debounce window scroll listeners with passive event options (`{ passive: true }`).

Thoughtful motion design communicates spatial hierarchy and delights visitors without ever getting in their way.',
  ARRAY['web-animation', 'css-animations', 'react', 'framer-motion', 'ui-ux-design'],
  true,
  5
);
