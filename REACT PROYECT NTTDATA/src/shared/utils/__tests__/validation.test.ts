// validation.test.ts - Unit tests for validation utilities
import { isNonEmpty, isLetters, isPhone } from '@/shared/utils/validation';

describe('Validation Utilities', () => {
  describe('isNonEmpty function', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmpty('hello')).toBe(true);
      expect(isNonEmpty('a')).toBe(true);
      expect(isNonEmpty('123')).toBe(true);
      expect(isNonEmpty('Hello World')).toBe(true);
    });

    it('should return false for empty strings', () => {
      expect(isNonEmpty('')).toBe(false);
    });

    it('should return false for strings with only whitespace', () => {
      expect(isNonEmpty(' ')).toBe(false);
      expect(isNonEmpty('  ')).toBe(false);
      expect(isNonEmpty('   ')).toBe(false);
      expect(isNonEmpty('\t')).toBe(false);
      expect(isNonEmpty('\n')).toBe(false);
      expect(isNonEmpty('\r')).toBe(false);
      expect(isNonEmpty(' \t \n ')).toBe(false);
    });

    it('should return true for strings with content after trimming', () => {
      expect(isNonEmpty(' hello ')).toBe(true);
      expect(isNonEmpty('\thello\t')).toBe(true);
      expect(isNonEmpty('\nhello\n')).toBe(true);
      expect(isNonEmpty('  content  ')).toBe(true);
    });

    it('should handle special characters', () => {
      expect(isNonEmpty('!@#$%^&*()')).toBe(true);
      expect(isNonEmpty('áéíóúñ')).toBe(true);
      expect(isNonEmpty('中文')).toBe(true);
      expect(isNonEmpty('🚀')).toBe(true);
    });

    it('should handle numbers and mixed content', () => {
      expect(isNonEmpty('123')).toBe(true);
      expect(isNonEmpty('abc123')).toBe(true);
      expect(isNonEmpty('123abc')).toBe(true);
      expect(isNonEmpty('12.34')).toBe(true);
    });
  });

  describe('isLetters function', () => {
    it('should return true for valid letter strings', () => {
      expect(isLetters('hello')).toBe(true);
      expect(isLetters('Hello')).toBe(true);
      expect(isLetters('HELLO')).toBe(true);
      expect(isLetters('Hello World')).toBe(true);
      expect(isLetters('a')).toBe(true);
      expect(isLetters('A')).toBe(true);
    });

    it('should return true for Spanish characters', () => {
      expect(isLetters('áéíóú')).toBe(true);
      expect(isLetters('ÁÉÍÓÚ')).toBe(true);
      expect(isLetters('ñÑ')).toBe(true);
      expect(isLetters('üÜ')).toBe(true);
      expect(isLetters('José María')).toBe(true);
      expect(isLetters('Niño')).toBe(true);
      expect(isLetters('Müller')).toBe(true);
    });

    it('should return true for names with spaces', () => {
      expect(isLetters('John Doe')).toBe(true);
      expect(isLetters('María García')).toBe(true);
      expect(isLetters('Jean Pierre')).toBe(true);
      expect(isLetters('Ana María José')).toBe(true);
    });

    it('should return false for strings with numbers', () => {
      expect(isLetters('hello123')).toBe(false);
      expect(isLetters('123hello')).toBe(false);
      expect(isLetters('hel123lo')).toBe(false);
      expect(isLetters('123')).toBe(false);
      expect(isLetters('John1')).toBe(false);
    });

    it('should return false for strings with special characters', () => {
      expect(isLetters('hello!')).toBe(false);
      expect(isLetters('hello@world')).toBe(false);
      expect(isLetters('hello-world')).toBe(false);
      expect(isLetters('hello_world')).toBe(false);
      expect(isLetters('hello.world')).toBe(false);
      expect(isLetters('hello&world')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isLetters('')).toBe(false);
    });

    it('should handle trimming properly', () => {
      expect(isLetters(' hello ')).toBe(true);
      expect(isLetters('\thello\t')).toBe(true);
      expect(isLetters('\nhello\n')).toBe(true);
      expect(isLetters('  John Doe  ')).toBe(true);
    });

    it('should return false for only whitespace', () => {
      expect(isLetters('   ')).toBe(false);
      expect(isLetters('\t\t')).toBe(false);
      expect(isLetters('\n\n')).toBe(false);
    });

    it('should handle mixed case correctly', () => {
      expect(isLetters('HeLLo WoRLd')).toBe(true);
      expect(isLetters('mArÍa GaRcÍa')).toBe(true);
      expect(isLetters('JoSé LuIs')).toBe(true);
    });

    it('should handle single characters', () => {
      expect(isLetters('a')).toBe(true);
      expect(isLetters('Z')).toBe(true);
      expect(isLetters('ñ')).toBe(true);
      expect(isLetters('Ñ')).toBe(true);
      expect(isLetters('1')).toBe(false);
      expect(isLetters('!')).toBe(false);
    });
  });

  describe('isPhone function', () => {
    it('should return true for valid phone numbers', () => {
      expect(isPhone('1234567')).toBe(true); // 7 digits
      expect(isPhone('12345678')).toBe(true); // 8 digits  
      expect(isPhone('123456789')).toBe(true); // 9 digits
      expect(isPhone('1234567890')).toBe(true); // 10 digits
      expect(isPhone('12345678901')).toBe(true); // 11 digits
      expect(isPhone('123456789012345')).toBe(true); // 15 digits
    });

    it('should return false for phone numbers too short', () => {
      expect(isPhone('123456')).toBe(false); // 6 digits
      expect(isPhone('12345')).toBe(false); // 5 digits
      expect(isPhone('1234')).toBe(false); // 4 digits
      expect(isPhone('123')).toBe(false); // 3 digits
      expect(isPhone('12')).toBe(false); // 2 digits
      expect(isPhone('1')).toBe(false); // 1 digit
    });

    it('should return false for phone numbers too long', () => {
      expect(isPhone('1234567890123456')).toBe(false); // 16 digits
      expect(isPhone('12345678901234567')).toBe(false); // 17 digits
      expect(isPhone('123456789012345678901')).toBe(false); // 21 digits
    });

    it('should return false for strings with letters', () => {
      expect(isPhone('12345678a')).toBe(false);
      expect(isPhone('a12345678')).toBe(false);
      expect(isPhone('123a45678')).toBe(false);
      expect(isPhone('phone')).toBe(false);
      expect(isPhone('abc1234567')).toBe(false);
    });

    it('should return false for strings with special characters', () => {
      expect(isPhone('123-456-7890')).toBe(false);
      expect(isPhone('(123) 456-7890')).toBe(false);
      expect(isPhone('+1234567890')).toBe(false);
      expect(isPhone('123.456.7890')).toBe(false);
      expect(isPhone('123 456 7890')).toBe(false);
      expect(isPhone('123_456_7890')).toBe(false);
      expect(isPhone('#1234567890')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isPhone('')).toBe(false);
    });

    it('should handle trimming properly', () => {
      expect(isPhone(' 1234567890 ')).toBe(true);
      expect(isPhone('\t1234567890\t')).toBe(true);
      expect(isPhone('\n1234567890\n')).toBe(true);
      expect(isPhone('  12345678  ')).toBe(true);
    });

    it('should return false for only whitespace', () => {
      expect(isPhone('   ')).toBe(false);
      expect(isPhone('\t\t')).toBe(false);
      expect(isPhone('\n\n')).toBe(false);
    });

    it('should handle boundary values correctly', () => {
      expect(isPhone('1234567')).toBe(true); // exactly 7 digits
      expect(isPhone('123456789012345')).toBe(true); // exactly 15 digits
      expect(isPhone('123456')).toBe(false); // exactly 6 digits
      expect(isPhone('1234567890123456')).toBe(false); // exactly 16 digits
    });

    it('should return false for decimal numbers', () => {
      expect(isPhone('123456.789')).toBe(false);
      expect(isPhone('12345678.9')).toBe(false);
      expect(isPhone('1.234567890')).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(isPhone('-1234567890')).toBe(false);
      expect(isPhone('-123456789')).toBe(false);
    });

    it('should handle zero-prefixed numbers', () => {
      expect(isPhone('0123456789')).toBe(true);
      expect(isPhone('0012345678')).toBe(true);
      expect(isPhone('0000001234567')).toBe(true);
    });
  });

  describe('Integration tests', () => {
    it('should work together for form validation', () => {
      const validName = 'María José';
      const validPhone = '123456789';
      
      expect(isNonEmpty(validName)).toBe(true);
      expect(isLetters(validName)).toBe(true);
      expect(isNonEmpty(validPhone)).toBe(true);
      expect(isPhone(validPhone)).toBe(true);
    });

    it('should handle invalid combinations', () => {
      const invalidName = 'María123';
      const invalidPhone = '123-456-7890';
      
      expect(isNonEmpty(invalidName)).toBe(true);
      expect(isLetters(invalidName)).toBe(false);
      expect(isNonEmpty(invalidPhone)).toBe(true);
      expect(isPhone(invalidPhone)).toBe(false);
    });

    it('should handle empty values consistently', () => {
      const emptyString = '';
      
      expect(isNonEmpty(emptyString)).toBe(false);
      expect(isLetters(emptyString)).toBe(false);
      expect(isPhone(emptyString)).toBe(false);
    });

    it('should handle whitespace consistently', () => {
      const whitespace = '   ';
      
      expect(isNonEmpty(whitespace)).toBe(false);
      expect(isLetters(whitespace)).toBe(false);
      expect(isPhone(whitespace)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long valid inputs', () => {
      const longName = 'María '.repeat(50).trim(); // Very long name
      const longPhone = '1'.repeat(15); // Maximum length phone
      
      expect(isLetters(longName)).toBe(true);
      expect(isPhone(longPhone)).toBe(true);
    });

    it('should handle unicode characters appropriately', () => {
      expect(isLetters('José')).toBe(true);
      expect(isLetters('Müller')).toBe(true);
      expect(isLetters('François')).toBe(false); // Contains ç which might not be in regex
    });

    it('should be case insensitive for letters', () => {
      expect(isLetters('hello')).toBe(true);
      expect(isLetters('HELLO')).toBe(true);
      expect(isLetters('HeLLo')).toBe(true);
    });
  });
});