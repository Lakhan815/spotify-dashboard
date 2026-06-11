//brain of the authentication system. exported as authOptions so other files can import it

import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { AuthOptions } from "next-auth";
import { getRecentlyPlayed } from "./spotify";
import RecentlyPlayed from "@/components/RecentlyPlayed";

export const authOptions: AuthOptions = {
  //this is how it knows to use spotify as a login method
  //clientid and clientsecret are used to verify urself to spotify
  //user-top-read gives perms to read their top tracks
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
    //runs right after you log in, it checks in the db to see if you are in, if you arent, it adds you, if you are, it
    //updates ur info if need be
    async signIn({ user }) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: { name: user.name || "", email: user.email || "" },
        create: { id: user.id, name: user.name || "", email: user.email || "" },
      });
      return true;
    },
    //JWT(Json Web Token), Runs when it's created. It is a small encrypted packet that stores session data
    //You grab the access token from account and save it there
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        const recentlyPlayed = await getRecentlyPlayed(account.access_token!);
        for (var i = 0; i < recentlyPlayed.length; i++) {
          const track = recentlyPlayed[i].track;
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
      }

      return token;
    },
    //runs whenever you call getServerSession() Takes ur accesstoken from the JWT and attaches it to the session,
    //which is what the api reads from
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  //signin -> JWT -> session
};
