import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github";

export const authOptions = {

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],


  pages: {
    signIn: "/sign-in",  // custom signin page
  },
  secret: process.env.NEXTAUTH_SECRET,
};
