// @ts-ignore - someweird bug fix later
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

import { env } from "@/env.mjs";
import { db } from "@/server/db";
import {
  accounts,
  mysqlTable,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { MySqlTableFn } from "drizzle-orm/mysql-core";

// @ts-expect-error - this is a temporary hack for drizzle adapter
const mySqlTableHijack: MySqlTableFn = (name, columns, extraConfig) => {
  switch (name) {
    case "user":
      return users;
    case "account":
      return accounts;
    case "session":
      return sessions;
    case "verificationToken":
      return verificationTokens;
    default:
      return mysqlTable(name, columns, extraConfig);
  }
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & typeof users.$inferSelect;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db, mySqlTableHijack),
  callbacks: {
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...user,
          ...token,
        },
      };
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "database",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async () => await auth();
