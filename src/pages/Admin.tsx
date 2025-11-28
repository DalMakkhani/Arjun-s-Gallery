import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import FilmGrain from "@/components/FilmGrain";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, published, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Post deleted",
        description: "The post has been removed.",
      });
      fetchPosts();
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("posts")
      .update({ 
        published: !currentStatus,
        published_at: !currentStatus ? new Date().toISOString() : null
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: currentStatus ? "Post unpublished" : "Post published",
        description: currentStatus ? "The post is now hidden." : "The post is now live.",
      });
      fetchPosts();
    }
  };

  return (
    <div className="min-h-screen page-enter">
      <FilmGrain />
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-16 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-semibold">Dashboard</h1>
          <Button asChild>
            <Link to="/admin/new">
              <Plus className="mr-2 h-4 w-4" />
              New Story
            </Link>
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl mb-4">No stories yet</p>
            <Button asChild>
              <Link to="/admin/new">Create your first story</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-6 bg-card border border-border"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-display font-semibold mb-1">
                    {post.title}
                  </h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                    <span className={post.published ? "text-green-600" : "text-amber-600"}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(post.id, post.published)}
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/admin/edit/${post.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
