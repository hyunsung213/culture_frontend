"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ApiUser } from "../types/api";
import { getMe } from "../lib/api";

interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: ApiUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await getMe();
          setUser(res.user);
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, user: ApiUser) => {
    localStorage.setItem("accessToken", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
