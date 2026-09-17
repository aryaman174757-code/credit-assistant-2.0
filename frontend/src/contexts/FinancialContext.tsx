import React, { createContext, useContext, useState, useEffect } from "react";
import { FinancialProfile } from "../types";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

interface FinancialContextType {
  profile: FinancialProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<FinancialProfile>) => Promise<FinancialProfile>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshProfile = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await api.get("/profile/");
      setProfile(res.data);
    } catch (err) {
      console.error("Error loading financial profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [isAuthenticated]);

  const updateProfile = async (data: Partial<FinancialProfile>): Promise<FinancialProfile> => {
    const res = await api.post("/profile/", data);
    setProfile(res.data);
    return res.data;
  };

  return (
    <FinancialContext.Provider value={{ profile, isLoading, refreshProfile, updateProfile }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) throw new Error("useFinancial must be used within a FinancialProvider");
  return context;
};
