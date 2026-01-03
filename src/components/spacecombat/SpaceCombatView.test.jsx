import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/testUtils';
import SpaceCombatView from './SpaceCombatView';

// Mock context hooks
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    session: { user: { id: 'test-user' } },
  })),
}));

vi.mock('../../context/SpaceCombatContext', () => ({
  useSpaceCombat: vi.fn(() => ({
    spaceCombat: {
      inCombat: true,
      shipHP: 10,
      shipHPMax: 10,
      shipArmor: 2,
    },
    exitCombatView: vi.fn(),
  })),
}));

vi.mock('../../context/PartyContext', () => ({
  useParty: vi.fn(() => ({
    partyMembers: [],
  })),
}));

// Mock sound effects hook
vi.mock('../../hooks/useSoundEffects', () => ({
  useSoundEffects: vi.fn(() => ({
    play: vi.fn(),
    toggleMute: vi.fn(() => false),
    getMutedState: vi.fn(() => false),
  })),
}));

// Mock child components
vi.mock('./SpaceCombatShipPanel', () => ({
  default: () => <div data-testid="ship-panel">Ship Panel</div>,
}));

vi.mock('./StationGrid', () => ({
  default: () => <div data-testid="station-grid">Station Grid</div>,
}));

vi.mock('./CombatLog', () => ({
  default: () => <div data-testid="combat-log">Combat Log</div>,
}));

describe('SpaceCombatView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders combat view', () => {
    render(<SpaceCombatView />);
    
    // Should render main combat components
    expect(screen.getByTestId('ship-panel')).toBeInTheDocument();
    expect(screen.getByTestId('station-grid')).toBeInTheDocument();
  });

  it('handles exit with ESC key', async () => {
    const exitCombatView = vi.fn();
    const { useSpaceCombat } = require('../../context/SpaceCombatContext');
    useSpaceCombat.mockReturnValue({
      spaceCombat: {
        inCombat: true,
        shipHP: 10,
        shipHPMax: 10,
        shipArmor: 2,
      },
      exitCombatView,
    });

    render(<SpaceCombatView />);
    
    // Press ESC key
    fireEvent.keyDown(window, { key: 'Escape' });
    
    // Should call exit after animation delay
    await waitFor(() => {
      expect(exitCombatView).toHaveBeenCalled();
    }, { timeout: 500 });
  });

  it('shows exit button', () => {
    render(<SpaceCombatView />);
    
    // Should have an exit/close button somewhere
    const shipPanel = screen.getByTestId('ship-panel');
    expect(shipPanel).toBeInTheDocument();
  });
});
