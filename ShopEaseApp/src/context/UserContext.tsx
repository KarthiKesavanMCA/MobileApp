import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/sampleData';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [token, setToken] = useState<string | null>(null);

  // Auto load token & user profile from AsyncStorage on app start (EXP 6 & 8 requirement)
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userProfile');
        if (storedToken) {
          setToken(storedToken);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user session from AsyncStorage:', error);
      }
    };
    loadSession();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      // Keep non-sensitive data, but clear token
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(newUser));
    } catch (error) {
      console.error('Failed to persist user profile:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        updateProfile,
        isLoggedIn: !!token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
