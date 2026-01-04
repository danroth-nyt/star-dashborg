import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('does not update value before delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'updated', delay: 500 });

    // Advance time but not past the delay
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Should still be the old value
    expect(result.current).toBe('initial');
  });

  it('updates value after delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'updated', delay: 500 });

    // Advance time past the delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should be the new value
    expect(result.current).toBe('updated');
  });

  it('resets timer when value changes during debounce period', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'first update', delay: 500 });

    // Advance time but not past the delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Change the value again (should reset timer)
    rerender({ value: 'second update', delay: 500 });

    // Advance time to what would have been the first delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should still be initial (timer was reset)
    expect(result.current).toBe('initial');

    // Advance past the second delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Now should be the second update
    expect(result.current).toBe('second update');
  });

  it('uses default delay of 500ms when not specified', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // Advance 400ms - should still be initial
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe('initial');

    // Advance another 100ms (total 500ms) - should be updated
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('updated');
  });

  it('handles different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    rerender({ value: 'updated', delay: 1000 });

    // At 500ms - should still be initial
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('initial');

    // At 1000ms - should be updated
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated');
  });

  it('works with non-string values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: { count: 0 }, delay: 100 } }
    );

    const newValue = { count: 1 };
    rerender({ value: newValue, delay: 100 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual({ count: 1 });
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    // Trigger an update to create a timeout
    rerender({ value: 'updated' });
    
    // Unmount the hook
    unmount();

    // clearTimeout should have been called
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});
