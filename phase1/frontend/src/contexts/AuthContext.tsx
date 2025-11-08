import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Role = "STUDENT" | "STAFF" | "ADMIN";

type AuthState = { token: string; role: Role; name?: string } | null;

type AuthContextValue = {
  auth: AuthState;
  login: (token: string, role: Role, name?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem("t");
    const role = localStorage.getItem("r") as Role | null;
    const name = localStorage.getItem("n") || undefined;
    return token && role ? { token, role, name } : null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      login: (token, role, name) => {
        localStorage.setItem("t", token);
        localStorage.setItem("r", role);
        if (name) localStorage.setItem("n", name);
        setAuth({ token, role, name });
      },
      logout: () => {
        localStorage.clear();
        setAuth(null);
      },
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
