//go to http://192.168.1.217:3000/api/auth/signin to see the login page

import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      //add exclaimation points to the end of the env ids so typescript knows it exists
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  ],
});

//NextAuth needs the GET and POST handlers to function which is why we export them
export { handler as GET, handler as POST };
