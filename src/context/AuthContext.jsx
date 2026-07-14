import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Sagheer',
    role: 'Product Engineer',
    email: 'sagheer@taskflow.pro',
    department: 'Product Development',
    tasksCompleted: 12
  });

  function updateProfile(updatedData) {
    setUser((prev) => ({ ...prev, ...updatedData }));
  }

  function incrementTasksCompleted() {
    setUser((prev) => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }));
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
