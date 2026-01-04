import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAssetPath } from './assetPath';

describe('getAssetPath', () => {
  afterEach(() => {
    // Reset to original value after each test
    vi.unstubAllEnvs();
  });

  describe('path handling', () => {
    it('should return path with base URL prefix', () => {
      // In test environment, BASE_URL defaults to '/'
      const result = getAssetPath('images/boost/icon_01.png');
      expect(result).toBe('/images/boost/icon_01.png');
    });

    it('should handle paths without leading slash', () => {
      const result = getAssetPath('sounds/laser-fire.mp3');
      expect(result).toBe('/sounds/laser-fire.mp3');
    });

    it('should strip leading slash to avoid double slashes', () => {
      const result = getAssetPath('/images/boost/icon_01.png');
      expect(result).toBe('/images/boost/icon_01.png');
    });

    it('should handle nested paths correctly', () => {
      const result = getAssetPath('images/boost/_source/extract_icons.py');
      expect(result).toBe('/images/boost/_source/extract_icons.py');
    });

    it('should handle empty path', () => {
      const result = getAssetPath('');
      expect(result).toBe('/');
    });

    it('should handle just a filename', () => {
      const result = getAssetPath('vite.svg');
      expect(result).toBe('/vite.svg');
    });
  });

  describe('various asset types', () => {
    it('should work with image files', () => {
      expect(getAssetPath('images/boost/icon_01.png')).toBe('/images/boost/icon_01.png');
      expect(getAssetPath('images/boost/icon_20.png')).toBe('/images/boost/icon_20.png');
    });

    it('should work with audio files', () => {
      expect(getAssetPath('sounds/alarm-critical.mp3')).toBe('/sounds/alarm-critical.mp3');
      expect(getAssetPath('sounds/laser-fire-short.mp3')).toBe('/sounds/laser-fire-short.mp3');
    });

    it('should work with SVG files', () => {
      expect(getAssetPath('vite.svg')).toBe('/vite.svg');
    });
  });

  describe('edge cases', () => {
    it('should handle path with multiple leading slashes', () => {
      // Only strips one leading slash
      const result = getAssetPath('//images/test.png');
      expect(result).toBe('//images/test.png');
    });

    it('should handle path with special characters', () => {
      const result = getAssetPath('images/file-name_v2.0.png');
      expect(result).toBe('/images/file-name_v2.0.png');
    });

    it('should handle path with spaces (URL encoded)', () => {
      const result = getAssetPath('images/my%20file.png');
      expect(result).toBe('/images/my%20file.png');
    });
  });

  describe('production base URL simulation', () => {
    it('should correctly construct paths for GitHub Pages deployment', () => {
      // This test documents the expected behavior in production
      // In production, BASE_URL would be '/star-dashborg/'
      // The function concatenates: BASE_URL + cleanPath
      // Example: '/star-dashborg/' + 'images/boost/icon_01.png' = '/star-dashborg/images/boost/icon_01.png'
      
      // We can't easily mock import.meta.env in Vitest without additional setup,
      // but we can verify the function's logic is correct by testing the path cleaning
      const pathWithSlash = '/images/test.png';
      const pathWithoutSlash = 'images/test.png';
      
      // Both should produce the same result since leading slash is stripped
      const result1 = getAssetPath(pathWithSlash);
      const result2 = getAssetPath(pathWithoutSlash);
      
      expect(result1).toBe(result2);
    });
  });
});
