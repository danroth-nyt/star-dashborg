import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VisualBoostOracle from './VisualBoostOracle';

// Mock GameContext
const mockAddLog = vi.fn();
vi.mock('../../context/GameContext', () => ({
  useGame: () => ({
    addLog: mockAddLog
  })
}));

// Mock OracleHistoryContext
const mockAddResult = vi.fn();
vi.mock('../../context/OracleHistoryContext', () => ({
  useOracleHistoryContext: () => ({
    addResult: mockAddResult
  })
}));

// Mock oracles data
vi.mock('../../data/oracles', () => ({
  visualOracles: {
    boost: [
      'Star / Compass / Direction',
      'Skull / Death / Danger',
      'Blaster / Attack / Conflict',
      'Planet / World / Environment',
      'Atom / Science / Energy',
      'Cloaked Figure / Hidden / Secret',
      'Monster / Beast / Wild',
      'Arrow / Up / Rise',
      'Remote / Control / Signal',
      'Bot / Droid / Tech',
      'Planet with Stars / World / Stellar',
      'TIE Fighter / Enemy / Empire',
      'Hand / Stop / Help',
      'Spiral / Confusion / Hypnosis',
      'Card / Chance / Gamble',
      'Boot / Kick / Travel',
      'Mushrooms / Nature / Growth',
      'Trash / Container / Loot',
      'Radar / Search / Scan',
      'Saber / Weapon / Power'
    ]
  },
  rollDice: vi.fn(() => 5) // Default to rolling 5
}));

