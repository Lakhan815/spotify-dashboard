//go to url/api/auth/signin to see the login page

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

//NextAuth needs the GET and POST handlers to function which is why we export them
export { handler as GET, handler as POST };
