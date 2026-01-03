import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, User } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { useCharacter } from '../../context/CharacterContext';
import { usePresence } from '../../hooks/usePresence';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../lib/utils';

export default function SessionJournal({ roomCode }) {
  const { gameState, updateGameState } = useGame();
  const { session } = useAuth();
  const { character } = useCharacter();
  const [localJournal, setLocalJournal] = useState(gameState.journal || '');
  const debouncedJournal = useDebounce(localJournal, 2000);

  // Presence tracking for collaborative editing
  const { trackEditing, stopEditing, getFieldEditor } = usePresence(
    roomCode,
    session?.user?.id,
    character?.name || 'Unknown Rebel'
  );

  const editorLock = getFieldEditor('sessionJournal');
  const isLocked = editorLock && editorLock.userId !== session?.user?.id;

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
    editable: !isLocked, // Disable editing when someone else is editing
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

  // Update editor editable state when lock status changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isLocked);
    }
  }, [editor, isLocked]);

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

  const ToolbarButton = ({ onClick, active, children, title, disabled }) => (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'p-1.5 transition-all duration-200 border border-accent-yellow',
        disabled && 'opacity-40 cursor-not-allowed',
        active 
          ? 'bg-accent-yellow text-bg-primary' 
          : 'bg-bg-secondary text-accent-yellow hover:bg-accent-yellow hover:bg-opacity-20',
        disabled && 'hover:bg-bg-secondary hover:bg-opacity-100'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="absolute inset-0 flex flex-col gap-2">
      {/* Lock Banner - when someone else is editing */}
      {isLocked && (
        <div className="flex items-center gap-2 px-3 py-2 bg-accent-yellow/20 border border-accent-yellow/50 rounded text-accent-yellow text-xs shrink-0">
          <User className="w-3 h-3" />
          <span>{editorLock.userName} is editing the session journal...</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 shrink-0 p-2 bg-bg-primary border-2 border-accent-yellow">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={isLocked}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={isLocked}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          disabled={isLocked}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          disabled={isLocked}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-accent-yellow opacity-30 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          disabled={isLocked}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 bg-bg-primary border-2 border-accent-yellow text-text-primary focus-within:border-accent-cyan focus-within:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 overflow-auto">
        <EditorContent 
          editor={editor} 
          className="h-full"
          onFocus={() => trackEditing('sessionJournal')}
          onBlur={() => stopEditing('sessionJournal')}
        />
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
