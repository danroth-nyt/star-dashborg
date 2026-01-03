import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

describe('LoadingScreen', () => {
  describe('rendering', () => {
    it('should render default loading message', async () => {
      render(<LoadingScreen />);
      
      // Wait for the component to show content after 100ms delay
      await waitFor(() => {
        expect(screen.getByText('LOADING')).toBeInTheDocument();
      });
    });

    it('should render custom loading message', async () => {
      render(<LoadingScreen message="INITIALIZING SYSTEMS" />);
      
      await waitFor(() => {
        expect(screen.getByText('INITIALIZING SYSTEMS')).toBeInTheDocument();
      });
    });

    it('should render without details by default', async () => {
      render(<LoadingScreen />);
      
      await waitFor(() => {
        expect(screen.getByText('LOADING')).toBeInTheDocument();
      });
      
      expect(screen.queryByText(/>/)).not.toBeInTheDocument();
    });

    it('should render details when provided', async () => {
      const details = [
        'Loading character data',
        'Connecting to server',
        'Syncing state'
      ];
      
      render(<LoadingScreen message="LOADING" details={details} />);
      
      await waitFor(() => {
        expect(screen.getByText(/> loading character data/i)).toBeInTheDocument();
        expect(screen.getByText(/> connecting to server/i)).toBeInTheDocument();
        expect(screen.getByText(/> syncing state/i)).toBeInTheDocument();
      });
    });
  });

  describe('animations and styling', () => {
    it('should apply scanlines class', async () => {
      const { container } = render(<LoadingScreen />);
      
      await waitFor(() => {
        const mainDiv = container.firstChild;
        expect(mainDiv).toHaveClass('scanlines');
      });
    });

    it('should apply typewriter class to message', async () => {
      render(<LoadingScreen message="TEST MESSAGE" />);
      
      await waitFor(() => {
        const message = screen.getByText('TEST MESSAGE');
        expect(message).toHaveClass('typewriter');
      });
    });

    it('should render three pulsing dots', async () => {
      const { container } = render(<LoadingScreen />);
      
      await waitFor(() => {
        const dots = container.querySelectorAll('.animate-pulse');
        expect(dots).toHaveLength(3);
      });
    });

    it('should apply cyan glow to message', async () => {
      render(<LoadingScreen />);
      
      await waitFor(() => {
        const message = screen.getByText('LOADING');
        expect(message).toHaveClass('text-accent-cyan');
        expect(message).toHaveClass('text-glow-cyan');
      });
    });
  });

  describe('minimum display time', () => {
    it('should be invisible for first 100ms', () => {
      render(<LoadingScreen />);
      
      const container = document.querySelector('.min-h-screen');
      expect(container).toHaveClass('opacity-0');
    });

    it('should become visible after 100ms', async () => {
      render(<LoadingScreen />);
      
      // Before delay - should be invisible
      expect(screen.getByText('LOADING').closest('.min-h-screen')).toHaveClass('opacity-0');
      
      // After delay - should be visible
      await waitFor(() => {
        const container = screen.getByText('LOADING').closest('.min-h-screen');
        expect(container).not.toHaveClass('opacity-0');
      });
    });
  });

  describe('layout', () => {
    it('should center content vertically and horizontally', async () => {
      const { container } = render(<LoadingScreen />);
      
      await waitFor(() => {
        const mainDiv = container.firstChild;
        expect(mainDiv).toHaveClass('flex');
        expect(mainDiv).toHaveClass('items-center');
        expect(mainDiv).toHaveClass('justify-center');
        expect(mainDiv).toHaveClass('min-h-screen');
      });
    });

    it('should use primary background color', async () => {
      const { container } = render(<LoadingScreen />);
      
      await waitFor(() => {
        const mainDiv = container.firstChild;
        expect(mainDiv).toHaveClass('bg-bg-primary');
      });
    });
  });

  describe('details formatting', () => {
    it('should prepend ">" to each detail line', async () => {
      const details = ['First line', 'Second line'];
      render(<LoadingScreen details={details} />);
      
      await waitFor(() => {
        expect(screen.getByText(/> first line/i)).toBeInTheDocument();
        expect(screen.getByText(/> second line/i)).toBeInTheDocument();
      });
    });

    it('should render each detail on separate line', async () => {
      const details = ['Line 1', 'Line 2', 'Line 3'];
      render(<LoadingScreen details={details} />);
      
      await waitFor(() => {
        const detailElements = screen.getAllByText(/^>/);
        expect(detailElements).toHaveLength(3);
      });
    });

    it('should apply correct styling to details', async () => {
      const details = ['Loading...'];
      const { container } = render(<LoadingScreen details={details} />);
      
      await waitFor(() => {
        const detailsContainer = container.querySelector('.font-mono');
        expect(detailsContainer).toHaveClass('text-accent-yellow/50');
        expect(detailsContainer).toHaveClass('text-sm');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty details array', async () => {
      render(<LoadingScreen details={[]} />);
      
      await waitFor(() => {
        expect(screen.getByText('LOADING')).toBeInTheDocument();
      });
      
      expect(screen.queryByText(/>/)).not.toBeInTheDocument();
    });

    it('should handle null details', async () => {
      render(<LoadingScreen details={null} />);
      
      await waitFor(() => {
        expect(screen.getByText('LOADING')).toBeInTheDocument();
      });
    });

    it('should handle very long message', async () => {
      const longMessage = 'A'.repeat(100);
      render(<LoadingScreen message={longMessage} />);
      
      await waitFor(() => {
        expect(screen.getByText(longMessage)).toBeInTheDocument();
      });
    });

    it('should handle special characters in message', async () => {
      render(<LoadingScreen message="LOADING... [!@#$%^&*()]" />);
      
      await waitFor(() => {
        expect(screen.getByText('LOADING... [!@#$%^&*()]')).toBeInTheDocument();
      });
    });

    it('should handle many detail lines', async () => {
      const manyDetails = Array.from({ length: 20 }, (_, i) => `Detail ${i + 1}`);
      render(<LoadingScreen details={manyDetails} />);
      
      await waitFor(() => {
        const detailElements = screen.getAllByText(/^>/);
        expect(detailElements).toHaveLength(20);
      });
    });
  });

  describe('accessibility', () => {
    it('should render as main content area', async () => {
      const { container } = render(<LoadingScreen />);
      
      await waitFor(() => {
        const mainDiv = container.firstChild;
        expect(mainDiv.tagName).toBe('DIV');
        expect(mainDiv).toHaveClass('min-h-screen');
      });
    });

    it('should have readable text content', async () => {
      render(<LoadingScreen message="LOADING DATA" />);
      
      await waitFor(() => {
        const message = screen.getByText('LOADING DATA');
        expect(message).toBeVisible();
      });
    });
  });
});
