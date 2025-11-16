"use client";

import { getCookie } from "cookies-next/client";

import * as api from "@/lib/api";

const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

export function useApi() {
  // client component에서 cookie를 가져옴 -> cookies-next/client
  const token = getCookie(AUTH_COOKIE_NAME) as string;

  return {
    getUserTest: async () => api.getUserTest(token),
  };
}
