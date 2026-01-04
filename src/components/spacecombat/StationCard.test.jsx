import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/testUtils';
import StationCard from './StationCard';

// Mock the context hooks
vi.mock('../../context/PartyContext', () => ({
  useParty: vi.fn(() => ({
    partyMembers: [
      { id: 'char-1', name: 'Luke', class: 'commander' },
      { id: 'char-2', name: 'Han', class: 'smuggler' },
      { id: 'char-3', name: 'Leia', class: 'diplomat' },
    ],
  })),
}));

vi.mock('../../context/SpaceCombatContext', () => ({
  useSpaceCombat: vi.fn(() => ({
    spaceCombat: {
      stationAssignments: {},
    },
  })),
}));

vi.mock('../../context/GameContext', () => ({
  useGame: vi.fn(() => ({
    gameState: {
      ship: {
        heroicUpgrades: [],
        purchasedUpgrades: [],
        turboLaserStation: null,
      },
    },
  })),
}));

// Import mocked modules for dynamic control
import { useParty } from '../../context/PartyContext';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useGame } from '../../context/GameContext';

describe('StationCard', () => {
  const mockStation = {
    id: 'pilot',
    name: 'Pilot',
    description: 'Controls the ship movement',
  };

  const mockOnAssign = vi.fn();
  const mockOnUnassign = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders station name and description', () => {
    render(
      <StationCard
        station={mockStation}
        assignedCharacterId={null}
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('Controls the ship movement')).toBeInTheDocument();
  });

  it('shows "Station Unmanned" when no character assigned', () => {
    render(
      <StationCard
        station={mockStation}
        assignedCharacterId={null}
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.getByText('Station Unmanned')).toBeInTheDocument();
  });

  it('shows assign buttons for available party members', () => {
    render(
      <StationCard
        station={mockStation}
        assignedCharacterId={null}
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.getByText('Assign: Luke')).toBeInTheDocument();
    expect(screen.getByText('Assign: Han')).toBeInTheDocument();
    expect(screen.getByText('Assign: Leia')).toBeInTheDocument();
  });

  it('calls onAssign when clicking assign button', () => {
    render(
      <StationCard
        station={mockStation}
        assignedCharacterId={null}
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    fireEvent.click(screen.getByText('Assign: Luke'));

    expect(mockOnAssign).toHaveBeenCalledWith('pilot', 'char-1');
  });

  it('shows assigned character when station is manned', () => {
    render(
      <StationCard
        station={mockStation}
        assignedCharacterId="char-1"
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.getByText('Luke')).toBeInTheDocument();
    expect(screen.getByText('Commander')).toBeInTheDocument();
    expect(screen.getByText('UNASSIGN')).toBeInTheDocument();
  });

  it('calls onUnassign when clicking unassign button', () => {
    render(
      <StationCard
        station={mockStation}
        assignedCharacterId="char-1"
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    fireEvent.click(screen.getByText('UNASSIGN'));

    expect(mockOnUnassign).toHaveBeenCalledWith('pilot');
  });

  it('filters out already assigned party members from available list', () => {
    // Mock that char-1 is assigned to another station
    useSpaceCombat.mockReturnValue({
      spaceCombat: {
        stationAssignments: {
          copilot: 'char-1', // Luke is assigned to copilot
        },
      },
    });

    render(
      <StationCard
        station={mockStation}
        assignedCharacterId={null}
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    // Luke should not be available for assignment
    expect(screen.queryByText('Assign: Luke')).not.toBeInTheDocument();
    // Han and Leia should still be available
    expect(screen.getByText('Assign: Han')).toBeInTheDocument();
    expect(screen.getByText('Assign: Leia')).toBeInTheDocument();
  });

  it('shows "All rebels assigned" when no party members available', () => {
    useSpaceCombat.mockReturnValue({
      spaceCombat: {
        stationAssignments: {
          copilot: 'char-1',
          gunner1: 'char-2',
          gunner2: 'char-3',
        },
      },
    });

    render(
      <StationCard
        station={mockStation}
        assignedCharacterId={null}
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.getByText('All rebels assigned')).toBeInTheDocument();
  });

  it('shows Boosters upgrade indicator for pilot with boosterRockets', () => {
    useGame.mockReturnValue({
      gameState: {
        ship: {
          heroicUpgrades: ['boosterRockets'],
          purchasedUpgrades: [],
          turboLaserStation: null,
        },
      },
    });

    render(
      <StationCard
        station={mockStation}
        assignedCharacterId="char-1"
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.getByText('Boosters')).toBeInTheDocument();
  });

  it('does not show Boosters indicator for non-pilot stations', () => {
    useGame.mockReturnValue({
      gameState: {
        ship: {
          heroicUpgrades: ['boosterRockets'],
          purchasedUpgrades: [],
          turboLaserStation: null,
        },
      },
    });

    const gunnerStation = {
      id: 'gunner1',
      name: 'Gunner 1',
      description: 'Fires weapons',
    };

    render(
      <StationCard
        station={gunnerStation}
        assignedCharacterId="char-1"
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.queryByText('Boosters')).not.toBeInTheDocument();
  });

  it('shows Turbo indicator for gunner with turboLasers assigned to their station', () => {
    useGame.mockReturnValue({
      gameState: {
        ship: {
          heroicUpgrades: ['turboLasers'],
          purchasedUpgrades: [],
          turboLaserStation: 'gunner1',
        },
      },
    });

    const gunnerStation = {
      id: 'gunner1',
      name: 'Gunner 1',
      description: 'Fires weapons',
    };

    render(
      <StationCard
        station={gunnerStation}
        assignedCharacterId="char-1"
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.getByText('Turbo')).toBeInTheDocument();
  });

  it('does not show Turbo indicator when turboLasers assigned to different gunner', () => {
    useGame.mockReturnValue({
      gameState: {
        ship: {
          heroicUpgrades: ['turboLasers'],
          purchasedUpgrades: [],
          turboLaserStation: 'gunner2', // Assigned to gunner2, not gunner1
        },
      },
    });

    const gunnerStation = {
      id: 'gunner1',
      name: 'Gunner 1',
      description: 'Fires weapons',
    };

    render(
      <StationCard
        station={gunnerStation}
        assignedCharacterId="char-1"
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.queryByText('Turbo')).not.toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <StationCard
        station={mockStation}
        assignedCharacterId="char-1"
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      >
        <div data-testid="child-content">Combat Actions</div>
      </StationCard>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('disables children when station is unmanned', () => {
    const { container } = render(
      <StationCard
        station={mockStation}
        assignedCharacterId={null}
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      >
        <div data-testid="child-content">Combat Actions</div>
      </StationCard>
    );

    // The wrapper div for children should have opacity-40 and pointer-events-none classes
    const childWrapper = screen.getByTestId('child-content').parentElement;
    expect(childWrapper).toHaveClass('opacity-40');
    expect(childWrapper).toHaveClass('pointer-events-none');
  });

  it('enables children when station is manned', () => {
    render(
      <StationCard
        station={mockStation}
        assignedCharacterId="char-1"
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      >
        <div data-testid="child-content">Combat Actions</div>
      </StationCard>
    );

    const childWrapper = screen.getByTestId('child-content').parentElement;
    expect(childWrapper).not.toHaveClass('opacity-40');
    expect(childWrapper).not.toHaveClass('pointer-events-none');
  });

  it('handles character without class gracefully', () => {
    useParty.mockReturnValue({
      partyMembers: [
        { id: 'char-1', name: 'New Rebel' }, // No class property
      ],
    });

    render(
      <StationCard
        station={mockStation}
        assignedCharacterId="char-1"
        onAssign={mockOnAssign}
        onUnassign={mockOnUnassign}
      />
    );

    expect(screen.getByText('New Rebel')).toBeInTheDocument();
    expect(screen.getByText('Rebel')).toBeInTheDocument(); // Default fallback
  });
});
