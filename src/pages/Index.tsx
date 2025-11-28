import { Link } from "react-router-dom";
import FilmGrain from "@/components/FilmGrain";
import Header from "@/components/Header";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const Index = () => {
  const section2Ref = useScrollAnimation();
  const section3Ref = useScrollAnimation();
  const ctaRef = useScrollAnimation();

  return (
    <div className="min-h-screen page-enter">
      <FilmGrain />
      <Header />
      
      <main className="min-h-screen pt-16">
        {/* Hero Section - Split Screen */}
        <section className="h-screen flex flex-col lg:flex-row">
          {/* Left Side - Text */}
          <div className="lg:flex-1 flex items-center justify-center p-8 lg:p-16">
            <div className="max-w-xl space-y-6 fade-in">
              <span className="text-sm tracking-widest text-muted-foreground">01</span>
              <div>
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-display mb-2 leading-none">
                  Arjun's
                </h1>
                <h2 className="text-6xl lg:text-7xl xl:text-8xl font-display italic leading-none">
                  Photography
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                What good is a camera if it can't capture emotions. 
              </p>
              <div className="flex gap-4 pt-4">
                <Link 
                  to="/blog" 
                  className="text-sm border-b-2 border-foreground pb-1 hover:opacity-60 transition-opacity"
                >
                  View Work
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="h-[50vh] lg:h-full flex items-center justify-end">
            <div className="relative h-full flex items-center justify-center bg-muted">
              <img 
                src="/hero-railway.jpg" 
                alt="Railway tracks with palm trees" 
                className="max-h-full w-auto h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section 02 - Featured Work Preview */}
        <section ref={section2Ref as any} className="container mx-auto px-6 py-24 max-w-7xl fade-in-scroll">
          <span className="text-sm tracking-widest text-muted-foreground">02</span>
          <h2 className="text-5xl lg:text-6xl font-display italic mt-4 mb-16">
            Angles.
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img 
                src="/featured-photo.jpg" 
                alt="Featured photograph" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            <div className="space-y-6">
              <p className="text-xl leading-relaxed">
                The cornerstone of photography - every angle is a nuance of light and shadow.
              </p>
              <p className="text-sm text-muted-foreground">
                Visakhapatnam · Nikon D40
              </p>
            </div>
          </div>
        </section>

        {/* Section 03 - Joota Short Film */}
        <section ref={section3Ref as any} className="container mx-auto px-6 py-24 max-w-7xl fade-in-scroll">
          <span className="text-sm tracking-widest text-muted-foreground">03</span>
          <h2 className="text-5xl lg:text-6xl font-display italic mt-4 mb-16">
            Joota.
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-xl leading-relaxed">
                Have you ever thought how your old shoes feel about you getting a new one? Here is a trailer to my latest short film. Coming soon!
              </p>
            </div>
            
            <div className="aspect-video relative overflow-hidden bg-muted rounded-lg">
              <iframe 
                src="https://drive.google.com/file/d/13siISgXUMRlIoI_foG0VuzEx2DFt6FJX/preview" 
                className="w-full h-full"
                allow="autoplay"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef as any} className="container mx-auto px-6 py-32 text-center fade-in-scroll">
          <h2 className="text-4xl lg:text-5xl font-display mb-8">
            Ready to explore more stories?
          </h2>
          <Link 
            to="/blog"
            className="inline-block px-8 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            View All Stories
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Index;
