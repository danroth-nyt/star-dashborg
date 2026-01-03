import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OracleQuickBar from './OracleQuickBar';

// Mock GameContext
const mockAddLog = vi.fn();
const mockGameState = {
  threatDie: 3
};

vi.mock('../../context/GameContext', () => ({
  useGame: () => ({
    addLog: mockAddLog,
    gameState: mockGameState
  })
}));

// Mock OracleHistoryContext
const mockAddResult = vi.fn();
vi.mock('../../context/OracleHistoryContext', () => ({
  useOracleHistoryContext: () => ({
    addResult: mockAddResult
  })
}));

// Mock dice rolling functions
vi.mock('../../data/oracles', () => ({
  rollAffirmation: vi.fn(() => ({ roll: 10, result: 'Yes', detail: 'Average' })),
  rollEventOracle: vi.fn(() => ({ roll: 5, verb: 'Test', subject: 'Subject', specific: 'PC Positive' })),
  rollSceneShakeup: vi.fn((threatDie) => ({
    checkRoll: 10,
    threatDie,
    total: 10 + threatDie,
    success: false
  }))
}));

describe('OracleQuickBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all three main buttons', () => {
      render(<OracleQuickBar />);
      
      expect(screen.getByText(/ask oracle/i)).toBeInTheDocument();
      expect(screen.getByText(/shakeup/i)).toBeInTheDocument();
      expect(screen.getByText(/event/i)).toBeInTheDocument();
    });

    it('should render modifier buttons with desktop labels', () => {
      render(<OracleQuickBar />);
      
      // Check for the hidden spans with full text (desktop)
      const normButtons = screen.getAllByText('Norm');
      const advButtons = screen.getAllByText('Adv');
      const disButtons = screen.getAllByText('Dis');
      
      expect(normButtons.length).toBeGreaterThan(0);
      expect(advButtons.length).toBeGreaterThan(0);
      expect(disButtons.length).toBeGreaterThan(0);
    });

    it('should render modifier buttons with mobile labels', () => {
      render(<OracleQuickBar />);
      
      // Check for single letter labels (mobile)
      const nButtons = screen.getAllByText('N');
      const aButtons = screen.getAllByText('A');
      const dButtons = screen.getAllByText('D');
      
      expect(nButtons.length).toBeGreaterThan(0);
      expect(aButtons.length).toBeGreaterThan(0);
      expect(dButtons.length).toBeGreaterThan(0);
    });
  });

  describe('modifier buttons', () => {
    it('should start with normal mode selected', () => {
      render(<OracleQuickBar />);
      
      const normButton = screen.getAllByText('Norm')[0].closest('button');
      
      // Normal mode should have active styling
      expect(normButton).toHaveClass('bg-accent-cyan');
    });

    it('should switch to advantage mode when clicked', async () => {
      const user = userEvent.setup();
      render(<OracleQuickBar />);
      
      const advButton = screen.getAllByText('Adv')[0].closest('button');
      
      await user.click(advButton);
      
      // Advantage button should now have active styling
      expect(advButton).toHaveClass('bg-accent-yellow');
    });

    it('should switch to disadvantage mode when clicked', async () => {
      const user = userEvent.setup();
      render(<OracleQuickBar />);
      
      const disButton = screen.getAllByText('Dis')[0].closest('button');
      
      await user.click(disButton);
      
      // Disadvantage button should now have active styling
      expect(disButton).toHaveClass('bg-accent-red');
    });

    it('should switch between modes correctly', async () => {
      const user = userEvent.setup();
      render(<OracleQuickBar />);
      
      const normButton = screen.getAllByText('Norm')[0].closest('button');
      const advButton = screen.getAllByText('Adv')[0].closest('button');
      const disButton = screen.getAllByText('Dis')[0].closest('button');
      
      // Start with normal
      expect(normButton).toHaveClass('bg-accent-cyan');
      
      // Switch to advantage
      await user.click(advButton);
      expect(advButton).toHaveClass('bg-accent-yellow');
      expect(normButton).not.toHaveClass('bg-accent-cyan');
      
      // Switch to disadvantage
      await user.click(disButton);
      expect(disButton).toHaveClass('bg-accent-red');
      expect(advButton).not.toHaveClass('bg-accent-yellow');
      
      // Switch back to normal
      await user.click(normButton);
      expect(normButton).toHaveClass('bg-accent-cyan');
      expect(disButton).not.toHaveClass('bg-accent-red');
    });
  });

  describe('Ask Oracle button', () => {
    it('should call rollAffirmation when clicked in normal mode', async () => {
      const user = userEvent.setup();
      const { rollAffirmation } = await import('../../data/oracles');
      
      render(<OracleQuickBar />);
      
      const askOracleButton = screen.getByText(/ask oracle/i);
      await user.click(askOracleButton);
      
      expect(rollAffirmation).toHaveBeenCalled();
      expect(mockAddLog).toHaveBeenCalled();
      expect(mockAddResult).toHaveBeenCalled();
    });

    it('should roll twice in advantage mode', async () => {
      const user = userEvent.setup();
      const { rollAffirmation } = await import('../../data/oracles');
      
      // Mock different rolls for advantage
      rollAffirmation.mockReturnValueOnce({ roll: 5, result: 'No', detail: 'Bad' });
      rollAffirmation.mockReturnValueOnce({ roll: 15, result: 'Yes', detail: 'Good' });
      
      render(<OracleQuickBar />);
      
      // Switch to advantage mode
      const advButton = screen.getAllByText('Adv')[0].closest('button');
      await user.click(advButton);
      
      // Click Ask Oracle
      const askOracleButton = screen.getByText(/ask oracle/i);
      await user.click(askOracleButton);
      
      expect(rollAffirmation).toHaveBeenCalledTimes(2);
      // Should log the higher roll (15)
      expect(mockAddLog).toHaveBeenCalledWith(
        expect.stringContaining('ADV'),
        'roll'
      );
    });

    it('should roll twice in disadvantage mode', async () => {
      const user = userEvent.setup();
      const { rollAffirmation } = await import('../../data/oracles');
      
      // Mock different rolls for disadvantage
      rollAffirmation.mockReturnValueOnce({ roll: 15, result: 'Yes', detail: 'Good' });
      rollAffirmation.mockReturnValueOnce({ roll: 5, result: 'No', detail: 'Bad' });
      
      render(<OracleQuickBar />);
      
      // Switch to disadvantage mode
      const disButton = screen.getAllByText('Dis')[0].closest('button');
      await user.click(disButton);
      
      // Click Ask Oracle
      const askOracleButton = screen.getByText(/ask oracle/i);
      await user.click(askOracleButton);
      
      expect(rollAffirmation).toHaveBeenCalledTimes(2);
      // Should log the lower roll (5)
      expect(mockAddLog).toHaveBeenCalledWith(
        expect.stringContaining('DIS'),
        'roll'
      );
    });
  });

  describe('Shakeup button', () => {
    it('should call rollSceneShakeup with threat die', async () => {
      const user = userEvent.setup();
      const { rollSceneShakeup } = await import('../../data/oracles');
      
      render(<OracleQuickBar />);
      
      const shakeupButton = screen.getByText(/shakeup/i);
      await user.click(shakeupButton);
      
      expect(rollSceneShakeup).toHaveBeenCalledWith(3); // threatDie from mockGameState
      expect(mockAddLog).toHaveBeenCalled();
      expect(mockAddResult).toHaveBeenCalled();
    });
  });

  describe('Event button', () => {
    it('should call rollEventOracle when clicked', async () => {
      const user = userEvent.setup();
      const { rollEventOracle } = await import('../../data/oracles');
      
      render(<OracleQuickBar />);
      
      const eventButton = screen.getByText(/event/i);
      await user.click(eventButton);
      
      expect(rollEventOracle).toHaveBeenCalled();
      expect(mockAddLog).toHaveBeenCalled();
      expect(mockAddResult).toHaveBeenCalled();
    });
  });
});
