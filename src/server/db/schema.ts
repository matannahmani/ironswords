import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  datetime,
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `ironswords_${name}`);

export const posts = mysqlTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const city = mysqlTable("city", {
  city_id: int("city_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
});

// Define the location table
export const location = mysqlTable("locations", {
  hotel_id: int("hotel_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 255 }),
  operator_id: int("operator_id"),
});

// Define the Operators table
export const Operators = mysqlTable("operators", {
  operator_id: int("operator_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  contact_info: varchar("contact_info", { length: 255 }),
});

// Define the Tickets table
export const Tickets = mysqlTable("tickets", {
  ticket_id: int("ticket_id").primaryKey().autoincrement(),
  hotel_id: int("hotel_id"),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  priority: mysqlEnum("priority", ["Low", "Medium", "High", "Urgent"]),
  status: mysqlEnum("status", ["Open", "Completed"]),
  deadline: datetime("deadline"),
  created_at: datetime("created_at"),
  updated_at: datetime("updated_at"),
});

// // Define the Users table
// export const Users = mysqlTable("users", {
//   user_id: int("user_id").primaryKey().autoincrement(),
//   name: varchar("name", { length: 255 }),
//   contact_info: varchar("contact_info", { length: 255 }),
// });

// Define the TicketResponses table
export const TicketResponses = mysqlTable("ticket_responses", {
  response_id: int("response_id").primaryKey().autoincrement(),
  ticket_id: int("ticket_id"),
  user_id: int("user_id"),
  message: text("message"),
  is_requesting_transpription: boolean("is_requesting_transpription"),
  is_client_done: boolean("is_client_done"),
  is_client_drop: boolean("is_client_drop"),
  created_at: datetime("created_at"),
});

// Define the Warehouses table
export const Warehouses = mysqlTable("warehouses", {
  warehouse_id: int("warehouse_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  city: varchar("city", { length: 255 }),
});

// Define the Categories table
export const Categories = mysqlTable("categories", {
  category_id: int("category_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
});

// Define the Items table
export const Items = mysqlTable("items", {
  item_id: int("item_id").primaryKey().autoincrement(),
  warehouse_id: int("warehouse_id"),
  category_id: int("category_id"),
  name: varchar("name", { length: 255 }),
  quantity: int("quantity"),
  stock: mysqlEnum("stock", ["none", "low", "medium", "high"]),
  last_updated: datetime("last_updated"),
});
