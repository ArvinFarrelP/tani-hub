import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const USER_KEY  = 'th_user';
const TOKEN_KEY = 'th_token';

/**
 * Normalise whatever comes out of localStorage or is passed to login().
 *
 * Historically a bug in authService caused the stored object to be
 * { user: { id, name, role, ... }, token } instead of { id, name, role, ... }.
 * This function unwraps that if it happens.
 */
function normaliseUser(raw) {
  if (!raw) return null;
  // If the object has a nested "user" key with a role, unwrap it
  if (raw.user && raw.user.role) return raw.user;
  // If it has a role directly, it's already correct
  if (raw.role) return raw;
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const normalised = normaliseUser(parsed);
      if (!normalised) {
        // Stored object is unrecoverable — clear it
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      return normalised;
    } catch {
      return null;
    }
  });

  /**
   * login(userData, token)
   * userData must be the flat user object: { id, name, role, ... }
   * token is the JWT string.
   */
  const login = useCallback((userData, token) => {
    const normalised = normaliseUser(userData);
    if (!normalised) {
      console.error('[AuthContext] login() received an invalid user object:', userData);
      return;
    }
    setUser(normalised);
    localStorage.setItem(USER_KEY, JSON.stringify(normalised));
    if (token) localStorage.setItem(TOKEN_KEY, token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
