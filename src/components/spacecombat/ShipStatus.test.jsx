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
    },
    updateShipHP: vi.fn(),
    updateShipArmor: vi.fn(),
  })),
}));

describe('ShipStatus', () => {
  const defaultProps = {
    shipHP: 10,
    shipHPMax: 10,
    shipArmor: 2,
    onUpdateHP: vi.fn(),
    onUpdateArmor: vi.fn(),
  };

  it('renders with armor tier 0 (no shields)', () => {
    render(<ShipStatus {...defaultProps} shipArmor={0} />);
    
    // Should render ship status
    expect(screen.getByText(/HP/i)).toBeInTheDocument();
  });

  it('renders with armor tier 1 (weak shields)', () => {
    render(<ShipStatus {...defaultProps} shipArmor={1} />);
    
    expect(screen.getByText(/HP/i)).toBeInTheDocument();
  });

  it('renders with armor tier 2 (medium shields)', () => {
    render(<ShipStatus {...defaultProps} shipArmor={2} />);
    
    expect(screen.getByText(/HP/i)).toBeInTheDocument();
  });

  it('renders with armor tier 3 (full shields)', () => {
    render(<ShipStatus {...defaultProps} shipArmor={3} />);
    
    expect(screen.getByText(/HP/i)).toBeInTheDocument();
  });

  it('displays correct HP values', () => {
    render(<ShipStatus {...defaultProps} shipHP={5} shipHPMax={10} />);
    
    // Should show current/max HP
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });
});
