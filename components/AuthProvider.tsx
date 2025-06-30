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
  login as apiLogin,
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
const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const router = useRouter();

  const fetchUserData = useCallback(
    async (token: string) => {
      try {
        const { data } = await getCurrentUser({
          baseUrl: `${baseUrl}`,
          headers: { Authorization: `Bearer ${token}` },
          throwOnError: true,
        });
        setUser(data);
        return data;
      } catch (error) {
        toast({
          title: "Kirjaudu uudelleen",
          description: "Kirjaudu uudelleen",
          variant: "destructive",
        });
        router.replace("/login");
      }
    },
    [router]
  );

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    console.log("accessToken", accessToken);
    if (accessToken) {
      fetchUserData(accessToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await apiLogin({
        baseUrl: `${baseUrl}`,
        body: { email, password },
        throwOnError: true,
      });

      const tokensData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        username: data.username,
      };

      Cookies.set("accessToken", tokensData.accessToken, {
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      Cookies.set("refreshToken", tokensData.refreshToken, {
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      Cookies.set("username", tokensData.username, {
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      setTokens(tokensData);
      const fetchedUser = await fetchUserData(tokensData.accessToken);

      const userRole = fetchedUser?.role;
      console.log("userRole", userRole);
      if (userRole === "admin") {
        router.replace("/admin/dashboard");
      } else if (userRole === "contractor") {
        router.replace("/contractor/dashboard");
      } else {
        router.replace("/consumer/dashboard");
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
            categoryId: contractor.categoryId,
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

  const logout = () => {
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
