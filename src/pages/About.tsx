import FilmGrain from "@/components/FilmGrain";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen page-enter">
      <FilmGrain />
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <span className="text-sm tracking-widest text-muted-foreground">04</span>
          
          <article className="mt-8 space-y-12">
            <div>
              <h1 className="text-6xl lg:text-7xl font-display mb-8 leading-tight">
                About This Journey
              </h1>
              
              <div className="prose prose-lg max-w-none space-y-6 text-lg leading-relaxed">
                <p>
                  This is a space where fleeting moments find permanence. Where the ordinary 
                  transforms into poetry through the lens of curiosity and quiet observation.
                </p>
                
                <p>
                  I wander through streets and nature, capturing fragments of life that 
                  whisper stories—a shadow dancing on weathered walls, light filtering 
                  through leaves, strangers lost in thought.
                </p>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  About Photo 1
                </div>
              </div>
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  About Photo 2
                </div>
              </div>
            </div>
            
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Photography, for me, is not about perfection. It's about presence. 
                It's about noticing the beauty in what others might pass by.
              </p>
              
              <div className="border-l-2 border-border pl-8 py-4 space-y-4">
                <p className="italic text-xl">
                  "The camera is an excuse to be someplace you otherwise don't belong. 
                  It gives me both a point of connection and a point of separation."
                </p>
                <p className="text-sm text-muted-foreground">— Susan Meiselas</p>
              </div>
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
