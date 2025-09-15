// useAuth.ts - Auth hook
import { useContext } from 'react';
import { AuthContext } from '@/modules/auth/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};