import { useRef, useCallback } from 'react';

/**
 * Custom hook for detecting swipe gestures on both touch and mouse
 * Works with native pointer events (no external dependencies)
 * 
 * @param {Object} config
 * @param {Function} config.onSwipeLeft - Callback when user swipes left
 * @param {Function} config.onSwipeRight - Callback when user swipes right
 * @param {number} config.threshold - Minimum distance in pixels to trigger swipe (default: 50)
 * @returns {Object} Event handlers to attach to the swipeable element
 */
export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 50 }) {
  const startX = useRef(null);
  const startY = useRef(null);
  const isDragging = useRef(false);

  const handlePointerDown = useCallback((e) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    isDragging.current = true;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    
    // Prevent text selection while dragging
    e.preventDefault();
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging.current || startX.current === null) return;

    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - startY.current;
    
    // Only trigger if horizontal movement is greater than vertical (more of a swipe than scroll)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    
    if (isHorizontalSwipe && Math.abs(deltaX) >= threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Reset
    startX.current = null;
    startY.current = null;
    isDragging.current = false;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const handlePointerCancel = useCallback(() => {
    // Reset on cancel (e.g., touch interrupted)
    startX.current = null;
    startY.current = null;
    isDragging.current = false;
  }, []);

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    style: { touchAction: 'pan-y' } // Allow vertical scrolling but handle horizontal gestures
  };
}
