import { type Config } from "drizzle-kit";

import { env } from "@/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  out: "./src/server/db/",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["ironswords_*"],
} satisfies Config;
