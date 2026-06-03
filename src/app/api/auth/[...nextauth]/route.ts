//go to url/api/auth/signin to see the login page
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

//creates a handler to know how to deal with all of the auth requests. It catches all the diff urls bc of the
//[...nextauth] folder name
const handler = NextAuth(authOptions);

//NextAuth needs the GET and POST handlers to function which is why we export them
export { handler as GET, handler as POST };
