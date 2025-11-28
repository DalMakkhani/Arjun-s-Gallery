import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import FilmGrain from "@/components/FilmGrain";
import Header from "@/components/Header";
import RichTextEditor from "@/components/RichTextEditor";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication error",
        description: "Please sign in again",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        title,
        excerpt,
        content,
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: publish ? "Post published!" : "Draft saved",
        description: publish ? "Your story is now live" : "Your draft has been saved",
      });
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen page-enter">
      <FilmGrain />
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-16 max-w-3xl">
        <Link 
          to="/admin"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>

        <h1 className="text-4xl font-display font-semibold mb-8">Create New Story</h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="A moment captured..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-display"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (optional)</Label>
            <Textarea
              id="excerpt"
              placeholder="A brief preview of your story..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Tell your story... Click the image icon to add photos!"
            />
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: Click the image button to upload photos directly or paste image URLs
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => handleSave(false)}
              disabled={loading}
              variant="outline"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={loading}
            >
              Publish Story
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPost;
