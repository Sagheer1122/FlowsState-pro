import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('flowstate_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore parsing error
      }
    }
    return {
      name: '', // Empty name triggers onboarding modal!
      role: 'Productivity Builder',
      email: 'member@flowstate.pro',
      department: 'General Operations',
      tasksCompleted: 0
    };
  });

  function updateProfile(updatedData) {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('flowstate_user', JSON.stringify(merged));
      return merged;
    });
  }

  function incrementTasksCompleted() {
    setUser((prev) => {
      const merged = { ...prev, tasksCompleted: prev.tasksCompleted + 1 };
      localStorage.setItem('flowstate_user', JSON.stringify(merged));
      return merged;
    });
  }

  return (
    <AuthContext.Provider value={{ user, updateProfile, incrementTasksCompleted }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
