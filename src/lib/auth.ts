//brain of the authentication system. exported as authOptions so other files can import it

import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { getRecentlyPlayed } from "./spotify";

// Helper: uses the refresh_token to get a new access_token from Spotify
// when the current one has expired. Lives outside authOptions since it's
// just a plain helper function, not a NextAuth callback.
async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "user-top-read user-read-recently-played user-read-email playlist-modify-public playlist-modify-private",
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
      // Initial sign in — account is only populated on this first call
      if (account) {
        try {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at; // seconds since epoch

          const recentlyPlayed = await getRecentlyPlayed(account.access_token!);
          for (var i = 0; i < recentlyPlayed.items.length; i++) {
            const track = recentlyPlayed.items[i].track;
            await prisma.artist.upsert({
              where: { id: track.artists[0].id },
              update: { name: track.artists[0].name },
              create: { id: track.artists[0].id, name: track.artists[0].name },
            });
            await prisma.track.upsert({
              where: { id: track.id },
              update: {
                name: track.name,
                length: track.duration_ms,
                album: track.album.name,
              },
              create: {
                id: track.id,
                name: track.name,
                length: track.duration_ms,
                album: track.album.name,
                artistId: track.artists[0].id,
              },
            });
          }
        } catch (e) {
          console.error("jwt callback error:", e);
        }

        return token;
      }

      // Subsequent requests: token still valid, nothing to do
      if (
        typeof token.expiresAt === "number" &&
        Date.now() < token.expiresAt * 1000
      ) {
        return token;
      }

      // Token missing an expiry, or expired — refresh it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },
};
