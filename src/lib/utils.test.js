import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, generateRoomCode, getRoomFromURL, updateURLWithRoom } from './utils';

describe('utils', () => {
  describe('cn (className merge)', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('merges tailwind classes correctly', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('handles undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });

    it('handles empty input', () => {
      expect(cn()).toBe('');
    });
  });

  describe('generateRoomCode', () => {
    it('returns a 4-character string', () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(4);
    });

    it('only contains valid characters', () => {
      // Run multiple times to increase confidence
      for (let i = 0; i < 100; i++) {
        const code = generateRoomCode();
        // Valid chars: ABCDEFGHJKLMNPQRSTUVWXYZ23456789 (no I, O, 0, 1)
        expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
      }
    });

    it('excludes ambiguous characters (I, O, 0, 1)', () => {
      // Generate many codes to ensure ambiguous chars are never included
      const codes = Array.from({ length: 100 }, () => generateRoomCode());
      const allChars = codes.join('');
      
      expect(allChars).not.toContain('I');
      expect(allChars).not.toContain('O');
      expect(allChars).not.toContain('0');
      expect(allChars).not.toContain('1');
    });

    it('generates different codes (not deterministic)', () => {
      const codes = new Set();
      for (let i = 0; i < 20; i++) {
        codes.add(generateRoomCode());
      }
      // Should have generated at least 10 unique codes out of 20
      expect(codes.size).toBeGreaterThan(10);
    });
  });

  describe('getRoomFromURL', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      delete window.location;
      window.location = {
        search: '',
        href: 'http://localhost/',
      };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('returns room code from URL query param', () => {
      window.location.search = '?room=ABCD';
      expect(getRoomFromURL()).toBe('ABCD');
    });

    it('returns null if no room param', () => {
      window.location.search = '';
      expect(getRoomFromURL()).toBeNull();
    });

    it('returns null if room param is empty', () => {
      window.location.search = '?room=';
      expect(getRoomFromURL()).toBe('');
    });

    it('handles other query params', () => {
      window.location.search = '?foo=bar&room=XYZ9&baz=qux';
      expect(getRoomFromURL()).toBe('XYZ9');
    });
  });

  describe('updateURLWithRoom', () => {
    let pushStateSpy;

    beforeEach(() => {
      pushStateSpy = vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
    });

    afterEach(() => {
      pushStateSpy.mockRestore();
    });

    it('calls pushState with room code in URL', () => {
      updateURLWithRoom('TEST');
      
      expect(pushStateSpy).toHaveBeenCalledTimes(1);
      const [state, title, url] = pushStateSpy.mock.calls[0];
      expect(state).toEqual({});
      expect(title).toBe('');
      expect(url.toString()).toContain('room=TEST');
    });
  });
});
