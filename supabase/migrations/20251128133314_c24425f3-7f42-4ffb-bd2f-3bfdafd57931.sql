-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table for blog entries
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create images table for post photos
CREATE TABLE public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  exif_data JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (published = true OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- Images policies
CREATE POLICY "Images from published posts viewable by everyone"
  ON public.images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = images.post_id
      AND (posts.published = true OR posts.author_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can insert images"
  ON public.images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_id
      AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update images on own posts"
  ON public.images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = images.post_id
      AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Authors can delete images from own posts"
  ON public.images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = images.post_id
      AND posts.author_id = auth.uid()
    )
  );

-- Newsletter policies
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Trigger for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updated_at on posts
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();