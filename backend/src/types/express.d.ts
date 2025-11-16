type JWTPayload = {
  name: string | null;
  email: string | null;
  sub: string;
  iat: number;
  exp: number;
  jti: string;
};

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends JWTPayload {}
  }
}

export {};
