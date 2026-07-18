import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Extends NextAuth's built-in types so TypeScript knows about the extra
// fields we're attaching in the jwt/session callbacks (auth.ts).

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user?: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
