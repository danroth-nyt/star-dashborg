import { render } from '@testing-library/react';

/**
 * For component tests, we'll use simple wrappers with minimal setup
 * Most components don't need full context - just mock what they need
 */

// Re-export everything from React Testing Library
export * from '@testing-library/react';

/**
 * Simple render with no providers - for isolated component testing
 * Components can mock their own hooks as needed
 */
export { render };
