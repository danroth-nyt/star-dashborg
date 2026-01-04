import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/testUtils';
import SpaceCombatView from './SpaceCombatView';

// Mock context hooks
const mockExitCombatView = vi.fn();
const mockUseSpaceCombat = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    session: { user: { id: 'test-user' } },
  })),
}));

vi.mock('../../context/SpaceCombatContext', () => ({
  useSpaceCombat: () => mockUseSpaceCombat(),
}));

vi.mock('../../context/PartyContext', () => ({
  useParty: vi.fn(() => ({
    partyMembers: [],
  })),
}));

vi.mock('../../context/GameContext', () => ({
  useGame: vi.fn(() => ({
    gameState: {
      ship: {
        name: 'Test Ship',
        heroicUpgrades: [],
        purchasedUpgrades: [],
        turboLaserStation: null,
      },
    },
    updateGameState: vi.fn(),
  })),
}));

vi.mock('../../context/CharacterContext', () => ({
  useCharacter: vi.fn(() => ({
    character: {
      id: 'test-char-id',
      name: 'Test Character',
    },
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
    mockUseSpaceCombat.mockReturnValue({
      spaceCombat: {
        inCombat: true,
        shipHP: 10,
        shipHPMax: 10,
        shipArmor: 2,
        enemies: [],
      },
      exitCombatView: mockExitCombatView,
      getActiveEnemyCount: vi.fn(() => 0),
    });
  });

  it('renders combat view', () => {
    render(<SpaceCombatView />);
    
    // Should render combat header
    expect(screen.getByText('SPACE COMBAT')).toBeInTheDocument();
    expect(screen.getByText('BATTLE STATIONS ACTIVE')).toBeInTheDocument();
  });

  it('renders with exit functionality available', () => {
    mockExitCombatView.mockClear();
    
    render(<SpaceCombatView />);
    
    // Exit button should be clickable
    const exitButton = screen.getByText('Exit View');
    expect(exitButton).toBeInTheDocument();
    expect(exitButton).toBeEnabled();
  });

  it('shows exit button', () => {
    render(<SpaceCombatView />);
    
    // Should have an exit button
    expect(screen.getByText('Exit View')).toBeInTheDocument();
  });
});
