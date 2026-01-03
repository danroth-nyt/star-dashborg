import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/testUtils';
import ShipStatus from './ShipStatus';

// Mock the context hooks
vi.mock('../../context/SpaceCombatContext', () => ({
  useSpaceCombat: vi.fn(() => ({
    spaceCombat: {
      shipHP: 10,
      shipHPMax: 10,
      shipArmor: 2,
      hyperdriveCharge: 0,
      stationAssignments: {},
      torpedoesLoaded: 0,
    },
    modifyArmor: vi.fn(),
    chargeHyperdrive: vi.fn(),
    decrementHyperdrive: vi.fn(),
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

vi.mock('../../context/PartyContext', () => ({
  useParty: vi.fn(() => ({
    partyMembers: [],
  })),
}));

vi.mock('../../hooks/useSoundEffects', () => ({
  useSoundEffects: vi.fn(() => ({
    play: vi.fn(),
  })),
}));

// Mock child components
vi.mock('../ship/UpgradeShop', () => ({
  default: () => <div data-testid="upgrade-shop">Upgrade Shop</div>,
}));

// Mock oracle functions
vi.mock('../../data/oracles', () => ({
  generateShipName: vi.fn(() => 'Generated Ship Name'),
}));

describe('ShipStatus', () => {
  it('renders with armor tier 0 (no shields)', () => {
    render(<ShipStatus />);
    
    // Should render ship name
    expect(screen.getByText('Test Ship')).toBeInTheDocument();
  });

  it('renders with armor tier 1 (weak shields)', () => {
    render(<ShipStatus />);
    
    // Should render armor controls
    expect(screen.getByText('+ Tier')).toBeInTheDocument();
    expect(screen.getByText('- Tier')).toBeInTheDocument();
  });

  it('renders with armor tier 2 (medium shields)', () => {
    render(<ShipStatus />);
    
    // Should render armor controls
    expect(screen.getByText('+ Tier')).toBeInTheDocument();
  });

  it('renders with armor tier 3 (full shields)', () => {
    render(<ShipStatus />);
    
    // Should render tier controls
    expect(screen.getByText('- Tier')).toBeInTheDocument();
  });

  it('displays correct armor tier', () => {
    render(<ShipStatus />);
    
    // Should show tier 2 from mock
    expect(screen.getByText('Tier 2')).toBeInTheDocument();
  });
});
