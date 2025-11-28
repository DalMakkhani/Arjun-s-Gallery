import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import FilmGrain from "@/components/FilmGrain";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  published_at: string;
  images?: Array<{
    url: string;
    caption?: string;
    exif_data?: any;
  }>;
}

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExif, setShowExif] = useState(false);

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        content,
        published_at,
        images (
          url,
          caption,
          exif_data,
          display_order
        )
      `)
      .eq("id", id)
      .eq("published", true)
      .single();

    if (!error && data) {
      if (data.images) {
        data.images.sort((a: any, b: any) => a.display_order - b.display_order);
      }
      setPost(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FilmGrain />
        <Header />
        <p className="text-muted-foreground">Loading story...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FilmGrain />
        <Header />
        <div className="text-center">
          <p className="text-2xl font-display mb-4">Story not found</p>
          <Link to="/blog" className="text-sm border-b border-foreground pb-1 hover:opacity-60 transition-opacity">
            Back to all stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-enter">
      <FilmGrain />
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24 max-w-5xl">
        <Link 
          to="/blog"
          className="inline-flex items-center text-sm hover:opacity-60 transition-opacity mb-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to stories
        </Link>
        
        <article className="space-y-12 fade-in">
          <header className="space-y-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time>{format(new Date(post.published_at), "dd/MM/yy")}</time>
              <span>·</span>
              <span>Camera Model</span>
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-display leading-tight">
              {post.title}
            </h1>
          </header>

          {post.images && post.images.length > 0 && (
            <div className="space-y-16 my-16">
              {post.images.map((image, index) => (
                <div key={index} className="space-y-4">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={image.url}
                      alt={image.caption || `Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {image.caption && (
                    <p className="text-sm text-muted-foreground">
                      {image.caption}
                    </p>
                  )}
                  {image.exif_data && (
                    <>
                      <button
                        onClick={() => setShowExif(!showExif)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors border-b border-muted-foreground"
                      >
                        {showExif ? "Hide" : "Show"} technical details
                      </button>
                      {showExif && (
                        <pre className="text-xs bg-muted p-4 overflow-auto font-mono">
                          {JSON.stringify(image.exif_data, null, 2)}
                        </pre>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-xl max-w-none leading-relaxed text-lg space-y-6">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
