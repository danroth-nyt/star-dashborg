import { render } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * For component tests, we'll use simple wrappers with minimal setup
 * Most components don't need full context - just mock what they need
 */

// Re-export everything from React Testing Library
export * from '@testing-library/react';

/**
 * Simple render with no providers - for isolated component testing
 * Components can mock their own hooks as needed
 */
export { render };

/**
 * Default mock context values for testing
 */
export const mockAuthContext = {
  session: { user: { id: 'test-user-id', email: 'test@example.com' } },
  user: { id: 'test-user-id', email: 'test@example.com' },
  loading: false,
};

export const mockGameContext = {
  gameState: {
    journal: '<p>Test journal</p>',
    ship: {
      name: 'Test Ship',
      heroicUpgrades: [],
      purchasedUpgrades: [],
      turboLaserStation: null,
    },
  },
  updateGameState: vi.fn(),
  addLog: vi.fn(),
};

export const mockCharacterContext = {
  character: {
    id: 'test-char-id',
    name: 'Test Character',
    journal: '<p>Test character journal</p>',
    edge: 1,
    heart: 2,
    iron: 3,
    shadow: 2,
    wits: 2,
    health: 5,
    spirit: 5,
    supply: 5,
    momentum: 2,
  },
  updateField: vi.fn(),
  resetCharacter: vi.fn(),
};

export const mockPartyContext = {
  partyMembers: [],
  updatePartyMember: vi.fn(),
  addPartyMember: vi.fn(),
  removePartyMember: vi.fn(),
};

export const mockSpaceCombatContext = {
  spaceCombat: {
    inCombat: false,
    shipHP: 10,
    shipHPMax: 10,
    shipArmor: 2,
    hyperdriveCharge: 0,
    stationAssignments: {},
    torpedoesLoaded: 0,
  },
  updateShipHP: vi.fn(),
  updateShipArmor: vi.fn(),
  modifyArmor: vi.fn(),
  enterCombat: vi.fn(),
  exitCombat: vi.fn(),
  exitCombatView: vi.fn(),
  chargeHyperdrive: vi.fn(),
  decrementHyperdrive: vi.fn(),
};
