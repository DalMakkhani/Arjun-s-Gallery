import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    setLoading(false);

    if (error) {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscribed!",
        description: "Thank you for joining our journey.",
      });
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border mt-24 py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center space-y-6">
          <h3 className="font-display text-xl">Stay Connected</h3>
          <p className="text-muted-foreground text-sm">
            Subscribe to receive new stories in your inbox
          </p>
          
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-card"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              Subscribe
            </Button>
          </form>
          
          <div className="pt-8 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Photography Journal. All moments preserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
