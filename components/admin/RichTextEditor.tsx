'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect, useRef, useState } from 'react';
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Link2, Image as ImageIcon, Undo, Redo, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, HTMLAttributes: { class: 'article-img' } }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[200px] focus:outline-none p-4 text-[#1F2937]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const btn = (active: boolean) => cn(
    'p-1.5 transition-colors',
    active ? 'bg-[#1F2937] text-white' : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F6F8]'
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    e.target.value = '';

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    setUploading(false);

    if (res.ok) {
      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } else {
      alert('Image upload failed. Please try again.');
    }
  };

  return (
    <div className="border border-[#E8E9ED]" style={{ borderRadius: '2px' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-[#E8E9ED] bg-[#F5F6F8]">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}><Bold size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}><Italic size={14} /></button>
        <div className="w-px h-4 bg-[#E8E9ED] mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}><Heading2 size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))}><Heading3 size={14} /></button>
        <div className="w-px h-4 bg-[#E8E9ED] mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}><List size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}><ListOrdered size={14} /></button>
        <div className="w-px h-4 bg-[#E8E9ED] mx-1" />
        <button type="button" onClick={() => {
          const url = window.prompt('URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} className={btn(editor.isActive('link'))}><Link2 size={14} /></button>
        {/* Image upload button */}
        <button
          type="button"
          title="Insert image (upload file)"
          disabled={uploading}
          onClick={() => imgInputRef.current?.click()}
          className={btn(false)}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
        </button>
        <input
          ref={imgInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleImageUpload}
        />
        <div className="w-px h-4 bg-[#E8E9ED] mx-1" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)}><Undo size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)}><Redo size={14} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
