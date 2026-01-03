import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSwipeGesture } from './useSwipeGesture';

describe('useSwipeGesture', () => {
  describe('initialization', () => {
    it('should return event handlers and style', () => {
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeLeft: vi.fn(), 
        onSwipeRight: vi.fn() 
      }));
      
      expect(result.current).toHaveProperty('onPointerDown');
      expect(result.current).toHaveProperty('onPointerMove');
      expect(result.current).toHaveProperty('onPointerUp');
      expect(result.current).toHaveProperty('onPointerCancel');
      expect(result.current).toHaveProperty('style');
      expect(result.current.style).toEqual({ touchAction: 'pan-y' });
    });

    it('should accept threshold parameter', () => {
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeLeft: vi.fn(), 
        onSwipeRight: vi.fn(),
        threshold: 100
      }));
      
      expect(result.current).toBeDefined();
    });
  });

  describe('swipe right detection', () => {
    it('should call onSwipeRight for rightward swipe above threshold', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 50
      }));
      
      // Simulate pointer down
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
      });
      
      // Simulate pointer up (moved 80px to the right)
      act(() => {
        result.current.onPointerUp({ clientX: 180, clientY: 200 });
      });
      
      expect(onSwipeRight).toHaveBeenCalledTimes(1);
    });

    it('should not call onSwipeRight for swipe below threshold', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
      });
      
      // Move only 40px to the right (below 50px threshold)
      act(() => {
        result.current.onPointerUp({ clientX: 140, clientY: 200 });
      });
      
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should use custom threshold', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 100
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
      });
      
      // Move 80px (below 100px threshold)
      act(() => {
        result.current.onPointerUp({ clientX: 180, clientY: 200 });
      });
      
      expect(onSwipeRight).not.toHaveBeenCalled();
      
      // Move 120px (above 100px threshold)
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
        result.current.onPointerUp({ clientX: 220, clientY: 200 });
      });
      
      expect(onSwipeRight).toHaveBeenCalledTimes(1);
    });
  });

  describe('swipe left detection', () => {
    it('should call onSwipeLeft for leftward swipe above threshold', () => {
      const onSwipeLeft = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeLeft,
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 200, clientY: 200 });
      });
      
      // Move 80px to the left
      act(() => {
        result.current.onPointerUp({ clientX: 120, clientY: 200 });
      });
      
      expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    });

    it('should not call onSwipeLeft for swipe below threshold', () => {
      const onSwipeLeft = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeLeft,
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 200, clientY: 200 });
      });
      
      // Move only 30px to the left
      act(() => {
        result.current.onPointerUp({ clientX: 170, clientY: 200 });
      });
      
      expect(onSwipeLeft).not.toHaveBeenCalled();
    });
  });

  describe('vertical swipe handling', () => {
    it('should not trigger callbacks for vertical swipes', () => {
      const onSwipeLeft = vi.fn();
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeLeft,
        onSwipeRight,
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 200, clientY: 100 });
      });
      
      // Vertical swipe (large Y movement, small X movement)
      act(() => {
        result.current.onPointerUp({ clientX: 210, clientY: 300 });
      });
      
      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should require horizontal movement to exceed vertical movement', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 100 });
      });
      
      // Diagonal swipe where vertical exceeds horizontal
      act(() => {
        result.current.onPointerUp({ clientX: 180, clientY: 200 });
      });
      
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should trigger callback when horizontal exceeds vertical', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 100 });
      });
      
      // Horizontal swipe exceeds vertical (100px horizontal, 20px vertical)
      act(() => {
        result.current.onPointerUp({ clientX: 200, clientY: 120 });
      });
      
      expect(onSwipeRight).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should not trigger callbacks without pointer down first', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 50
      }));
      
      // Pointer up without pointer down
      act(() => {
        result.current.onPointerUp({ clientX: 200, clientY: 200 });
      });
      
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should handle onPointerMove', () => {
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight: vi.fn(),
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
      });
      
      const mockEvent = { 
        clientX: 150, 
        clientY: 200,
        preventDefault: vi.fn()
      };
      
      act(() => {
        result.current.onPointerMove(mockEvent);
      });
      
      // Should call preventDefault when dragging
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not call preventDefault if not dragging', () => {
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight: vi.fn(),
        threshold: 50
      }));
      
      const mockEvent = { 
        clientX: 150, 
        clientY: 200,
        preventDefault: vi.fn()
      };
      
      // onPointerMove without onPointerDown first
      act(() => {
        result.current.onPointerMove(mockEvent);
      });
      
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should reset state on onPointerCancel', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
      });
      
      // Cancel the gesture
      act(() => {
        result.current.onPointerCancel();
      });
      
      // Try to complete swipe after cancel
      act(() => {
        result.current.onPointerUp({ clientX: 200, clientY: 200 });
      });
      
      // Should not trigger callback because state was reset
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should handle missing callbacks gracefully', () => {
      const { result } = renderHook(() => useSwipeGesture({ 
        threshold: 50
      }));
      
      // Should not throw error
      expect(() => {
        act(() => {
          result.current.onPointerDown({ clientX: 100, clientY: 200 });
          result.current.onPointerUp({ clientX: 200, clientY: 200 });
        });
      }).not.toThrow();
    });

    it('should reset state after successful swipe', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 50
      }));
      
      // First swipe
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
        result.current.onPointerUp({ clientX: 200, clientY: 200 });
      });
      
      expect(onSwipeRight).toHaveBeenCalledTimes(1);
      
      // Attempt another pointer up without pointer down (should not trigger)
      act(() => {
        result.current.onPointerUp({ clientX: 300, clientY: 200 });
      });
      
      expect(onSwipeRight).toHaveBeenCalledTimes(1); // Still 1, not 2
    });
  });

  describe('multiple swipes', () => {
    it('should handle multiple swipes in sequence', () => {
      const onSwipeLeft = vi.fn();
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeLeft,
        onSwipeRight,
        threshold: 50
      }));
      
      // Swipe right
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
        result.current.onPointerUp({ clientX: 200, clientY: 200 });
      });
      
      expect(onSwipeRight).toHaveBeenCalledTimes(1);
      expect(onSwipeLeft).not.toHaveBeenCalled();
      
      // Swipe left
      act(() => {
        result.current.onPointerDown({ clientX: 200, clientY: 200 });
        result.current.onPointerUp({ clientX: 100, clientY: 200 });
      });
      
      expect(onSwipeRight).toHaveBeenCalledTimes(1);
      expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    });
  });

  describe('threshold edge cases', () => {
    it('should trigger exactly at threshold', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
        result.current.onPointerUp({ clientX: 150, clientY: 200 }); // Exactly 50px
      });
      
      expect(onSwipeRight).toHaveBeenCalledTimes(1);
    });

    it('should not trigger just below threshold', () => {
      const onSwipeRight = vi.fn();
      const { result } = renderHook(() => useSwipeGesture({ 
        onSwipeRight,
        threshold: 50
      }));
      
      act(() => {
        result.current.onPointerDown({ clientX: 100, clientY: 200 });
        result.current.onPointerUp({ clientX: 149, clientY: 200 }); // 49px
      });
      
      expect(onSwipeRight).not.toHaveBeenCalled();
    });
  });
});
