"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
<<<<<<< HEAD
import {
  register as apiRegister,
  contractorJoinRequest,
  getCurrentUser,
  GetCurrentUserResponse as User,
  RegisterData,
  ContractorJoinRequestData,
} from "@/app/lib/openapi-client";
import { client as apiClient } from "@/app/lib/apiClient";
import { toast } from "@/hooks/use-toast";
import dotenv from "dotenv";

type Register = NonNullable<RegisterData["body"]>;
type ContractorRegisterData = NonNullable<ContractorJoinRequestData["body"]>;
dotenv.config();
=======
import {
  getCurrentUser,
  GetCurrentUserResponse as User,
} from "@/app/lib/openapi-client";
import { toast } from "@/hooks/use-toast";

>>>>>>> dc99e57 (refactor: remove any and ts-ignore)

type Tokens = {
  accessToken: string;
  refreshToken: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  tokens: Tokens | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const router = useRouter();

  const fetchUserData = useCallback(
    async (token: string) => {
      try {
        // fetching user data

        const { data, error } = await getCurrentUser({
          baseUrl: baseUrl,
          headers: { Authorization: `Bearer ${token}` },
          throwOnError: false,
        });

        if (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Kirjaudu uudelleen",
            description: "Kirjaudu uudelleen",
            variant: "destructive",
          });
          router.replace("/login");
          return null;
        }

        // user data fetched
        setUser(data);
        return data;
      } catch (error) {
        console.error("Unexpected error in fetchUserData:", error);
        toast({
          title: "Kirjaudu uudelleen",
          description: "Kirjaudu uudelleen",
          variant: "destructive",
        });
        router.replace("/login");
        return null;
      }
    },
    [router]
  );

  useEffect(() => {
    const loadSession = async () => {
      const res = await fetch("/api/auth/session");
      if (!res.ok) return;
      const session = await res.json();
      if (session.accessToken) {
        setTokens(session);
        fetchUserData(session.accessToken);
      }
    };
    loadSession();
  }, [fetchUserData]);

  const login = async (email: string, password: string) => {
    try {
      // attempt login

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      // login successful

      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        username: data.username,
      });

      // fetch user data after login
      const fetchedUser = await fetchUserData(data.accessToken);

      if (!fetchedUser) {
        console.error("Failed to fetch user data after login");
        return;
      }

      const userRole = fetchedUser.role;
      // user role resolved

      // Add a small delay to ensure cookies are set
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (userRole === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (userRole === "contractor") {
        window.location.href = "/contractor/dashboard";
      } else {
        window.location.href = "/consumer/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login error");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("username");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
