import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/ImageUpload';
import { useState } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  ImageIcon,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = "Tell your story..." }: RichTextEditorProps) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageWidth, setImageWidth] = useState('auto');
  const [imageFloat, setImageFloat] = useState('none');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImageFromUpload = (url: string) => {
    if (editor) {
      const width = imageWidth !== 'auto' ? imageWidth : undefined;
      const float = imageFloat !== 'none' ? imageFloat : undefined;
      
      const style = `
        ${width ? `width: ${width};` : 'max-width: 100%;'}
        height: auto;
        ${float ? `float: ${float}; margin: ${float === 'left' ? '0 1rem 1rem 0' : '0 0 1rem 1rem'};` : 'display: block; margin: 1rem auto;'}
        border-radius: 0.5rem;
      `.trim();
      
      editor.chain().focus().setImage({ 
        src: url,
        style: style
      }).run();
      
      setImageDialogOpen(false);
      setImageWidth('auto');
      setImageFloat('none');
    }
  };

  const addImageFromUrl = () => {
    if (imageUrl && editor) {
      const width = imageWidth !== 'auto' ? imageWidth : undefined;
      const float = imageFloat !== 'none' ? imageFloat : undefined;
      
      const style = `
        ${width ? `width: ${width};` : 'max-width: 100%;'}
        height: auto;
        ${float ? `float: ${float}; margin: ${float === 'left' ? '0 1rem 1rem 0' : '0 0 1rem 1rem'};` : 'display: block; margin: 1rem auto;'}
        border-radius: 0.5rem;
      `.trim();
      
      editor.chain().focus().setImage({ 
        src: imageUrl,
        style: style
      }).run();
      
      setImageUrl('');
      setImageDialogOpen(false);
      setImageWidth('auto');
      setImageFloat('none');
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-muted/50 border-b border-border p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Headings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Quote */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-accent' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Image & Link */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="url">Image URL</TabsTrigger>
              </TabsList>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image Size</Label>
                    <Select value={imageWidth} onValueChange={setImageWidth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Original Size</SelectItem>
                        <SelectItem value="25%">Small (25%)</SelectItem>
                        <SelectItem value="50%">Medium (50%)</SelectItem>
                        <SelectItem value="75%">Large (75%)</SelectItem>
                        <SelectItem value="100%">Full Width (100%)</SelectItem>
                        <SelectItem value="300px">Fixed 300px</SelectItem>
                        <SelectItem value="500px">Fixed 500px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Text Wrapping</Label>
                    <Select value={imageFloat} onValueChange={setImageFloat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Wrap (Center)</SelectItem>
                        <SelectItem value="left">Wrap Right (Float Left)</SelectItem>
                        <SelectItem value="right">Wrap Left (Float Right)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <TabsContent value="upload" className="space-y-4">
                <ImageUpload onImageUploaded={addImageFromUpload} />
              </TabsContent>
              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    placeholder="https://example.com/image.jpg or /my-photo.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addImageFromUrl();
                      }
                    }}
                  />
                </div>
                <Button onClick={addImageFromUrl} className="w-full">
                  Insert Image
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        <Button
          variant="ghost"
          size="sm"
          onClick={addLink}
        >
          <Link2 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
