// auth.service.test.ts - Unit tests for auth service
import {
  loginService,
  getProfileService,
  refreshTokenService,
  checkTokenExpiration,
  logoutService,
  registerService,
} from '@/modules/auth/services/auth.service';
import {
  loginUser,
  getUserProfile,
  refreshAccessToken,
  isTokenExpired,
  logoutUser,
  registerUser,
} from '@/api/Auth';
import { mapAuthResponse, mapUserProfileResponse } from '@/modules/auth/mappers/auth.mappers';
import type { AuthCredentials, User, RegisterCredentials, RawRegisterResponse } from '@/modules/auth/types/auth.types';

// Mock dependencies
jest.mock('@/api/Auth');
jest.mock('@/modules/auth/mappers/auth.mappers');

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
const mockGetUserProfile = getUserProfile as jest.MockedFunction<typeof getUserProfile>;
const mockRefreshAccessToken = refreshAccessToken as jest.MockedFunction<typeof refreshAccessToken>;
const mockIsTokenExpired = isTokenExpired as jest.MockedFunction<typeof isTokenExpired>;
const mockLogoutUser = logoutUser as jest.MockedFunction<typeof logoutUser>;
const mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;
const mockMapAuthResponse = mapAuthResponse as jest.MockedFunction<typeof mapAuthResponse>;
const mockMapUserProfileResponse = mapUserProfileResponse as jest.MockedFunction<typeof mapUserProfileResponse>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  describe('loginService', () => {
    const mockCredentials: AuthCredentials = {
      username: 'testuser',
      password: 'password123',
    };

    const mockApiResponse = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      gender: 'male',
      image: 'https://example.com/image.jpg',
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-123',
    };

    const mockMappedUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      accessToken: 'access-token-123',
    };

    it('should login user successfully and store tokens', async () => {
      mockLoginUser.mockResolvedValue(mockApiResponse);
      mockMapAuthResponse.mockReturnValue(mockMappedUser);

      const result = await loginService(mockCredentials);

      expect(mockLoginUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        expiresInMins: 60,
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-token-123');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token-123');
      expect(mockMapAuthResponse).toHaveBeenCalledWith(mockApiResponse);
      expect(result).toBe(mockMappedUser);
    });

    it('should handle login API errors', async () => {
      const apiError = new Error('Invalid credentials');
      mockLoginUser.mockRejectedValue(apiError);

      await expect(loginService(mockCredentials)).rejects.toThrow('Invalid credentials');
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(mockMapAuthResponse).not.toHaveBeenCalled();
    });

    it('should handle mapping errors', async () => {
      mockLoginUser.mockResolvedValue(mockApiResponse);
      const mappingError = new Error('Mapping failed');
      mockMapAuthResponse.mockImplementation(() => {
        throw mappingError;
      });

      await expect(loginService(mockCredentials)).rejects.toThrow('Mapping failed');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-token-123');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token-123');
    });

    it('should call API with correct parameters including expiresInMins', async () => {
      mockLoginUser.mockResolvedValue(mockApiResponse);
      mockMapAuthResponse.mockReturnValue(mockMappedUser);

      await loginService(mockCredentials);

      expect(mockLoginUser).toHaveBeenCalledWith({
        username: mockCredentials.username,
        password: mockCredentials.password,
        expiresInMins: 60,
      });
    });
  });

  describe('getProfileService', () => {
    const mockAccessToken = 'access-token-123';
    const mockProfileResponse = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      gender: 'male',
      image: 'https://example.com/image.jpg',
    };

    const mockMappedUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      accessToken: mockAccessToken,
    };

    it('should get user profile successfully', async () => {
      mockGetUserProfile.mockResolvedValue(mockProfileResponse);
      mockMapUserProfileResponse.mockReturnValue(mockMappedUser);

      const result = await getProfileService(mockAccessToken);

      expect(mockGetUserProfile).toHaveBeenCalledWith(mockAccessToken);
      expect(mockMapUserProfileResponse).toHaveBeenCalledWith(mockProfileResponse, mockAccessToken);
      expect(result).toBe(mockMappedUser);
    });

    it('should handle profile API errors', async () => {
      const apiError = new Error('Unauthorized');
      mockGetUserProfile.mockRejectedValue(apiError);

      await expect(getProfileService(mockAccessToken)).rejects.toThrow('Unauthorized');
      expect(mockMapUserProfileResponse).not.toHaveBeenCalled();
    });

    it('should handle profile mapping errors', async () => {
      mockGetUserProfile.mockResolvedValue(mockProfileResponse);
      const mappingError = new Error('Profile mapping failed');
      mockMapUserProfileResponse.mockImplementation(() => {
        throw mappingError;
      });

      await expect(getProfileService(mockAccessToken)).rejects.toThrow('Profile mapping failed');
    });
  });

  describe('refreshTokenService', () => {
    const mockRefreshToken = 'refresh-token-123';
    const mockRefreshResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue(mockRefreshToken);
    });

    it('should refresh token successfully', async () => {
      mockRefreshAccessToken.mockResolvedValue(mockRefreshResponse);

      const result = await refreshTokenService();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('refreshToken');
      expect(mockRefreshAccessToken).toHaveBeenCalledWith({ refreshToken: mockRefreshToken });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
      expect(result).toBe('new-access-token');
    });

    it('should throw error when no refresh token available', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      await expect(refreshTokenService()).rejects.toThrow('No refresh token available');
      expect(mockRefreshAccessToken).not.toHaveBeenCalled();
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle refresh API errors', async () => {
      const apiError = new Error('Refresh token expired');
      mockRefreshAccessToken.mockRejectedValue(apiError);

      await expect(refreshTokenService()).rejects.toThrow('Refresh token expired');
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should update both tokens in localStorage on success', async () => {
      mockRefreshAccessToken.mockResolvedValue(mockRefreshResponse);

      await refreshTokenService();

      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
    });
  });

  describe('checkTokenExpiration', () => {
    const mockToken = 'test-token';

    it('should return true when no token is present', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = checkTokenExpiration();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('accessToken');
      expect(result).toBe(true);
      expect(mockIsTokenExpired).not.toHaveBeenCalled();
    });

    it('should return result from isTokenExpired when token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(mockToken);
      mockIsTokenExpired.mockReturnValue(false);

      const result = checkTokenExpiration();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('accessToken');
      expect(mockIsTokenExpired).toHaveBeenCalledWith(mockToken);
      expect(result).toBe(false);
    });

    it('should return true when token is expired', () => {
      mockLocalStorage.getItem.mockReturnValue(mockToken);
      mockIsTokenExpired.mockReturnValue(true);

      const result = checkTokenExpiration();

      expect(result).toBe(true);
    });

    it('should return false when token is not expired', () => {
      mockLocalStorage.getItem.mockReturnValue(mockToken);
      mockIsTokenExpired.mockReturnValue(false);

      const result = checkTokenExpiration();

      expect(result).toBe(false);
    });
  });

  describe('logoutService', () => {
    it('should call logoutUser', () => {
      logoutService();

      expect(mockLogoutUser).toHaveBeenCalledTimes(1);
      expect(mockLogoutUser).toHaveBeenCalledWith();
    });

    it('should handle logout errors gracefully', () => {
      mockLogoutUser.mockImplementation(() => {
        throw new Error('Logout failed');
      });

      expect(() => logoutService()).toThrow('Logout failed');
    });
  });

  describe('registerService', () => {
    const mockCredentials: RegisterCredentials = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      age: 25,
      gender: 'male',
    };

    const mockRegisterResponse: RawRegisterResponse = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      age: 25,
      gender: 'male',
      image: 'https://example.com/image.jpg',
    };

    it('should register user successfully', async () => {
      mockRegisterUser.mockResolvedValue(mockRegisterResponse);

      const result = await registerService(mockCredentials);

      expect(mockRegisterUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        age: 25,
        gender: 'male',
      });
      expect(result).toBe(mockRegisterResponse);
    });

    it('should handle registration API errors', async () => {
      const apiError = new Error('Username already exists');
      mockRegisterUser.mockRejectedValue(apiError);

      await expect(registerService(mockCredentials)).rejects.toThrow('Username already exists');
    });

    it('should pass all credentials to registerUser', async () => {
      mockRegisterUser.mockResolvedValue(mockRegisterResponse);

      await registerService(mockCredentials);

      expect(mockRegisterUser).toHaveBeenCalledWith({
        firstName: mockCredentials.firstName,
        lastName: mockCredentials.lastName,
        username: mockCredentials.username,
        email: mockCredentials.email,
        password: mockCredentials.password,
        age: mockCredentials.age,
        gender: mockCredentials.gender,
      });
    });

    it('should handle registration with minimal data', async () => {
      const minimalCredentials: RegisterCredentials = {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password: 'password123',
        age: 18,
        gender: '',
      };

      const minimalResponse: RawRegisterResponse = {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        age: 18,
        gender: '',
      };

      mockRegisterUser.mockResolvedValue(minimalResponse);

      const result = await registerService(minimalCredentials);

      expect(mockRegisterUser).toHaveBeenCalledWith(minimalCredentials);
      expect(result).toBe(minimalResponse);
    });
  });

  describe('Error Handling', () => {
    it('should propagate network errors from login', async () => {
      const networkError = new Error('Network error');
      mockLoginUser.mockRejectedValue(networkError);

      await expect(loginService({ username: 'test', password: 'test' })).rejects.toThrow('Network error');
    });

    it('should propagate API errors from refresh token', async () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      const apiError = new Error('Invalid refresh token');
      mockRefreshAccessToken.mockRejectedValue(apiError);

      await expect(refreshTokenService()).rejects.toThrow('Invalid refresh token');
    });

    it('should handle localStorage errors gracefully', async () => {
      // Store original implementation before overriding
      const originalSetItemImpl = mockLocalStorage.setItem.getMockImplementation();
      
      // Override to throw error
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('LocalStorage error');
      });
      
      const mockApiResponse = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        gender: 'male',
        image: 'image.jpg',
        accessToken: 'token',
        refreshToken: 'refresh',
      };

      mockLoginUser.mockResolvedValue(mockApiResponse);
      mockMapAuthResponse.mockReturnValue({} as User);

      await expect(loginService({ username: 'test', password: 'test' })).rejects.toThrow('LocalStorage error');
      
      // Restore to default mock behavior (not throwing)
      mockLocalStorage.setItem.mockImplementation(originalSetItemImpl || jest.fn());
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete login flow', async () => {
      const credentials = { username: 'testuser', password: 'password123' };
      const apiResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        gender: 'male',
        image: 'image.jpg',
        accessToken: 'access-123',
        refreshToken: 'refresh-123',
      };
      const mappedUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        accessToken: 'access-123',
      };

      mockLoginUser.mockResolvedValue(apiResponse);
      mockMapAuthResponse.mockReturnValue(mappedUser);

      const result = await loginService(credentials);

      // Verify complete flow
      expect(mockLoginUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        expiresInMins: 60,
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-123');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-123');
      expect(mockMapAuthResponse).toHaveBeenCalledWith(apiResponse);
      expect(result).toBe(mappedUser);
    });

    it('should handle complete token refresh flow', async () => {
      mockLocalStorage.getItem.mockReturnValue('refresh-token');
      const refreshResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };
      mockRefreshAccessToken.mockResolvedValue(refreshResponse);

      const result = await refreshTokenService();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('refreshToken');
      expect(mockRefreshAccessToken).toHaveBeenCalledWith({ refreshToken: 'refresh-token' });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
      expect(result).toBe('new-access-token');
    });
  });
});