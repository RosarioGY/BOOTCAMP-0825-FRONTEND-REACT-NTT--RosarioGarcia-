// AuthContext.ts - Authentication context definition
import { createContext } from 'react';
import type { User, AuthCredentials } from '../types/auth.types';

export type AuthContextValue = {
  user: User | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);