import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);
const STORAGE_USER_KEY = 'SMARTSHOP_USER';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Shopper',
          role: 'shopper',
        };
        setCurrentUser(user);
        setUserProfile(profile);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Demo / Real Login
  const login = async (email, password) => {
    if (!isFirebaseConfigured) {
      const mockUser = {
        uid: 'user_' + Date.now(),
        email,
        displayName: email ? email.split('@')[0] : 'Shopper',
        role: 'shopper',
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setUserProfile(mockUser);
      return mockUser;
    }

    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  // Demo / Real Register
  const register = async ({ name, email, password }) => {
    if (!isFirebaseConfigured) {
      const mockUser = {
        uid: 'user_' + Date.now(),
        email,
        displayName: name || email.split('@')[0],
        role: 'shopper',
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setUserProfile(mockUser);
      return mockUser;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    return cred.user;
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem(STORAGE_USER_KEY);
    setCurrentUser(null);
    setUserProfile(null);
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
