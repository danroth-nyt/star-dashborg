import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/testUtils';
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

  it('displays roll value', () => {
    render(<OracleResultDisplay result={simpleResult} variant="cyan" />);
    
    // Should show roll value
    expect(screen.getByText('[5]')).toBeInTheDocument();
  });

  it('renders navigation buttons when history exists', () => {
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
    
    // Should render the result
    expect(screen.getByText('Test Result')).toBeInTheDocument();
  });

  it('handles complex oracle results', () => {
    const complexResult = {
      roll: 10,
      result: 'Complex Result',
      description: 'A detailed description',
      attributes: ['Attr1', 'Attr2'],
    };

    render(<OracleResultDisplay result={complexResult} variant="yellow" />);
    
    // Check that result is displayed
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
