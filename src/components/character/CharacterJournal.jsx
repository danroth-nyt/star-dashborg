import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List } from 'lucide-react';
import { useCharacter } from '../../context/CharacterContext';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../lib/utils';

export default function CharacterJournal({ onFocus, onBlur, isLocked }) {
  const { character, updateField } = useCharacter();
  const [localJournal, setLocalJournal] = useState(character?.journal || '');
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
    content: character?.journal || '<p>>> PERSONAL LOG: Track your character\'s thoughts, goals, relationships, secrets, and discoveries...</p>',
    editable: !isLocked, // Disable editing if someone else is editing
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-0 h-full px-3 py-2 text-sm font-mono',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setLocalJournal(html);
    },
    onFocus: () => {
      if (onFocus) onFocus();
    },
    onBlur: () => {
      if (onBlur) onBlur();
    },
  });

  // Update editor content when character changes from database
  useEffect(() => {
    if (editor && character?.journal !== localJournal && character?.journal !== debouncedJournal) {
      editor.commands.setContent(character?.journal || '');
      setLocalJournal(character?.journal || '');
    }
  }, [character?.journal, editor]);

  // Save to Supabase when debounced value changes
  useEffect(() => {
    if (character && debouncedJournal !== character.journal) {
      updateField('journal', debouncedJournal);
    }
  }, [debouncedJournal]);

  if (!character || !editor) {
    return null;
  }

  const isSaving = localJournal !== character.journal;

  const ToolbarButton = ({ onClick, active, children, title, disabled }) => (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'p-1.5 transition-all duration-200 border border-accent-yellow',
        disabled && 'opacity-50 cursor-not-allowed',
        active 
          ? 'bg-accent-yellow text-bg-primary' 
          : 'bg-bg-secondary text-accent-yellow hover:bg-accent-yellow hover:bg-opacity-20'
      )}
    >
      {children}
    </button>
  );

  // Update editor editable state when isLocked changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isLocked);
    }
  }, [editor, isLocked]);

  return (
    <div className="flex flex-col gap-2 min-h-[200px]">
      {/* Lock Warning */}
      {isLocked && (
        <div className="bg-accent-yellow/10 border-2 border-accent-yellow rounded p-2 text-xs font-mono text-accent-yellow flex items-center gap-2">
          <Bold className="w-4 h-4" />
          <span>{isLocked.userName} is currently editing this journal. Please wait...</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-bg-primary border-2 border-accent-yellow">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
          disabled={isLocked}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
          disabled={isLocked}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
          disabled={isLocked}
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
          disabled={isLocked}
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-accent-yellow opacity-30 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
          disabled={isLocked}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[180px] bg-bg-primary border-2 border-accent-yellow text-text-primary focus-within:border-accent-cyan focus-within:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 overflow-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Status */}
      <div className="text-xs text-gray-500 font-orbitron">
        {isSaving ? (
          <span className="text-accent-yellow animate-pulse">● Saving...</span>
        ) : (
          <span className="text-accent-cyan">● Synced</span>
        )}
      </div>
    </div>
  );
}
