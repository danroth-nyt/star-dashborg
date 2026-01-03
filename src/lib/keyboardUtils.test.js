import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isUserTyping } from './keyboardUtils';

describe('keyboardUtils', () => {
  let originalActiveElement;

  beforeEach(() => {
    // Store original active element
    originalActiveElement = document.activeElement;
  });

  afterEach(() => {
    // Clean up any created elements
    const testElements = document.querySelectorAll('[data-test]');
    testElements.forEach(el => el.remove());
  });

  describe('isUserTyping', () => {
    it('should return false when no element is focused', () => {
      // Blur all elements
      if (document.activeElement) {
        document.activeElement.blur();
      }
      expect(isUserTyping()).toBe(false);
    });

    it('should return true when INPUT element is focused', () => {
      const input = document.createElement('input');
      input.setAttribute('data-test', 'true');
      document.body.appendChild(input);
      input.focus();
      
      expect(isUserTyping()).toBe(true);
    });

    it('should return true when TEXTAREA element is focused', () => {
      const textarea = document.createElement('textarea');
      textarea.setAttribute('data-test', 'true');
      document.body.appendChild(textarea);
      textarea.focus();
      
      expect(isUserTyping()).toBe(true);
    });

    it('should return true when contenteditable element is focused', () => {
      const div = document.createElement('div');
      div.setAttribute('data-test', 'true');
      div.setAttribute('contenteditable', 'true');
      document.body.appendChild(div);
      div.focus();
      
      expect(isUserTyping()).toBe(true);
    });

    it('should return false when non-editable element is focused', () => {
      const button = document.createElement('button');
      button.setAttribute('data-test', 'true');
      document.body.appendChild(button);
      button.focus();
      
      expect(isUserTyping()).toBe(false);
    });

    it('should return false when regular div is focused', () => {
      const div = document.createElement('div');
      div.setAttribute('data-test', 'true');
      div.tabIndex = 0; // Make it focusable
      document.body.appendChild(div);
      div.focus();
      
      expect(isUserTyping()).toBe(false);
    });

    it('should handle different input types', () => {
      const inputTypes = ['text', 'email', 'password', 'number', 'search'];
      
      inputTypes.forEach(type => {
        const input = document.createElement('input');
        input.type = type;
        input.setAttribute('data-test', 'true');
        document.body.appendChild(input);
        input.focus();
        
        expect(isUserTyping()).toBe(true);
        input.remove();
      });
    });

    it('should return false for contenteditable=false', () => {
      const div = document.createElement('div');
      div.setAttribute('data-test', 'true');
      div.setAttribute('contenteditable', 'false');
      div.tabIndex = 0; // Make it focusable
      document.body.appendChild(div);
      div.focus();
      
      expect(isUserTyping()).toBe(false);
    });
  });
});
