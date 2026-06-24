'use client';

import { useCallback, useState, useRef, memo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TipTapImage from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Undo2,
  Redo2,
  Link2,
  Unlink,
  Image as ImageIcon,
  Upload,
  Film,
  Type,
  Palette,
  Highlighter,
  X,
  TableIcon,
  Plus,
  Trash2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface RichEditorProps {
  html: string;
  onChange: (html: string) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Color Palettes                                                     */
/* ------------------------------------------------------------------ */
const TEXT_COLORS = [
  { label: 'Noir', value: '#000000' },
  { label: 'Rouge', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Bleu marque', value: '#0176cc' },
  { label: 'Bleu clair', value: '#56d1f7' },
  { label: 'Vert', value: '#22c55e' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Rose', value: '#ec4899' },
  { label: 'Gris foncé', value: '#374151' },
];

const HIGHLIGHT_COLORS = [
  { label: 'Jaune', value: '#fef08a' },
  { label: 'Vert clair', value: '#bbf7d0' },
  { label: 'Bleu clair', value: '#bfdbfe' },
  { label: 'Rose clair', value: '#fecdd3' },
  { label: 'Orange clair', value: '#fed7aa' },
  { label: 'Violet clair', value: '#ddd6fe' },
];

const BLOCK_TYPES = [
  { label: 'Paragraphe', value: 'paragraph' },
  { label: 'Titre 1', value: '1' },
  { label: 'Titre 2', value: '2' },
  { label: 'Titre 3', value: '3' },
  { label: 'Titre 4', value: '4' },
  { label: 'Titre 5', value: '5' },
  { label: 'Citation', value: 'blockquote' },
  { label: 'Bloc de code', value: 'codeBlock' },
];

/* ------------------------------------------------------------------ */
/*  Toolbar Button                                                     */
/* ------------------------------------------------------------------ */
const ToolbarBtn = memo(function ToolbarBtn({
  active,
  onClick,
  title,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded-[2px] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? 'text-[#56d1f7] bg-[#0176cc]/20'
          : 'text-[#a0a0a0] hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
});

/* ------------------------------------------------------------------ */
/*  Toolbar Separator                                                  */
/* ------------------------------------------------------------------ */
function Separator() {
  return <div className="w-px h-5 bg-white/10 mx-0.5" />;
}

/* ------------------------------------------------------------------ */
/*  Block Type Selector                                                */
/* ------------------------------------------------------------------ */
const BlockTypeSelect = memo(function BlockTypeSelect({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  const [open, setOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState('paragraph');

  useEffect(() => {
    const updateBlock = () => {
      if (!editor) return;
      const { state } = editor;
      const node = state.selection.$head.parent;
      if (node.type.name === 'heading') {
        setCurrentBlock(node.attrs.level.toString());
      } else if (node.type.name === 'blockquote') {
        setCurrentBlock('blockquote');
      } else if (node.type.name === 'codeBlock') {
        setCurrentBlock('codeBlock');
      } else {
        setCurrentBlock('paragraph');
      }
    };
    updateBlock();
    editor.on('selectionUpdate', updateBlock);
    editor.on('update', updateBlock);
    return () => {
      editor.off('selectionUpdate', updateBlock);
      editor.off('update', updateBlock);
    };
  }, [editor]);

  const apply = (value: string) => {
    if (!editor) return;
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else if (['1', '2', '3', '4', '5'].includes(value)) {
      editor.chain().focus().toggleHeading({ level: parseInt(value) as 1 | 2 | 3 | 4 | 5 }).run();
    } else if (value === 'blockquote') {
      editor.chain().focus().toggleBlockquote().run();
    } else if (value === 'codeBlock') {
      editor.chain().focus().toggleCodeBlock().run();
    }
    setOpen(false);
  };

  const currentLabel = BLOCK_TYPES.find((b) => b.value === currentBlock)?.label || 'Paragraphe';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-roboto font-medium text-[#a0a0a0] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2px] transition-colors cursor-pointer min-w-[100px]"
      >
        <Type size={12} />
        <span className="truncate">{currentLabel}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[200]" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-[#2a2a2a] border border-white/15 rounded-[2px] py-1 z-[201] shadow-xl min-w-[140px]">
            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.value}
                type="button"
                onClick={() => apply(bt.value)}
                className={`w-full text-left px-3 py-1.5 text-[12px] font-roboto transition-colors cursor-pointer ${
                  currentBlock === bt.value
                    ? 'text-[#56d1f7] bg-[#0176cc]/15'
                    : 'text-[#d0d0d0] hover:bg-white/5 hover:text-white'
                }`}
              >
                {bt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Color Picker Dropdown                                               */
/* ------------------------------------------------------------------ */
const ColorPickerDropdown = memo(function ColorPickerDropdown({
  icon: Icon,
  colors,
  title,
  onPick,
}: {
  icon: typeof Palette;
  colors: { label: string; value: string }[];
  title: string;
  onPick: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title={title}
        className="p-1.5 text-[#a0a0a0] hover:text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
      >
        <Icon size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[200]" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-[#2a2a2a] border border-white/15 rounded-[2px] p-2.5 z-[201] shadow-xl min-w-[180px]">
            <p className="text-[10px] font-roboto font-medium text-[#808080] uppercase tracking-wider mb-2 px-0.5">
              {title}
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => {
                    onPick(c.value);
                    setOpen(false);
                  }}
                  className="w-9 h-9 rounded-[2px] border border-white/10 hover:border-white/40 transition-all cursor-pointer hover:scale-110"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                onPick('remove');
                setOpen(false);
              }}
              className="w-full mt-2 text-[11px] font-roboto text-[#808080] hover:text-white px-2 py-1.5 rounded-[2px] hover:bg-white/5 transition-colors cursor-pointer text-left"
            >
              Réinitialiser
            </button>
          </div>
        </>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Link Dialog                                                        */
/* ------------------------------------------------------------------ */
const LinkDialog = memo(function LinkDialog({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const isLink = editor?.isActive('link');

  const handleOpen = () => {
    if (isLink && editor) {
      const prevUrl = editor.getAttributes('link').href || '';
      const { state } = editor;
      const { from, to } = state.selection;
      const selectedText = state.doc.textBetween(from, to, '');
      setUrl(prevUrl);
      setText(selectedText);
    } else {
      const { state } = editor!;
      const { from, to } = state.selection;
      const selectedText = state.doc.textBetween(from, to, '');
      setUrl('');
      setText(selectedText);
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (!editor) return;
    if (url.trim()) {
      if (text && !editor.state.selection.empty) {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url.trim() })
          .run();
      } else {
        editor.chain().focus().setLink({ href: url.trim() }).run();
      }
    }
    setOpen(false);
  };

  const handleRemove = () => {
    editor?.chain().focus().unsetLink().run();
    setOpen(false);
  };

  return (
    <>
      <ToolbarBtn
        active={isLink || false}
        onClick={handleOpen}
        title="Insérer / Modifier un lien"
      >
        <Link2 size={16} />
      </ToolbarBtn>
      {isLink && !open && (
        <ToolbarBtn onClick={handleRemove} title="Supprimer le lien">
          <Unlink size={16} />
        </ToolbarBtn>
      )}
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60">
          <div className="bg-[#1a1a1a] border border-white/15 rounded-[2px] p-6 w-full max-w-[440px] mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-oswald font-bold text-[16px] text-white">
                Insérer un lien
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-[#a0a0a0] hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-roboto font-medium text-[#808080] uppercase tracking-wider mb-1.5">
                  URL du lien
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/15 rounded-[2px] px-3 py-2.5 text-[13px] font-roboto text-white placeholder:text-[#808080] focus:border-[#0176cc]/50 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-5">
              {isLink && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center gap-1.5 text-[12px] font-roboto text-red-400 hover:text-red-300 px-3 py-2 rounded-[2px] hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Unlink size={13} />
                  Supprimer
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-[13px] font-roboto font-medium text-[#a0a0a0] hover:text-white px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!url.trim()}
                  className="text-[13px] font-roboto font-medium text-white bg-[#0176cc] hover:bg-[#0176cc]/90 px-5 py-2 rounded-[2px] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Link2 size={13} />
                    Appliquer
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

/* ------------------------------------------------------------------ */
/*  Image Dialog                                                       */
/* ------------------------------------------------------------------ */
const ImageDialog = memo(function ImageDialog({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');

  const handleSave = () => {
    if (!editor || !url.trim()) return;
    editor.chain().focus().setImage({ src: url.trim(), alt: alt || '' }).run();
    setOpen(false);
    setUrl('');
    setAlt('');
  };

  return (
    <>
      <ToolbarBtn onClick={() => setOpen(true)} title="Insérer une image par URL">
        <ImageIcon size={16} />
      </ToolbarBtn>
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60">
          <div className="bg-[#1a1a1a] border border-white/15 rounded-[2px] p-6 w-full max-w-[440px] mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-oswald font-bold text-[16px] text-white">
                Insérer une image
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-[#a0a0a0] hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-roboto font-medium text-[#808080] uppercase tracking-wider mb-1.5">
                  URL de l&apos;image
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full bg-white/5 border border-white/15 rounded-[2px] px-3 py-2.5 text-[13px] font-roboto text-white placeholder:text-[#808080] focus:border-[#0176cc]/50 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-roboto font-medium text-[#808080] uppercase tracking-wider mb-1.5">
                  Texte alternatif (optionnel)
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Description de l'image..."
                  className="w-full bg-white/5 border border-white/15 rounded-[2px] px-3 py-2.5 text-[13px] font-roboto text-white placeholder:text-[#808080] focus:border-[#0176cc]/50 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[13px] font-roboto font-medium text-[#a0a0a0] hover:text-white px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!url.trim()}
                className="text-[13px] font-roboto font-medium text-white bg-[#0176cc] hover:bg-[#0176cc]/90 px-5 py-2 rounded-[2px] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Insérer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

/* ------------------------------------------------------------------ */
/*  Media Upload Button                                                */
/* ------------------------------------------------------------------ */
const MediaUploadButton = memo(function MediaUploadButton({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Upload failed');
        }

        const data = await res.json();
        if (data.type === 'image') {
          editor?.chain().focus().setImage({ src: data.url, alt: file.name }).run();
        } else if (data.type === 'video') {
          editor?.chain().focus().insertContent(
            `<video controls width="100%" style="max-height:400px;border-radius:2px;margin:12px 0"><source src="${data.url}" type="${data.mimeType}"></video>`
          ).run();
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert("Erreur lors de l'upload. Vérifiez que le fichier est autorisé (JPG, PNG, GIF, WebP, MP4, WebM).");
      } finally {
        setUploading(false);
      }
    },
    [editor],
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/mp4,video/webm,video/ogg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
          e.target.value = '';
        }}
      />
      <ToolbarBtn
        onClick={() => fileInputRef.current?.click()}
        title="Téléverser un média (image ou vidéo)"
        disabled={uploading}
      >
        {uploading ? (
          <div className="w-4 h-4 border-2 border-[#a0a0a0] border-t-white rounded-full animate-spin" />
        ) : (
          <Upload size={16} />
        )}
      </ToolbarBtn>
    </>
  );
});

/* ------------------------------------------------------------------ */
/*  Embed Dialog (YouTube, Twitter/X, Vidéo, Lien)                     */
/* ------------------------------------------------------------------ */
const EmbedDialog = memo(function EmbedDialog({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [embedType, setEmbedType] = useState<'youtube' | 'twitter' | 'video' | 'link'>('youtube');

  const handleInsert = () => {
    if (!editor || !url.trim()) return;

    switch (embedType) {
      case 'youtube': {
        // Use TipTap YouTube extension
        editor.commands.setYoutubeVideo({ src: url });
        break;
      }
      case 'twitter': {
        const match =
          url.match(/twitter\.com\/\w+\/status\/(\d+)/) ||
          url.match(/x\.com\/\w+\/status\/(\d+)/);
        if (match) {
          editor.chain().focus().insertContent(
            `<div style="margin:12px 0"><iframe src="https://platform.twitter.com/embed/Tweet.html?id=${match[1]}" width="100%" height="500" frameborder="0" style="border:none;border-radius:2px;max-width:100%"></iframe></div>`
          ).run();
        } else {
          editor.chain().focus().insertContent(
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
          ).run();
        }
        break;
      }
      case 'video':
        editor.chain().focus().insertContent(
          `<video controls width="100%" style="max-height:400px;border-radius:2px;margin:12px 0"><source src="${url}" type="video/mp4"></video>`
        ).run();
        break;
      case 'link':
        editor.chain().focus().insertContent(
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        ).run();
        break;
    }

    setUrl('');
    setOpen(false);
  };

  const placeholders: Record<string, string> = {
    youtube: 'https://www.youtube.com/watch?v=...',
    twitter: 'https://twitter.com/user/status/...',
    video: 'https://exemple.com/ma-video.mp4',
    link: 'https://...',
  };

  const types = [
    { key: 'youtube' as const, label: 'YouTube', Icon: Film },
    { key: 'twitter' as const, label: 'X / Twitter', Icon: Link2 },
    { key: 'video' as const, label: 'Vidéo', Icon: Film },
    { key: 'link' as const, label: 'Lien', Icon: Link2 },
  ];

  return (
    <>
      <ToolbarBtn onClick={() => setOpen(true)} title="Insérer un contenu embarqué">
        <Film size={16} />
      </ToolbarBtn>
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60">
          <div className="bg-[#1a1a1a] border border-white/15 rounded-[2px] p-6 w-full max-w-[480px] mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-oswald font-bold text-[16px] text-white">
                Contenu embarqué
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-[#a0a0a0] hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setEmbedType(t.key)}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-[2px] text-[11px] font-roboto font-medium border transition-colors cursor-pointer ${
                    embedType === t.key
                      ? 'bg-[#0176cc]/20 text-[#56d1f7] border-[#0176cc]/40'
                      : 'text-[#a0a0a0] border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <t.Icon size={12} />
                  {t.label}
                </button>
              ))}
            </div>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholders[embedType]}
              className="w-full bg-white/5 border border-white/15 rounded-[2px] px-4 py-3 text-[14px] font-roboto text-white placeholder:text-[#808080] focus:border-[#0176cc]/50 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleInsert();
              }}
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[13px] font-roboto font-medium text-[#a0a0a0] hover:text-white px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleInsert}
                disabled={!url.trim()}
                className="text-[13px] font-roboto font-medium text-white bg-[#0176cc] hover:bg-[#0176cc]/90 px-5 py-2 rounded-[2px] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Insérer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

/* ------------------------------------------------------------------ */
/*  Table Menu                                                         */
/* ------------------------------------------------------------------ */
const TableMenu = memo(function TableMenu({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  const [open, setOpen] = useState(false);

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setOpen(false);
  };

  const addRow = () => {
    editor?.chain().focus().addRowAfter().run();
  };

  const addColumn = () => {
    editor?.chain().focus().addColumnAfter().run();
  };

  const deleteRow = () => {
    editor?.chain().focus().deleteRow().run();
  };

  const deleteColumn = () => {
    editor?.chain().focus().deleteColumn().run();
  };

  const deleteTable = () => {
    editor?.chain().focus().deleteTable().run();
  };

  return (
    <>
      <ToolbarBtn onClick={() => setOpen(!open)} title="Tableau">
        <TableIcon size={16} />
      </ToolbarBtn>
      {open && (
        <>
          <div className="fixed inset-0 z-[200]" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-[#2a2a2a] border border-white/15 rounded-[2px] py-1 z-[201] shadow-xl min-w-[200px]">
            <button
              type="button"
              onClick={insertTable}
              className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-roboto text-[#d0d0d0] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={13} />
              Insérer un tableau 3×3
            </button>
            <div className="h-px bg-white/10 my-1" />
            <button
              type="button"
              onClick={addRow}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] font-roboto text-[#a0a0a0] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              + Ajouter une ligne
            </button>
            <button
              type="button"
              onClick={addColumn}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] font-roboto text-[#a0a0a0] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              + Ajouter une colonne
            </button>
            <div className="h-px bg-white/10 my-1" />
            <button
              type="button"
              onClick={deleteRow}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] font-roboto text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              Supprimer la ligne
            </button>
            <button
              type="button"
              onClick={deleteColumn}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] font-roboto text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              Supprimer la colonne
            </button>
            <button
              type="button"
              onClick={deleteTable}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] font-roboto text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              Supprimer le tableau
            </button>
          </div>
        </>
      )}
    </>
  );
});

/* ------------------------------------------------------------------ */
/*  Main RichEditor Component                                          */
/* ------------------------------------------------------------------ */
export default function RichEditor({ html, onChange, className = '' }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      TipTapImage.configure({
        HTMLAttributes: {
          class: 'article-editor-image',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'article-editor-youtube',
        },
      }),
      Placeholder.configure({
        placeholder: 'Commencez à écrire votre article...',
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Subscript,
      Superscript,
    ],
    content: html,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
      },
    },
    immediatelyRender: false,
  });

  // Sync external html changes (when switching articles)
  useEffect(() => {
    if (editor && html !== editor.getHTML()) {
      editor.commands.setContent(html, false);
    }
  }, [html, editor]);

  if (!editor) {
    return (
      <div className="rich-editor-wrapper">
        <div className="flex items-center justify-center h-[500px] text-[#808080] text-[14px] font-roboto">
          Chargement de l&apos;éditeur...
        </div>
      </div>
    );
  }

  return (
    <div className={`rich-editor-wrapper ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-[rgba(255,255,255,0.1)] bg-[#1a1a1a]">
        {/* Undo / Redo */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          title="Annuler (Ctrl+Z)"
          disabled={!editor.can().undo()}
        >
          <Undo2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          title="Rétablir (Ctrl+Y)"
          disabled={!editor.can().redo()}
        >
          <Redo2 size={16} />
        </ToolbarBtn>

        <Separator />

        {/* Block type selector */}
        <BlockTypeSelect editor={editor} />

        <Separator />

        {/* Text formatting */}
        <ToolbarBtn
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Gras (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italique (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Souligné (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Barré"
        >
          <Strikethrough size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('superscript')}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          title="Exposant"
        >
          <SuperscriptIcon size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('subscript')}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          title="Indice"
        >
          <SubscriptIcon size={16} />
        </ToolbarBtn>

        <Separator />

        {/* Text color */}
        <ColorPickerDropdown
          icon={Type}
          colors={TEXT_COLORS}
          title="Couleur du texte"
          onPick={(color) => {
            if (color === 'remove') {
              editor.chain().focus().unsetColor().run();
            } else {
              editor.chain().focus().setColor(color).run();
            }
          }}
        />
        {/* Highlight */}
        <ColorPickerDropdown
          icon={Highlighter}
          colors={HIGHLIGHT_COLORS}
          title="Couleur de surlignement"
          onPick={(color) => {
            if (color === 'remove') {
              editor.chain().focus().unsetHighlight().run();
            } else {
              editor.chain().focus().toggleHighlight({ color }).run();
            }
          }}
        />

        <Separator />

        {/* Text alignment */}
        <ToolbarBtn
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Aligner à gauche"
        >
          <AlignLeft size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Centrer"
        >
          <AlignCenter size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Aligner à droite"
        >
          <AlignRight size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Justifier"
        >
          <AlignJustify size={14} />
        </ToolbarBtn>

        <Separator />

        {/* Lists */}
        <ToolbarBtn
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Liste à puces"
        >
          <List size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Liste numérotée"
        >
          <ListOrdered size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Citation"
        >
          <Quote size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Bloc de code"
        >
          <Code size={16} />
        </ToolbarBtn>

        <Separator />

        {/* Links */}
        <LinkDialog editor={editor} />

        <Separator />

        {/* Media: Upload, Image URL, Embed */}
        <MediaUploadButton editor={editor} />
        <ImageDialog editor={editor} />
        <EmbedDialog editor={editor} />

        <Separator />

        {/* Table + Horizontal rule */}
        <TableMenu editor={editor} />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Ligne horizontale"
        >
          <Minus size={16} />
        </ToolbarBtn>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}