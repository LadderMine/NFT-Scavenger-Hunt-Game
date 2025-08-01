import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
import { authOptions } from "@/lib/authOptions"; // move this out for reuse

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
