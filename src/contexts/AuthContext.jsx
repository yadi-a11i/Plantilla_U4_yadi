import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChange, getUserRole } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("visitor");

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setUserRole(getUserRole(user));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userRole,
    loading,
    isAuthenticated: !!user,
    isAdmin: userRole === "admin",
    isTeam: userRole === "team" || userRole === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
