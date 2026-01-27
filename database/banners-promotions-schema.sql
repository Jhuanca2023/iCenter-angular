-- ==========================================
-- BANNERS AND PROMOTIONS SCHEMA
-- ==========================================

-- 1. Table for Hero Carousel Banners
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    link_url TEXT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table for Popup Ads (Modals)
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DROP POLICY IF EXISTS "Lectura pública para banners" ON public.banners;
DROP POLICY IF EXISTS "Admin control total banners" ON public.banners;
DROP POLICY IF EXISTS "Lectura pública para promos" ON public.promotions;
DROP POLICY IF EXISTS "Admin control total promos" ON public.promotions;

CREATE POLICY "Lectura pública para banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Admin control total banners" ON public.banners FOR ALL USING (true);

CREATE POLICY "Lectura pública para promos" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "Admin control total promos" ON public.promotions FOR ALL USING (true);

-- NOTE: Developers must manually create a public storage bucket named 'banners' in Supabase.
