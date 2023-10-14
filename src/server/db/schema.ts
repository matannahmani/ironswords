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

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  role: mysqlEnum("role", ["USER", "ADMIN"]).default("USER"),
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

export const citys = mysqlTable("city", {
  city_id: int("city_id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
});

// Define the location table
export const locations = mysqlTable(
  "location",
  {
    location_id: int("location_id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }),
    address: varchar("address", { length: 255 }),
    city_id: int("city_id"),
    operator_id: int("operator_id"),
  },
  (location) => ({
    // indexes
    // no foreign keys because of planetscale
    cityIdIdx: index("cityId_idx").on(location.city_id),
  }),
);

// define location operator join table
export const locationOperators = mysqlTable(
  "location_operator",
  {
    location_id: int("location_id"),
    operator_id: int("operator_id"),
    role: mysqlEnum("role", ["Admin", "Operator"]),
  },
  (locationOperator) => ({
    // indexes
    locationOperatorCompoundKey: primaryKey({
      columns: [locationOperator.location_id, locationOperator.operator_id],
    }),
    locationOperatorLocationIdIdx: index("locationOperatorLocationId_idx").on(
      locationOperator.location_id,
    ),
  }),
);

// Define the Operators table
export const operators = mysqlTable("operator", {
  operator_id: int("operator_id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  email: varchar("email", { length: 255 }),
  contact_info: varchar("contact_info", { length: 255 }),
});

// Define the Tickets table
export const tickets = mysqlTable(
  "ticket",
  {
    ticket_id: int("ticket_id").autoincrement().primaryKey(),
    location_id: int("location_id"),
    title: varchar("title", { length: 255 }),
    description: text("description"),
    priority: mysqlEnum("priority", ["Low", "Medium", "High", "Urgent"]),
    status: mysqlEnum("status", ["Open", "Completed"]),
    deadline: datetime("deadline"),
    created_at: datetime("created_at"),
    updated_at: datetime("updated_at"),
  },
  (ticket) => ({
    // indexes
    locationIdIdx: index("locationId_idx").on(ticket.location_id),
    priotityIdx: index("priotity_idx").on(ticket.priority),
    statusIdx: index("status_idx").on(ticket.status),
    deadlineIdx: index("deadline_idx").on(ticket.deadline),
    createdAtIdx: index("createdAt_idx").on(ticket.created_at),
    locationIdPriorityIdx: index("locationIdPriority_idx").on(
      ticket.location_id,
      ticket.priority,
    ),
    locationIdStatusIdx: index("locationIdStatus_idx").on(
      ticket.location_id,
      ticket.status,
    ),
    locationIdDeadlineIdx: index("locationIdDeadline_idx").on(
      ticket.location_id,
      ticket.deadline,
    ),
    locationIdCreatedAtIdx: index("locationIdCreatedAt_idx").on(
      ticket.location_id,
      ticket.created_at,
    ),
  }),
);

// Define the TicketResponses table
export const ticketResponses = mysqlTable(
  "ticket_response",
  {
    response_id: int("response_id").autoincrement().primaryKey(),
    ticket_id: int("ticket_id"),
    user_id: int("user_id"),
    content: text("message"),
    is_requesting_transportion: boolean("is_requesting_transportion"),
    is_client_done: boolean("is_client_done"),
    is_client_drop: boolean("is_client_drop"),
    created_at: datetime("created_at"),
  },
  (ticketResponse) => ({
    // indexes
    ticketIdIdx: index("ticketId_idx").on(ticketResponse.ticket_id),
    userIdIdx: index("userId_idx").on(ticketResponse.user_id),
    createdAtIdx: index("createdAt_idx").on(ticketResponse.created_at),
    isClientDoneIdx: index("isClientDone_idx").on(
      ticketResponse.is_client_done,
    ),
    isClientDropIdx: index("isClientDrop_idx").on(
      ticketResponse.is_client_drop,
    ),
  }),
);

// Define the Warehouses table
export const warehouses = mysqlTable(
  "warehouse",
  {
    warehouse_id: int("warehouse_id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }),
    city_id: int("city_id"),
  },
  (warehouse) => ({
    // indexes
    cityIdIdx: index("cityId_idx").on(warehouse.city_id),
  }),
);

// Define the Categories table
export const categories = mysqlTable("categorie", {
  category_id: int("category_id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
});

// Define the Items table
export const items = mysqlTable(
  "item",
  {
    item_id: int("item_id").autoincrement().primaryKey(),
    warehouse_id: int("warehouse_id"),
    category_id: int("category_id"),
    name: varchar("name", { length: 255 }),
    quantity: int("quantity"),
    stock: mysqlEnum("stock", ["none", "low", "medium", "high"]),
    last_updated: datetime("last_updated"),
  },
  (item) => ({
    // indexes
    warehouseIdIdx: index("warehouseId_idx").on(item.warehouse_id),
    categoryIdIdx: index("categoryId_idx").on(item.category_id),
    stockIdx: index("stock_idx").on(item.stock),
    lastUpdatedIdx: index("lastUpdated_idx").on(item.last_updated),
    warehouseIdCategoryIdIdx: index("warehouseIdCategoryId_idx").on(
      item.warehouse_id,
      item.category_id,
    ),
  }),
);
