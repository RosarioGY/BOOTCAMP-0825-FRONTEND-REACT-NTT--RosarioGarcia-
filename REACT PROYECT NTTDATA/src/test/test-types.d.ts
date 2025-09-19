// test-types.d.ts - Type declarations for testing
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeRequired(): R;
      toBeDisabled(): R;
      toHaveAccessibleName(name: string): R;
      toContainElement(element: HTMLElement): R;
    }
  }
}