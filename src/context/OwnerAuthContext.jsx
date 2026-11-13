import React, { createContext, useContext, useState } from 'react';
import {
  OWNER_SESSION_KEY,
  REGISTERED_OWNERS_KEY,
  DEMO_OWNER,
  getRegisteredOwners,
  saveRegisteredOwner,
  validateOwnerLogin,
} from '../services/ownerAuthService';

export {
  OWNER_SESSION_KEY,
  REGISTERED_OWNERS_KEY,
  DEMO_OWNER,
  getRegisteredOwners,
  saveRegisteredOwner,
  validateOwnerLogin,
};

const OwnerAuthContext = createContext(null);

export function OwnerAuthProvider({ children }) {
  const [owner, setOwner] = useState(() => {
    try {
      const saved = localStorage.getItem(OWNER_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const registerOwner = async (data) => {
    const session = saveRegisteredOwner(data);
    setOwner(session);
    return session;
  };

  const login = async (email, password) => {
    const session = validateOwnerLogin(email, password);
    setOwner(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem(OWNER_SESSION_KEY);
    setOwner(null);
  };

  return (
    <OwnerAuthContext.Provider
      value={{
        owner,
        login,
        registerOwner,
        logout,
        isOwner: !!owner,
      }}
    >
      {children}
    </OwnerAuthContext.Provider>
  );
}

export function useOwnerAuth() {
  const context = useContext(OwnerAuthContext);
  if (!context) {
    throw new Error('useOwnerAuth must be used within an OwnerAuthProvider');
  }
  return context;
}
