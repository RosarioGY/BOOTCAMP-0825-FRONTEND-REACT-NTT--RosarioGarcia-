// auth.mappers.test.ts - Unit tests for auth mappers
import '@testing-library/jest-dom';
import { mapAuthResponse, mapUserProfileResponse } from '@/modules/auth/mappers/auth.mappers';
import type { RawAuthResponse, RawUserProfile } from '@/modules/auth/types/auth.types';

describe('Auth Mappers', () => {
  describe('mapAuthResponse', () => {
    const mockRawAuthResponse: RawAuthResponse = {
      id: 1,
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: 'male',
      image: 'https://example.com/avatar.jpg',
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
    };

    it('should map raw auth response to User object correctly', () => {
      const result = mapAuthResponse(mockRawAuthResponse);

      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gender: 'male',
        image: 'https://example.com/avatar.jpg',
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      });
    });

    it('should include all required properties in mapped object', () => {
      const result = mapAuthResponse(mockRawAuthResponse);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('firstName');
      expect(result).toHaveProperty('lastName');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('gender');
      expect(result).toHaveProperty('image');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should preserve exact values from raw response', () => {
      const result = mapAuthResponse(mockRawAuthResponse);

      expect(result.id).toBe(mockRawAuthResponse.id);
      expect(result.username).toBe(mockRawAuthResponse.username);
      expect(result.firstName).toBe(mockRawAuthResponse.firstName);
      expect(result.lastName).toBe(mockRawAuthResponse.lastName);
      expect(result.email).toBe(mockRawAuthResponse.email);
      expect(result.gender).toBe(mockRawAuthResponse.gender);
      expect(result.image).toBe(mockRawAuthResponse.image);
      expect(result.accessToken).toBe(mockRawAuthResponse.accessToken);
      expect(result.refreshToken).toBe(mockRawAuthResponse.refreshToken);
    });

    it('should handle empty string values', () => {
      const emptyStringResponse: RawAuthResponse = {
        id: 0,
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        image: '',
        accessToken: '',
        refreshToken: '',
      };

      const result = mapAuthResponse(emptyStringResponse);

      expect(result.username).toBe('');
      expect(result.firstName).toBe('');
      expect(result.lastName).toBe('');
      expect(result.email).toBe('');
      expect(result.gender).toBe('');
      expect(result.image).toBe('');
      expect(result.accessToken).toBe('');
      expect(result.refreshToken).toBe('');
    });

    it('should handle different gender values', () => {
      const femaleUser = { ...mockRawAuthResponse, gender: 'female' };
      const result = mapAuthResponse(femaleUser);
      expect(result.gender).toBe('female');
    });

    it('should handle numeric id values', () => {
      const userWithDifferentId = { ...mockRawAuthResponse, id: 999 };
      const result = mapAuthResponse(userWithDifferentId);
      expect(result.id).toBe(999);
    });

    it('should not mutate the original raw response', () => {
      const originalResponse = { ...mockRawAuthResponse };
      mapAuthResponse(mockRawAuthResponse);
      
      expect(mockRawAuthResponse).toEqual(originalResponse);
    });

    it('should create a new object instance', () => {
      const result = mapAuthResponse(mockRawAuthResponse);
      expect(result).not.toBe(mockRawAuthResponse);
    });
  });

  describe('mapUserProfileResponse', () => {
    const mockRawUserProfile: RawUserProfile = {
      id: 2,
      username: 'profileuser',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      gender: 'female',
      image: 'https://example.com/jane-avatar.jpg',
    };

    const mockAccessToken = 'new-access-token-789';

    it('should map raw user profile to User object with provided access token', () => {
      const result = mapUserProfileResponse(mockRawUserProfile, mockAccessToken);

      expect(result).toEqual({
        id: 2,
        username: 'profileuser',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        gender: 'female',
        image: 'https://example.com/jane-avatar.jpg',
        accessToken: 'new-access-token-789',
      });
    });

    it('should include all required properties except refreshToken', () => {
      const result = mapUserProfileResponse(mockRawUserProfile, mockAccessToken);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('firstName');
      expect(result).toHaveProperty('lastName');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('gender');
      expect(result).toHaveProperty('image');
      expect(result).toHaveProperty('accessToken');
      expect(result).not.toHaveProperty('refreshToken');
    });

    it('should use provided access token instead of profile token', () => {
      const result = mapUserProfileResponse(mockRawUserProfile, mockAccessToken);
      expect(result.accessToken).toBe(mockAccessToken);
    });

    it('should preserve profile data exactly', () => {
      const result = mapUserProfileResponse(mockRawUserProfile, mockAccessToken);

      expect(result.id).toBe(mockRawUserProfile.id);
      expect(result.username).toBe(mockRawUserProfile.username);
      expect(result.firstName).toBe(mockRawUserProfile.firstName);
      expect(result.lastName).toBe(mockRawUserProfile.lastName);
      expect(result.email).toBe(mockRawUserProfile.email);
      expect(result.gender).toBe(mockRawUserProfile.gender);
      expect(result.image).toBe(mockRawUserProfile.image);
    });

    it('should handle empty access token', () => {
      const result = mapUserProfileResponse(mockRawUserProfile, '');
      expect(result.accessToken).toBe('');
    });

    it('should handle empty string values in profile', () => {
      const emptyProfile: RawUserProfile = {
        id: 0,
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        image: '',
      };

      const result = mapUserProfileResponse(emptyProfile, mockAccessToken);

      expect(result.username).toBe('');
      expect(result.firstName).toBe('');
      expect(result.lastName).toBe('');
      expect(result.email).toBe('');
      expect(result.gender).toBe('');
      expect(result.image).toBe('');
      expect(result.accessToken).toBe(mockAccessToken);
    });

    it('should handle different access token formats', () => {
      const bearerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const result = mapUserProfileResponse(mockRawUserProfile, bearerToken);
      expect(result.accessToken).toBe(bearerToken);
    });

    it('should not mutate the original profile or token', () => {
      const originalProfile = { ...mockRawUserProfile };
      const originalToken = mockAccessToken;
      
      mapUserProfileResponse(mockRawUserProfile, mockAccessToken);
      
      expect(mockRawUserProfile).toEqual(originalProfile);
      expect(mockAccessToken).toBe(originalToken);
    });

    it('should create a new object instance', () => {
      const result = mapUserProfileResponse(mockRawUserProfile, mockAccessToken);
      expect(result).not.toBe(mockRawUserProfile);
    });

    it('should handle special characters in profile data', () => {
      const specialProfile: RawUserProfile = {
        id: 3,
        username: 'user@123',
        firstName: 'José',
        lastName: "O'Connor",
        email: 'josé.oconnor@example.com',
        gender: 'non-binary',
        image: 'https://example.com/images/special-chars-avatar.jpg',
      };

      const result = mapUserProfileResponse(specialProfile, mockAccessToken);

      expect(result.username).toBe('user@123');
      expect(result.firstName).toBe('José');
      expect(result.lastName).toBe("O'Connor");
      expect(result.email).toBe('josé.oconnor@example.com');
      expect(result.gender).toBe('non-binary');
    });
  });

  describe('Mapper Integration', () => {
    it('should produce consistent User structure from both mappers', () => {
      const authResponse: RawAuthResponse = {
        id: 1,
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gender: 'male',
        image: 'https://example.com/avatar.jpg',
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      };

      const profileResponse: RawUserProfile = {
        id: 1,
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gender: 'male',
        image: 'https://example.com/avatar.jpg',
      };

      const authResult = mapAuthResponse(authResponse);
      const profileResult = mapUserProfileResponse(profileResponse, 'access-token-123');

      // Both should have same basic structure
      expect(authResult.id).toBe(profileResult.id);
      expect(authResult.username).toBe(profileResult.username);
      expect(authResult.firstName).toBe(profileResult.firstName);
      expect(authResult.lastName).toBe(profileResult.lastName);
      expect(authResult.email).toBe(profileResult.email);
      expect(authResult.gender).toBe(profileResult.gender);
      expect(authResult.image).toBe(profileResult.image);
      expect(authResult.accessToken).toBe(profileResult.accessToken);
      
      // Only auth response should have refresh token
      expect(authResult).toHaveProperty('refreshToken');
      expect(profileResult).not.toHaveProperty('refreshToken');
    });
  });
});