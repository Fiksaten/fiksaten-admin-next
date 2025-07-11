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
import {
  register as apiRegister,
  contractorJoinRequest,
  getCurrentUser,
} from "@/app/lib/openapi-client";
import { client as apiClient } from "@/app/lib/apiClient";
import { toast } from "@/hooks/use-toast";
import { User } from "@/app/lib/types/userTypes";
import dotenv from "dotenv";
import { Register, ContractorRegisterData } from "@/app/lib/types/authTypes";
dotenv.config();

type Tokens = {
  accessToken: string;
  refreshToken: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  tokens: Tokens | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    registerData: Register,
    contractor: ContractorRegisterData | undefined
  ) => Promise<void>;
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

  const register = async (
    registerData: Register,
    contractor?: ContractorRegisterData | undefined
  ) => {
    try {
      const { email, firstname, lastname, password, phoneNumber } =
        registerData;
      const { data } = await apiRegister({
        client: apiClient,
        body: {
          email,
          firstname,
          lastname,
          password,
          phoneNumber,
        },
        throwOnError: true,
      });

      Cookies.set("accessToken", data.accessToken ?? "", {
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      Cookies.set("refreshToken", data.refreshToken ?? "", {
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      Cookies.set("username", data.username ?? "", {
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      setTokens({
        accessToken: data.accessToken ?? "",
        refreshToken: data.refreshToken ?? "",
        username: data.username ?? "",
      });

      if (contractor) {
        await contractorJoinRequest({
          client: apiClient,
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
          body: {
            name: contractor.name,
            description: contractor.description,
            website: contractor.website,
            email: contractor.email,
            phone: contractor.phone,
            addressStreet: contractor.addressStreet,
            addressDetail: contractor.addressDetail,
            addressZip: contractor.addressZip,
            addressCountry: contractor.addressCountry,
            imageUrl: contractor.imageUrl,
            businessId: contractor.businessId,
            businessType: contractor.businessType,
            iban: contractor.iban,
            bic: contractor.bic,
          },
        });
      }

      if (data.accessToken) {
        await fetchUserData(data.accessToken);
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
    <AuthContext.Provider value={{ user, tokens, login, logout, register }}>
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
