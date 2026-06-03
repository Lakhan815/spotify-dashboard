import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      //add exclaimation points to the end of the env ids so typescript knows it exists
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "user-top-read user-read-recently-played user-read-email",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: { name: user.name || "", email: user.email || "" },
        create: { id: user.id, name: user.name || "", email: user.email || "" },
      });
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};
