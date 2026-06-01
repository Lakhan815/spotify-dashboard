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
  },
};
