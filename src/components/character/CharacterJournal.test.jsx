import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/testUtils';
import CharacterJournal from './CharacterJournal';

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
    focus: vi.fn(() => ({ run: vi.fn() })),
  })),
  isActive: vi.fn(() => false),
  setEditable: vi.fn(),
  getHTML: vi.fn(() => '<p>Test</p>'),
};

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => mockEditor),
  EditorContent: () => <div data-testid="editor-content">Editor</div>,
}));

vi.mock('@tiptap/starter-kit', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-underline', () => ({
  default: {},
}));

// Mock CharacterContext
const mockUpdateField = vi.fn();
const mockUseCharacter = vi.fn();

vi.mock('../../context/CharacterContext', () => ({
  useCharacter: () => mockUseCharacter(),
}));

describe('CharacterJournal', () => {
  beforeEach(() => {
    mockUseCharacter.mockReturnValue({
      character: {
        id: 'test-id',
        name: 'Test Character',
        journal: '<p>Test journal</p>',
      },
      updateField: mockUpdateField,
    });
  });

  it('renders null when no character', () => {
    mockUseCharacter.mockReturnValue({
      character: null,
      updateField: vi.fn(),
    });

    const { container } = render(<CharacterJournal />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders toolbar when character exists', () => {
    render(<CharacterJournal />);
    
    // Should render editor content
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('shows lock warning when isLocked is true', () => {
    const lockInfo = { userName: 'Other User', userId: 'other-id' };
    
    render(<CharacterJournal isLocked={lockInfo} />);
    
    expect(screen.getByText(/Other User is currently editing/i)).toBeInTheDocument();
  });
});
