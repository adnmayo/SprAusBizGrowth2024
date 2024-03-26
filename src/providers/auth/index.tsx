"use client";

import { logoutAction } from "@/actions/auth/logout";
import { getUrl } from "@/lib/utils/getUrl";
import { User } from "@/payload-types";
import { checkRole } from "@/payload/collections/Users/checkRole";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { rest } from "./rest";
import { AuthContext, Login, Logout, ResetPassword } from "./types";

// Creates auth context with default value as {}
const Context = createContext({} as AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    // <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
    <_AuthProvider>{children}</_AuthProvider>
    // </GoogleOAuthProvider>
  );
};

// AuthProvider component
export const _AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>();

  // useGoogleOneTapLogin({
  //   onSuccess: ({ credential }) => googleLoginSuccess({ credential }),
  //   disabled: user !== null,
  // });

  // const googleLoginSuccess = async ({
  //   access_token,
  //   credential,
  // }: {
  //   access_token?: string;
  //   credential?: string;
  // }) => {
  //   const res = await googleLoginAction({ access_token, credential });

  //   if (!res.success) return;

  //   setUser(res.user);
  //   toast.success("You have logged in successfully.");
  // };

  // const googleLogin: GoogleLogin = useGoogleLogin({
  //   onSuccess: ({ access_token }) => googleLoginSuccess({ access_token }),
  // });

  const isAdmin = useMemo(
    () => (user ? checkRole(["admin"], user) : false),
    [user]
  );

  const login: Login = async (args) => {
    const user = await rest(`${getUrl()}/api/users/login`, args);
    setUser(user);
  };

  const logout: Logout = async () => {
    logoutAction();
    setUser(null);
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  const resetPassword: ResetPassword = async (args) => {
    const user = await rest(`${getUrl()}/api/users/reset-password`, args);
    setUser(user);
  };

  // On mount, get user and set
  useEffect(() => {
    const fetchMe = async () => {
      const user = await rest(
        `${getUrl()}/api/users/me`,
        {},
        {
          method: "GET",
        }
      );
      setUser(user);
    };

    fetchMe();
  }, [pathname]);

  // Return context provider with user and auth functions
  return (
    <Context.Provider
      value={{
        user,
        isAdmin,
        setUser,
        login,
        // googleLogin,
        logout,
        resetPassword,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// Function to receive user and auth functions
export const useAuth = () => useContext(Context);
