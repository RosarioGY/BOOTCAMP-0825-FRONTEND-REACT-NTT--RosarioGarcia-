// test/setup.ts - Test setup file
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Simple polyfill para TextEncoder/TextDecoder
Object.assign(global, {
  TextEncoder: class {
    encode(str: string) { return new Uint8Array([...str].map(c => c.charCodeAt(0))); }
  },
  TextDecoder: class {
    decode(arr: Uint8Array) { return String.fromCharCode(...Array.from(arr)); }
  }
});