import { CreateClientConfig } from "@/generated/openapi-client/client.gen";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next/server";

const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_API_URL
    : process.env.DEVELOPMENT_API_URL;

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: API_URL,
  async auth() {
    return getCookie(AUTH_COOKIE_NAME, { cookies });
  },
});
