"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type User = {
  id: string;
  sub: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  expoPushToken: string;
  stripeCustomerId: string;
  addressStreet: string;
  addressDetail: string;
  addressZip: string;
  addressCountry: string;
  badgeCountOffers: number;
  badgeCountMessages: number;
  role: string;
  pushNotificationPermission: boolean;
  smsPersmission: boolean;
  emailPermission: boolean;
  created_at: string;
  updated_at: string;
} | null;

type Tokens = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  username: string;
};

type AuthContextType = {
  user: User;
  tokens: Tokens | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const router = useRouter();

  useEffect(() => {
    const idToken = Cookies.get("idToken");
    if (idToken) {
      fetchUserData(idToken);
    }
  }, []);

  const fetchUserData = async (idToken: string) => {
    try {
      const userResponse = await fetch(`${API_URL}/api/v1/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      const userData: User = await userResponse.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error("Login failed:", response.statusText);
        throw new Error("Login failed");
      }

      const data: Tokens = await response.json();

      Cookies.set("accessToken", data.accessToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", data.refreshToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("idToken", data.idToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("username", data.username, {
        secure: true,
        sameSite: "strict",
      });
      setTokens(data);
      await fetchUserData(data.idToken);

      const userRole = user?.role;
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

  const logout = () => {
    setUser(null);
    // Remove cookies instead of localStorage items
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("idToken");
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
