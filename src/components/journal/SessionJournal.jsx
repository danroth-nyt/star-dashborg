import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../lib/utils';

export default function SessionJournal() {
  const { gameState, updateGameState } = useGame();
  const [localJournal, setLocalJournal] = useState(gameState.journal || '');
  const debouncedJournal = useDebounce(localJournal, 2000);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
    ],
    content: gameState.journal || '<p>>> MISSION LOG: Document your journey, decisions, and discoveries...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-0 h-full px-3 py-2 text-sm font-mono',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setLocalJournal(html);
    },
  });

  // Update editor content when gameState changes from other users
  useEffect(() => {
    if (editor && gameState.journal !== localJournal && gameState.journal !== debouncedJournal) {
      editor.commands.setContent(gameState.journal || '');
      setLocalJournal(gameState.journal);
    }
  }, [gameState.journal, editor]);

  // Save to Supabase when debounced value changes
  useEffect(() => {
    if (debouncedJournal !== gameState.journal) {
      updateGameState({ journal: debouncedJournal });
    }
  }, [debouncedJournal]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, active, children, title }) => (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 transition-all duration-200 border border-accent-yellow',
        active 
          ? 'bg-accent-yellow text-bg-primary' 
          : 'bg-bg-secondary text-accent-yellow hover:bg-accent-yellow hover:bg-opacity-20'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="absolute inset-0 flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 shrink-0 p-2 bg-bg-primary border-2 border-accent-yellow">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-accent-yellow opacity-30 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 bg-bg-primary border-2 border-accent-yellow text-text-primary focus-within:border-accent-cyan focus-within:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 overflow-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Status */}
      <div className="text-xs text-gray-500 font-orbitron shrink-0">
        {localJournal !== gameState.journal ? (
          <span className="text-accent-yellow animate-pulse">● Saving...</span>
        ) : (
          <span className="text-accent-cyan">● Synced</span>
        )}
      </div>
    </div>
  );
}
