import { Link } from "react-router-dom";
import { format } from "date-fns";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  imageUrl?: string;
  index: number;
}

const BlogCard = ({ id, title, excerpt, publishedAt, imageUrl, index }: BlogCardProps) => {
  return (
    <article className="group">
      <Link to={`/blog/${id}`} className="block space-y-6">
        {/* Section Number */}
        <span className="text-sm tracking-widest text-muted-foreground">
          {String(index + 1).padStart(2, '0')}
        </span>
        
        {/* Image */}
        {imageUrl && (
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="space-y-3">
          <h2 className="text-4xl lg:text-5xl font-display leading-tight group-hover:opacity-60 transition-opacity">
            {title}
          </h2>
          
          {excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <time>{format(new Date(publishedAt), "dd/MM/yy")}</time>
            <span>·</span>
            <span>Camera Model</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
