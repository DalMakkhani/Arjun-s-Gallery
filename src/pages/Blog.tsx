import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BlogCard from "@/components/BlogCard";
import FilmGrain from "@/components/FilmGrain";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  published_at: string;
  images?: { url: string }[];
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        excerpt,
        published_at,
        images (url)
      `)
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen page-enter">
      <FilmGrain />
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24 max-w-6xl">
        <div className="mb-20">
          <h1 className="text-6xl lg:text-7xl font-display mb-4">Stories</h1>
          <p className="text-xl text-muted-foreground">
            A collection of moments captured through the lens
          </p>
        </div>
        
        {loading ? (
          <div className="text-center text-muted-foreground py-20">Loading stories...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-2xl font-display mb-2">No stories yet.</p>
            <p className="text-lg">Come back soon for new moments captured.</p>
          </div>
        ) : (
          <div className="space-y-32">
            {posts.map((post, index) => (
              <div key={post.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <BlogCard
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt || ""}
                  publishedAt={post.published_at}
                  imageUrl={post.images?.[0]?.url}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
