import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSoundEffects } from './useSoundEffects';

describe('useSoundEffects', () => {
  let localStorageMock;
  let originalGetItem;
  let originalSetItem;

  beforeEach(() => {
    // Mock localStorage methods
    localStorageMock = {};
    originalGetItem = Storage.prototype.getItem;
    originalSetItem = Storage.prototype.setItem;
    
    Storage.prototype.getItem = vi.fn((key) => localStorageMock[key] || null);
    Storage.prototype.setItem = vi.fn((key, value) => {
      localStorageMock[key] = value;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = originalGetItem;
    Storage.prototype.setItem = originalSetItem;
    localStorageMock = {};
  });

  it('initializes with sound enabled by default', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current.getMutedState()).toBe(false);
  });

  it('initializes with sound muted if localStorage says so', () => {
    localStorageMock['spaceCombatSoundsMuted'] = 'true';
    
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current.getMutedState()).toBe(true);
  });

  it('toggleMute toggles muted state', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current.getMutedState()).toBe(false);
    
    act(() => {
      result.current.toggleMute();
    });
    
    expect(result.current.getMutedState()).toBe(true);
    
    act(() => {
      result.current.toggleMute();
    });
    
    expect(result.current.getMutedState()).toBe(false);
  });

  it('toggleMute persists to localStorage', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    act(() => {
      result.current.toggleMute();
    });
    
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('spaceCombatSoundsMuted', 'true');
    
    act(() => {
      result.current.toggleMute();
    });
    
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('spaceCombatSoundsMuted', 'false');
  });

  it('toggleMute returns current muted state', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    let mutedState;
    act(() => {
      mutedState = result.current.toggleMute();
    });
    
    expect(mutedState).toBe(true);
    
    act(() => {
      mutedState = result.current.toggleMute();
    });
    
    expect(mutedState).toBe(false);
  });

  it('play is a function', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(typeof result.current.play).toBe('function');
  });

  it('getMutedState returns current mute state', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current.getMutedState()).toBe(false);
    
    act(() => {
      result.current.toggleMute();
    });
    
    expect(result.current.getMutedState()).toBe(true);
  });

  it('hook returns expected API shape', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current).toHaveProperty('play');
    expect(result.current).toHaveProperty('toggleMute');
    expect(result.current).toHaveProperty('getMutedState');
    expect(typeof result.current.play).toBe('function');
    expect(typeof result.current.toggleMute).toBe('function');
    expect(typeof result.current.getMutedState).toBe('function');
  });
});
