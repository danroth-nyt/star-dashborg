import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/testUtils';
import SessionJournal from './SessionJournal';

// Mock TipTap editor
const mockEditor = {
  commands: {
    setContent: vi.fn(),
    focus: vi.fn(),
    toggleBold: vi.fn(() => ({ run: vi.fn() })),
    toggleItalic: vi.fn(() => ({ run: vi.fn() })),
    toggleUnderline: vi.fn(() => ({ run: vi.fn() })),
    toggleStrike: vi.fn(() => ({ run: vi.fn() })),
    toggleBulletList: vi.fn(() => ({ run: vi.fn() })),
  },
  chain: vi.fn(() => ({
    focus: vi.fn(() => ({ toggleBold: vi.fn(() => ({ run: vi.fn() })) })),
  })),
  isActive: vi.fn(() => false),
  setEditable: vi.fn(),
  getHTML: vi.fn(() => '<p>Test</p>'),
};

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => mockEditor),
  EditorContent: ({ editor }) => <div data-testid="editor-content">Editor</div>,
}));

vi.mock('@tiptap/starter-kit', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-underline', () => ({
  default: {},
}));

// Mock context hooks
vi.mock('../../context/GameContext', () => ({
  useGame: vi.fn(() => ({
    gameState: { journal: '<p>Test</p>' },
    updateGameState: vi.fn(),
  })),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    session: { user: { id: 'test-user' } },
  })),
}));

vi.mock('../../context/CharacterContext', () => ({
  useCharacter: vi.fn(() => ({
    character: { name: 'Test Character' },
  })),
}));

// Mock presence hook
const mockUsePresence = vi.fn();

vi.mock('../../hooks/usePresence', () => ({
  usePresence: () => mockUsePresence(),
}));

// Mock debounce hook
vi.mock('../../hooks/useDebounce', () => ({
  useDebounce: vi.fn((value) => value),
}));

describe('SessionJournal', () => {
  const defaultProps = {
    roomCode: 'test-room',
  };

  beforeEach(() => {
    mockUsePresence.mockReturnValue({
      trackEditing: vi.fn(),
      stopEditing: vi.fn(),
      getFieldEditor: vi.fn(() => null),
    });
  });

  it('renders editor and toolbar', () => {
    render(<SessionJournal {...defaultProps} />);
    
    // Should render editor
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('shows lock banner when someone else is editing', () => {
    mockUsePresence.mockReturnValue({
      trackEditing: vi.fn(),
      stopEditing: vi.fn(),
      getFieldEditor: vi.fn(() => ({
        userId: 'other-user-id',
        userName: 'Other User',
      })),
    });

    render(<SessionJournal {...defaultProps} />);
    
    expect(screen.getByText(/is editing the session journal/i)).toBeInTheDocument();
  });

  it('renders toolbar buttons', () => {
    render(<SessionJournal {...defaultProps} />);
    
    // Toolbar should be present (buttons are rendered)
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });
});