describe('VisualBoostOracle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render 20 icons in a grid', () => {
      render(<VisualBoostOracle />);
      
      // Check for numbered badges 1-20
      for (let i = 1; i <= 20; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should render roll button', () => {
      render(<VisualBoostOracle />);
      
      expect(screen.getByRole('button', { name: /roll d20/i })).toBeInTheDocument();
    });

    it('should render all 20 icon images', () => {
      render(<VisualBoostOracle />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(20);
      
      // Check paths are correct
      images.forEach((img, index) => {
        const expectedPath = `/images/boost/icon_${String(index + 1).padStart(2, '0')}.png`;
        expect(img).toHaveAttribute('src', expectedPath);
      });
    });

    it('should not display result text initially', () => {
      render(<VisualBoostOracle />);
      
      expect(screen.queryByText(/result #/i)).not.toBeInTheDocument();
    });
  });

  describe('roll button', () => {
    it('should change button text while rolling', async () => {
      const user = userEvent.setup();
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      
      await user.click(rollButton);
      
      // Button should immediately show "rolling" text
      expect(rollButton).toHaveTextContent(/rolling/i);
    });

    it('should disable button while rolling', async () => {
      const user = userEvent.setup();
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      
      await user.click(rollButton);
      
      // Button should be disabled immediately
      expect(rollButton).toBeDisabled();
    });

    it('should re-enable button after rolling completes', async () => {
      const user = userEvent.setup();
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      
      await user.click(rollButton);
      
      // Wait for the animation to complete (10 cycles * 150ms + 200ms = ~1700ms)
      await waitFor(() => {
        expect(rollButton).not.toBeDisabled();
      }, { timeout: 3000 });
    });
  });

  describe('roll animation', () => {
    it('should call rollDice when roll button is clicked', async () => {
      const user = userEvent.setup();
      const { rollDice } = await import('../../data/oracles');
      
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      await user.click(rollButton);
      
      expect(rollDice).toHaveBeenCalledWith(20);
    });

    it('should display result after animation completes', async () => {
      const user = userEvent.setup();
      const { rollDice } = await import('../../data/oracles');
      rollDice.mockReturnValue(5);
      
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      await user.click(rollButton);
      
      // Wait for animation to complete
      await waitFor(() => {
        expect(screen.getByText(/result #5/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show correct interpretation text', async () => {
      const user = userEvent.setup();
      const { rollDice } = await import('../../data/oracles');
      rollDice.mockReturnValue(1);
      
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      await user.click(rollButton);
      
      await waitFor(() => {
        expect(screen.getByText(/star \/ compass \/ direction/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('icon selection states', () => {
    it('should highlight selected icon after roll', async () => {
      const user = userEvent.setup();
      const { rollDice } = await import('../../data/oracles');
      rollDice.mockReturnValue(3);
      
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      await user.click(rollButton);
      
      await waitFor(() => {
        // Find the div containing "3" and check its parent for highlight classes
        const iconNumber = screen.getByText('3');
        const iconContainer = iconNumber.closest('div[class*="border"]');
        
        expect(iconContainer).toHaveClass('border-accent-cyan');
        expect(iconContainer).toHaveClass('scale-105');
      }, { timeout: 3000 });
    });

    it('should dim non-selected icons after roll', async () => {
      const user = userEvent.setup();
      const { rollDice } = await import('../../data/oracles');
      rollDice.mockReturnValue(5);
      
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      await user.click(rollButton);
      
      await waitFor(() => {
        // Icon 1 should be dimmed
        const icon1 = screen.getByText('1').closest('div[class*="border"]');
        expect(icon1).toHaveClass('opacity-30');
        
        // Icon 5 should not be dimmed
        const icon5 = screen.getByText('5').closest('div[class*="border"]');
        expect(icon5).not.toHaveClass('opacity-30');
      }, { timeout: 3000 });
    });
  });

  describe('integration with contexts', () => {
    it('should add result to oracle history', async () => {
      const user = userEvent.setup();
      const { rollDice } = await import('../../data/oracles');
      rollDice.mockReturnValue(7);
      
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      await user.click(rollButton);
      
      await waitFor(() => {
        expect(mockAddResult).toHaveBeenCalledWith({
          roll: 7,
          result: 'Visual Oracle',
          detail: expect.stringContaining('Monster')
        });
      }, { timeout: 3000 });
    });

    it('should log result to game log', async () => {
      const user = userEvent.setup();
      const { rollDice } = await import('../../data/oracles');
      rollDice.mockReturnValue(10);
      
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      await user.click(rollButton);
      
      await waitFor(() => {
        expect(mockAddLog).toHaveBeenCalledWith(
          expect.stringContaining('Visual Oracle (10)'),
          'oracle'
        );
      }, { timeout: 3000 });
    });
  });

  describe('multiple rolls', () => {
    it('should allow rolling again after previous roll completes', async () => {
      const user = userEvent.setup();
      const { rollDice } = await import('../../data/oracles');
      rollDice.mockReturnValueOnce(5).mockReturnValueOnce(15);
      
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      
      // First roll
      await user.click(rollButton);
      
      await waitFor(() => {
        expect(screen.getByText(/result #5/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Second roll
      await user.click(rollButton);
      
      await waitFor(() => {
        expect(screen.getByText(/result #15/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      
      expect(rollDice).toHaveBeenCalledTimes(2);
    });

    it('should update selection when rolling again', async () => {
      const user = userEvent.setup();
      const { rollDice } = await import('../../data/oracles');
      rollDice.mockReturnValueOnce(3).mockReturnValueOnce(18);
      
      render(<VisualBoostOracle />);
      
      const rollButton = screen.getByRole('button', { name: /roll d20/i });
      
      // First roll - select icon 3
      await user.click(rollButton);
      
      await waitFor(() => {
        const icon3 = screen.getByText('3').closest('div[class*="border"]');
        expect(icon3).toHaveClass('border-accent-cyan');
      }, { timeout: 3000 });
      
      // Wait for button to be re-enabled before second roll
      await waitFor(() => {
        expect(rollButton).not.toBeDisabled();
      }, { timeout: 3000 });
      
      // Second roll - select icon 18
      await user.click(rollButton);
      
      await waitFor(() => {
        const icon18 = screen.getByText('18').closest('div[class*="border"]');
        expect(icon18).toHaveClass('border-accent-cyan');
        
        const icon3 = screen.getByText('3').closest('div[class*="border"]');
        expect(icon3).toHaveClass('opacity-30');
      }, { timeout: 3000 });
    });
  });
});
