"use server";

import { cache } from "react";

const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_API_URL
    : process.env.DEVELOPMENT_API_URL;

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    // ? 15부터 fetch에 의해 기본적인 caching은 지원하지 않음
    // ? reference => https://nextjs.org/docs/15/app/guides/upgrading/version-15#fetch-requests
    // ? 일단은 혹시 모르니 no-store로 caching을 하지 않고 react-query에서 caching을 진행함
    cache: "no-store",
  };

  // body에 객체와 같은 형태로 올때 -> json
  // 직렬화시 에러가 발생할 수 있음
  try {
    if (options.body && typeof options.body !== "string") {
      config.body = JSON.stringify(options.body);
    }
  } catch (error) {
    const errorMessage = "❌ error occurred while serializing body ->".concat(
      error instanceof Error ? error.message : ""
    );
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`❌ API 요청 실패, status code: ${response.status}`);
  }

  // * 값이 비어있거나 json이 아닐경우
  // * HTTP 204 No Content는 성공했지만 응답 본문이 없는 경우
  // * - DELETE 요청 성공 시
  // * - PUT/PATCH 요청으로 업데이트 성공 시 (업데이트된 리소스를 반환하지 않을 때)
  // * - OPTIONS 요청 (CORS preflight)
  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as Promise<T>;
  }
}
