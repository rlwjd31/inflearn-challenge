import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import { comparePassword } from "@/shared/lib/auth-util";
import * as jwt from "jsonwebtoken";
import { JWT, JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt";
import { jwtVerify, SignJWT } from "jose";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";

const JWT_ALGORITHM = "HS256" as const;

// NextAuth field info => https://authjs.dev/reference/core#authconfig
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    encode: async ({ token, secret }: JWTEncodeParams) => {
      return jwt.sign(token as jwt.JwtPayload, secret as string, {
        algorithm: "HS256",
      });
    },
    decode: async ({ token, secret }: JWTDecodeParams) => {
      return jwt.verify(token as string, secret as string, {
        algorithms: ["HS256"],
      }) as JWT;
    },
  },
});
