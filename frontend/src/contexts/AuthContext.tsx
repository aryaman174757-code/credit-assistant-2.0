import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { api, DEFAULT_DEMO_USER } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loginAsDemo: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (storedToken) {
        try {
          const res = await api.get("/auth/me");
          if (res.data) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        } catch {
          // If network / offline fallback, keep user signed in if cached user exists
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setToken(null);
              setUser(null);
            }
          } else {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const loginAsDemo = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: "demo@creditassistant.ai",
        password: "password123",
      });
      if (res?.data?.access_token && res?.data?.user) {
        login(res.data.access_token, res.data.user);
        return;
      }
    } catch (err) {
      console.warn("Demo API login fallback triggered:", err);
    }
    // Instant fallback guarantee for offline/static deployment
    login("demo-jwt-token-access-2026", DEFAULT_DEMO_USER);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        loginAsDemo,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
