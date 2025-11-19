import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import KaKaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import { comparePassword } from "@/shared/lib/auth-util";
import { JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt";
import { jwtVerify, SignJWT } from "jose";

const JWT_ALGORITHM = "HS256" as const;

// NextAuth field info => https://authjs.dev/reference/core#authconfig
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // ? development에서는 http통신을 하고 deploy에서는 secure를 사용
  useSecureCookies: process.env.NODE_ENV === "production",
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "email",
          placeholder: "이메일 입력...",
        },
        password: {
          type: "password",
          label: "password",
          placeholder: "비밀번호 입력...",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;
        // 모든 form value가 존재하는지
        if (!credentials || !email || !password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        // db에 user가 존재하는지 확인
        const user = await prisma.user.findUnique({
          where: {
            email: email as string,
          },
        });

        if (!user) {
          throw new Error("사용자 정보를 찾을 수 없습니다.");
        }

        if (!user?.hashedPassword) {
          throw new Error(
            "비밀번호가 존재하지 않는 사용자입니다. Social Login을 시도해보세요."
          );
        }

        // 비밀번호 일치여부 확인
        const doPasswordMatch = comparePassword(
          password as string,
          user.hashedPassword
        );

        if (!doPasswordMatch) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        return user;
      },
    }),
    KaKaoProvider({
      clientId: process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.AUTH_KAKAO_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    encode: async ({ token, secret }: JWTEncodeParams): Promise<string> => {
      const secretKey = new TextEncoder().encode(
        Array.isArray(secret) ? secret[0] : secret
      );

      const joseResult = await new SignJWT(token)
        .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .setJti(crypto.randomUUID()) // nodejs의 crypto module이 아닌 web crypto api라 edge function과 호환된다.
        .sign(secretKey);

      return joseResult;
    },
    decode: async ({ token, secret }: JWTDecodeParams) => {
      if (!token) {
        throw new Error("❌no token -> token: undefined");
      }

      const secretKey = new TextEncoder().encode(
        Array.isArray(secret) ? secret[0] : secret
      );

      try {
        const { payload } = await jwtVerify(token as string, secretKey, {
          algorithms: [JWT_ALGORITHM],
        });

        return payload;
      } catch (error) {
        const errorMessage = "❌ JWT decode error:".concat(
          error instanceof Error ? error.message : ""
        );
        throw new Error(errorMessage);
      }
    },
  },
  callbacks: {
    signIn: async (params) => {
      console.log("below is user Info after kakao oauth");
      console.log({ params });
      return true;
    },

    // * 해당 redirect는 모든 인증 관련(signin, singout, error 등)이 발생했을 때만 실행된다.
    redirect: async () => {
      return process.env.NODE_ENV === "production"
        ? `${process.env.PRODUCTION_HOST_URL}/`
        : `${process.env.DEVELOPMENT_HOST_URL}/`;
    },
  },
});
