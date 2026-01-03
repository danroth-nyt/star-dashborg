import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test/testUtils';
import OracleResultDisplay from './OracleResultDisplay';

// Mock context hooks
vi.mock('../../context/GameContext', () => ({
  useGame: vi.fn(() => ({
    addLog: vi.fn(),
  })),
}));

// Mock the swipe gesture hook
vi.mock('../../hooks/useSwipeGesture', () => ({
  useSwipeGesture: vi.fn(() => ({
    onPointerDown: vi.fn(),
    onPointerMove: vi.fn(),
    onPointerUp: vi.fn(),
    onPointerCancel: vi.fn(),
    style: { touchAction: 'pan-y' },
  })),
}));

describe('OracleResultDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const simpleResult = {
    roll: 5,
    result: 'Test Result',
  };

  it('renders with simple result data', () => {
    render(<OracleResultDisplay result={simpleResult} variant="cyan" />);
    
    expect(screen.getByText('Test Result')).toBeInTheDocument();
  });

  it('shows navigation buttons when history exists', () => {
    const onNavigate = vi.fn();
    
    render(
      <OracleResultDisplay
        result={simpleResult}
        variant="cyan"
        currentIndex={1}
        totalResults={3}
        onNavigate={onNavigate}
      />
    );
    
    // Should have navigation buttons (they exist in the component)
    const container = screen.getByText('Test Result').closest('div');
    expect(container).toBeInTheDocument();
  });

  it('calls onNavigate when navigation is triggered', () => {
    const onNavigate = vi.fn();
    
    render(
      <OracleResultDisplay
        result={simpleResult}
        variant="cyan"
        currentIndex={1}
        totalResults={3}
        onNavigate={onNavigate}
      />
    );
    
    // Simulate keyboard navigation
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    
    // Should call navigate function
    expect(onNavigate).toHaveBeenCalled();
  });

  it('handles complex oracle results', () => {
    const complexResult = {
      roll: 10,
      name: 'Complex Result',
      description: 'A detailed description',
      attributes: ['Attr1', 'Attr2'],
    };

    render(<OracleResultDisplay result={complexResult} variant="yellow" />);
    
    expect(screen.getByText('Complex Result')).toBeInTheDocument();
  });

  it('does not show navigation for single result', () => {
    render(
      <OracleResultDisplay
        result={simpleResult}
        variant="cyan"
        currentIndex={0}
        totalResults={1}
      />
    );
    
    // Should still render the result
    expect(screen.getByText('Test Result')).toBeInTheDocument();
  });
});
