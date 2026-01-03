/**
 * Checks if the user is currently editing text in any form element
 * @returns {boolean} True if user is typing in an input/textarea/contenteditable
 */
export function isUserTyping() {
  const activeElement = document.activeElement;
  
  if (!activeElement) return false;
  
  const tagName = activeElement.tagName;
  
  // Check for input and textarea elements
  if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
    return true;
  }
  
  // Check for contenteditable elements (TipTap editors)
  if (activeElement.isContentEditable) {
    return true;
  }
  
  // Check if element has contenteditable attribute
  if (activeElement.getAttribute('contenteditable') === 'true') {
    return true;
  }
  
  return false;
}
