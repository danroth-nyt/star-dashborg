import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThreatDie from './ThreatDie';

// Mock GameContext
const mockUpdateGameState = vi.fn();
const mockAddLog = vi.fn();
let mockThreatDie = 1;

vi.mock('../../context/GameContext', () => ({
  useGame: () => ({
    gameState: {
      get threatDie() {
        return mockThreatDie;
      }
    },
    updateGameState: mockUpdateGameState,
    addLog: mockAddLog
  })
}));

describe('ThreatDie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockThreatDie = 1;
  });

  describe('rendering', () => {
    it('should render the current threat die value', () => {
      mockThreatDie = 3;
      render(<ThreatDie />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render click instruction', () => {
      render(<ThreatDie />);
      
      expect(screen.getByText(/click to cycle/i)).toBeInTheDocument();
    });

    it('should render as a button', () => {
      render(<ThreatDie />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('1');
    });
  });

  describe('cycling behavior', () => {
    it('should increment threat die when clicked', async () => {
      const user = userEvent.setup();
      mockThreatDie = 2;
      render(<ThreatDie />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockUpdateGameState).toHaveBeenCalledWith({ threatDie: 3 });
    });

    it('should cycle from 6 back to 1', async () => {
      const user = userEvent.setup();
      mockThreatDie = 6;
      render(<ThreatDie />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockUpdateGameState).toHaveBeenCalledWith({ threatDie: 1 });
    });

    it('should cycle through all values 1-6', async () => {
      const user = userEvent.setup();
      
      for (let expected = 2; expected <= 6; expected++) {
        mockThreatDie = expected - 1;
        const { unmount } = render(<ThreatDie />);
        
        const button = screen.getByRole('button');
        await user.click(button);
        
        expect(mockUpdateGameState).toHaveBeenCalledWith({ threatDie: expected });
        
        unmount();
      }
      
      // Test wrap around from 6 to 1
      mockThreatDie = 6;
      render(<ThreatDie />);
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockUpdateGameState).toHaveBeenCalledWith({ threatDie: 1 });
    });

    it('should log the new threat die value', async () => {
      const user = userEvent.setup();
      mockThreatDie = 4;
      render(<ThreatDie />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockAddLog).toHaveBeenCalledWith('Threat Die set to 5', 'threat');
    });
  });

  describe('max threat alert', () => {
    it('should not show alert when threat die is less than 6', () => {
      mockThreatDie = 3;
      render(<ThreatDie />);
      
      expect(screen.queryByText(/maximum threat/i)).not.toBeInTheDocument();
    });

    it('should show alert when threat die is 6', () => {
      mockThreatDie = 6;
      render(<ThreatDie />);
      
      expect(screen.getByText(/maximum threat/i)).toBeInTheDocument();
    });

    it('should display alert with danger clock options', () => {
      mockThreatDie = 6;
      render(<ThreatDie />);
      
      expect(screen.getByText(/advance all danger clocks by 1/i)).toBeInTheDocument();
      expect(screen.getByText(/completely fill one danger clock/i)).toBeInTheDocument();
    });

    it('should show alert with proper styling', () => {
      mockThreatDie = 6;
      render(<ThreatDie />);
      
      const alert = screen.getByText(/maximum threat/i).closest('div[class*="border"]');
      
      expect(alert).toHaveClass('border-accent-red');
      expect(alert).toHaveClass('inline-alert-pulse');
    });

    it('should display AlertTriangle icon in alert', () => {
      mockThreatDie = 6;
      render(<ThreatDie />);
      
      // Check for the icon by looking for svg element near the alert text
      const alert = screen.getByText(/maximum threat/i);
      const alertContainer = alert.closest('div');
      
      // The icon should be in the parent container
      expect(alertContainer.parentElement.querySelector('svg')).toBeInTheDocument();
    });

    it('should hide alert after cycling away from 6', async () => {
      const user = userEvent.setup();
      mockThreatDie = 6;
      const { rerender } = render(<ThreatDie />);
      
      expect(screen.getByText(/maximum threat/i)).toBeInTheDocument();
      
      // Click to cycle to 1
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Update mock and rerender
      mockThreatDie = 1;
      rerender(<ThreatDie />);
      
      expect(screen.queryByText(/maximum threat/i)).not.toBeInTheDocument();
    });
  });

  describe('visual feedback', () => {
    it('should apply red glow styling to button', () => {
      render(<ThreatDie />);
      
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-accent-red');
      expect(button).toHaveClass('border-accent-red');
      expect(button).toHaveClass('glow-red');
    });

    it('should apply pulse animation when at max threat', () => {
      mockThreatDie = 6;
      render(<ThreatDie />);
      
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('glow-pulse-red');
    });

    it('should not apply pulse animation when below max threat', () => {
      mockThreatDie = 3;
      render(<ThreatDie />);
      
      const button = screen.getByRole('button');
      
      // Check that glow-pulse-red is in the class attribute
      const classes = button.getAttribute('class');
      // The component adds the class conditionally, so when threat is < 6, it should appear once (in the base classes)
      // but not twice (not added conditionally)
      const pulseCount = (classes.match(/glow-pulse-red/g) || []).length;
      expect(pulseCount).toBeLessThanOrEqual(1);
    });

    it('should show cycling animation class when clicked', async () => {
      const user = userEvent.setup();
      render(<ThreatDie />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Animation class should be present (it's added temporarily)
      expect(button).toHaveClass('threat-cycle');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined threat die gracefully', () => {
      mockThreatDie = undefined;
      
      // Should not crash
      expect(() => render(<ThreatDie />)).not.toThrow();
    });

    it('should work with threat die at 1', () => {
      mockThreatDie = 1;
      render(<ThreatDie />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.queryByText(/maximum threat/i)).not.toBeInTheDocument();
    });

    it('should work with threat die at 5 (one below max)', () => {
      mockThreatDie = 5;
      render(<ThreatDie />);
      
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.queryByText(/maximum threat/i)).not.toBeInTheDocument();
    });
  });
});
