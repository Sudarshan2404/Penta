import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export interface AuthUser {
  _id: string;
  userId?: string;
  name?: string;
  username: string;
  email: string;
  avtar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  backendOffline: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const authUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api/auth";
const healthUrl = `${authUrl.replace(/\/auth$/, "")}/ping`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const healthResponse = await fetch(healthUrl);
      if (!healthResponse.ok) throw new Error("Backend health check failed");
    } catch {
      setUser(null);
      setBackendOffline(true);
      setLoading(false);
      return;
    }

    setBackendOffline(false);
    try {
      const response = await fetch(`${authUrl}/me`, { credentials: "include" });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const result = (await response.json()) as { data: AuthUser };
      setUser(result.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refreshUser(); }, []);

  return <AuthContext.Provider value={{ user, loading, backendOffline, refreshUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
