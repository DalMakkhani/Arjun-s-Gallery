import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
}

const ImageUpload = ({ onImageUploaded }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 9);
      const extension = file.name.split('.').pop();
      const filename = `upload-${timestamp}-${randomString}.${extension}`;

      // Convert to base64 and create a data URL for preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        
        // For now, we'll use the data URL directly
        // In production, you'd upload to a server/CDN
        onImageUploaded(dataUrl);
        
        toast({
          title: 'Image added!',
          description: 'Your image has been inserted into the editor',
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Could not process the image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
          ${isDragging ? 'border-primary bg-accent' : 'border-border hover:border-primary hover:bg-accent/50'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={triggerFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          
          <div>
            <p className="font-medium">
              {uploading ? 'Uploading...' : 'Drop image here or click to browse'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports JPG, PNG, GIF, WebP
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Tip: You can also paste images directly into the editor with Ctrl+V (Cmd+V on Mac)
      </p>
    </div>
  );
};

export default ImageUpload;
