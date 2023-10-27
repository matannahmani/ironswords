import {relations, sql} from "drizzle-orm";
import {
    bigint,
    boolean,
    datetime,
    index,
    int,
    json,
    mysqlEnum,
    mysqlTableCreator,
    primaryKey,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import {nanoid} from "nanoid";
import {ticketCategories} from "../../shared/zod/ticketCategories";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `ironswords_${name}`);

export const users = mysqlTable("user", {
    id: varchar("id", {length: 128}).notNull().primaryKey(),
    name: varchar("name", {length: 255}),
    email: varchar("email", {length: 255}).notNull(),
    emailVerified: timestamp("emailVerified", {
        mode: "date",
        fsp: 3,
    }).default(sql`CURRENT_TIMESTAMP(3)`),
    role: mysqlEnum("role", ["USER", "ADMIN", "OPERATOR"]).default("USER"),
    image: varchar("image", {length: 255}),
});

export const accounts = mysqlTable(
    "account",
    {
        userId: varchar("user_id", {length: 128}).notNull(),
        type: varchar("type", {length: 255})
            // .$type<AdapterAccount["type"]>()
            .notNull(),
        provider: varchar("provider", {length: 255}).notNull(),
        providerAccountId: varchar("providerAccountId", {length: 255}).notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: int("expires_at"),
        token_type: varchar("token_type", {length: 255}),
        scope: varchar("scope", {length: 255}),
        id_token: text("id_token"),
        session_state: varchar("session_state", {length: 255}),
    },
    (account) => ({
        compoundKey: primaryKey(account.provider, account.providerAccountId),
        userIdIdx: index("userId_idx").on(account.userId),
    }),
);

export const sessions = mysqlTable(
    "session",
    {
        sessionToken: varchar("sessionToken", {length: 255})
            .notNull()
            .primaryKey(),
        userId: varchar("user_id", {length: 128}).notNull(),
        expires: timestamp("expires", {mode: "date"}).notNull(),
    },
    (session) => ({
        userIdIdx: index("userId_idx").on(session.userId),
    }),
);

export const verificationTokens = mysqlTable(
    "verificationToken",
    {
        identifier: varchar("identifier", {length: 255}).notNull(),
        token: varchar("token", {length: 255}).notNull(),
        expires: timestamp("expires", {mode: "date"}).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey(vt.identifier, vt.token),
    }),
);

export const citys = mysqlTable("city", {
    city_id: varchar("city_id", {length: 128})
        .$defaultFn(() => nanoid())
        .primaryKey(),
    name: varchar("name", {length: 255}),
});

// Define the location table
export const locations = mysqlTable(
    "location",
    {
        location_id: varchar("location_id", {length: 128})
            .$defaultFn(() => nanoid())
            .primaryKey(),
        name: varchar("name", {length: 255}),
        address: varchar("address", {length: 255}),
        city_id: varchar("city_id", {length: 128}),
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
        location_id: varchar("location_id", {length: 128}),
        operator_id: varchar("operator_id", {length: 128}),
    },
    (locationOperator) => ({
        // indexes
        locationOperatorCompoundKey: primaryKey(
            locationOperator.location_id,
            locationOperator.operator_id,
        ),
        locationOperatorLocationIdIdx: index("locationOperatorLocationId_idx").on(
            locationOperator.location_id,
        ),
    }),
);

// Define the Operators table
export const operators = mysqlTable(
    "operator",
    {
        operator_id: varchar("operator_id", {length: 128})
            .$defaultFn(() => nanoid())
            .primaryKey(),
        name: varchar("name", {length: 255}).notNull(),
        user_id: varchar("user_id", {length: 128}).unique().notNull(),
        phone: varchar("phone", {length: 255}).notNull(),
        email: varchar("email", {length: 255}).notNull(),
        contact_info: varchar("contact_info", {length: 255}),
    },
    (operator) => ({
        // indexes
        userIdIdx: index("userId_idx").on(operator.user_id),
    }),
);

// define operatorsInvite table
export const operatorsInvite = mysqlTable(
    "operators_invite",
    {
        invite_id: varchar("invite_id", {length: 128})
            .$defaultFn(() => nanoid())
            .primaryKey(),
        email: varchar("email", {length: 255}).unique().notNull(),
        is_claimed: boolean("is_claimed").default(false),
        payload: json("json")
            .$type<
                Omit<typeof operators.$inferInsert, "user_id" | "operator_id"> & {
                contact_info: string | undefined;
                location_ids: string[];
            }
            >()
            .notNull(),
        expires: datetime("expires"),
    },
    (operatorInvite) => ({
        // indexes

        operatorInviteEmailIdx: index("operatorInviteEmail_idx").on(
            operatorInvite.email,
        ),
    }),
);

// Define the Tickets table
export const tickets = mysqlTable(
    "ticket",
    {
        ticket_id: varchar("ticket_id", {length: 128})
            .$defaultFn(() => nanoid())
            .primaryKey(),
        location_id: varchar("location_id", {length: 128}).notNull(),
        operator_id: varchar("operator_id", {length: 128}).notNull(),
        city_id: varchar("city_id", {length: 128}).notNull(),
        title: varchar("title", {length: 255}).notNull(),
        category: mysqlEnum("category", ticketCategories).notNull(),
        requester_fullname: varchar("requester_name", {length: 255}).notNull(),
        requester_phone: varchar("requester_phone", {length: 255}).notNull(),
        notes: text("notes"),
        description: text("description"),
        priority: mysqlEnum("priority", ["LOW", "MID", "HIGH", "URGENT"]),
        status: mysqlEnum("status", ["OPEN", "CLOSED", "ASSIGNED"]).$default(
            () => "OPEN",
        ),
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
        operatorIdIdx: index("operatorId_idx").on(ticket.operator_id),
        categoryIdIdx: index("categoryId_idx").on(ticket.category),
        createdAtIdx: index("createdAt_idx").on(ticket.created_at),
        cityIdIdx: index("cityId_idx").on(ticket.city_id),
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
        response_id: varchar("response_id", {length: 128})
            .$defaultFn(() => nanoid())
            .primaryKey(),
        ticket_id: varchar("ticket_id", {length: 128}),
        user_id: varchar("user_id", {length: 128}),
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
        warehouse_id: varchar("warehouse_id", {length: 128})
            .$defaultFn(() => nanoid())
            .primaryKey(),
        name: varchar("name", {length: 255}),
        location_id: varchar("location_id", {length: 128}),
        capacity: mysqlEnum("capacity", ["UNDER", "FULL", "OVER"]),
    },
    (warehouse) => ({
        // indexes
        locationIdIdx: index("locationId_idx").on(warehouse.location_id),
    }),
);

// Define the Categories table
export const categories = mysqlTable("categorie", {
    category_id: varchar("category_id", {length: 128})
        .$defaultFn(() => nanoid())
        .primaryKey(),
    name: varchar("name", {length: 255}),
    parent_category_id: varchar("parent_id", {length: 128}),
});

// table to represent dif attributes types of an item (e.g. Size, Gender etc...)
export const attribute_types = mysqlTable("attribute_types", {
    attribute_type_id: int("attribute_type_id").primaryKey().autoincrement(),
    name: varchar("name", {length: 255}),
});

// table to represent specific attributes of an item (e.g. "women", "size 7", etc...)
export const attributes = mysqlTable("attribute", {
    attribute_id: int("attribute_id").primaryKey().autoincrement(),
    value: varchar("value", {length: 255}),
    attribute_type_id: int("attribute_type_id"),
});

// Define the Items table
export const items = mysqlTable(
    "item",
    {
        item_id: varchar("item_id", {length: 128})
            .$defaultFn(() => nanoid())
            .primaryKey(),
        category_id: varchar("category_id", {length: 128}),
        name: varchar("name", {length: 255}),
    },
    (item) => ({
        // indexes
        categoryIdIdx: index("categoryId_idx").on(item.category_id),
    }),
);

export const itemAttributes = mysqlTable(
    "item_attribute",
    {
        item_id: varchar("item_id", {length: 128}),
        attribute_id: int("attribute_id"),
    },
    (itemAttribute) => ({
        // indexes
        locationOperatorCompoundKey: primaryKey(
            itemAttribute.item_id,
            itemAttribute.attribute_id,
        ),
        itemAttributesItemIdIdx: index("itemAttributesItemId_idx").on(
            itemAttribute.item_id,
        ),
        itemAttributesAttributeIdIdx: index("itemAttributesAttributeId_idx").on(
            itemAttribute.attribute_id,
        ),
    }),
);

export const warehouseItems = mysqlTable("warehouse_item", {
        warehouse_item_id: int("warehouse_item_id").primaryKey().autoincrement(),
        item_id: varchar("item_id", {length: 128}),
        warehouse_id: varchar("warehouse_id", {length: 128}),
        quantity: int("quantity"),
        stock: mysqlEnum("stock", ["none", "low", "medium", "high"]),
        last_updated: datetime("last_updated"),
    }, (warehouseItems) => ({
        lastUpdatedIdx: index("lastUpdated_idx").on(warehouseItems.last_updated),
        warehouseIdIdx: index("warehouseId_idx").on(warehouseItems.warehouse_id),
        itemIdx: index("itemIdIdx").on(warehouseItems.item_id)
    })
);

export const itemsRelations = relations(items, ({one, many}) => ({
    category: one(categories, {
        fields: [items.category_id],
        references: [categories.category_id],
    }),
    itemAttributes: many(itemAttributes),
}));

export const attributeRelations = relations(attributes,
    ({one, many}) => ({
        attribute_type: one(attribute_types, {
            fields: [attributes.attribute_type_id],
            references: [attribute_types.attribute_type_id]
        }),
        item_attributes: many(itemAttributes)
    }))

export const attributeTypeRelations = relations(attribute_types,
    ({many}) => ({
        attribute: many(attributes),
    }))

export const itemAttributeRelations = relations(itemAttributes, ({one}) => ({
    item: one(items, {
        fields: [itemAttributes.item_id],
        references: [items.item_id],
    }),
    attribute: one(attributes, {
        fields: [itemAttributes.attribute_id],
        references: [attributes.attribute_id],
    }),
}));

export const categoryRelations = relations(categories, ({one, many}) => ({
    items: many(items),
    parent_category: one(categories, {
        fields: [categories.parent_category_id],
        references: [categories.category_id],
    }),
}));

export const warehouseRelations = relations(warehouses, ({one, many}) => ({
    location: one(locations, {
        fields: [warehouses.location_id],
        references: [locations.location_id],
    }),
    warehouse_items: many(warehouseItems),
}));

export const warehouseItemRelations = relations(
    warehouseItems,
    ({one, many}) => ({
        warehouse: one(warehouses, {
            fields: [warehouseItems.warehouse_id],
            references: [warehouses.warehouse_id],
        }),
        item: one(items, {
            fields: [warehouseItems.warehouse_item_id],
            references: [items.item_id],
        }),
    }),
);

export const ticketRelations = relations(tickets, ({many, one}) => ({
    ticketResponses: many(ticketResponses),
    operator: one(operators, {
        fields: [tickets.operator_id],
        references: [operators.operator_id],
    }),
    location: one(locations, {
        fields: [tickets.location_id],
        references: [locations.location_id],
    }),
}));

export const ticketResponseRelations = relations(
    ticketResponses,
    ({one}) => ({
        ticket: one(tickets, {
            fields: [ticketResponses.ticket_id],
            references: [tickets.ticket_id],
        }),
        user: one(users, {
            fields: [ticketResponses.user_id],
            references: [users.id],
        }),
    }),
);

export const locationRelations = relations(locations, ({many, one}) => ({
    tickets: many(tickets),
    locationOperators: many(locationOperators),
    city: one(citys, {
        fields: [locations.city_id],
        references: [citys.city_id],
    }),
}));

export const operatorRelations = relations(operators, ({many, one}) => ({
    locationOperators: many(locationOperators),
    tickets: many(tickets),
    user: one(users, {
        fields: [operators.user_id],
        references: [users.id],
    }),
}));

export const cityRelations = relations(citys, ({many}) => ({
    locations: many(locations),
    /*
    warehouses: many(warehouses),
  */
}));

export const locationOperatorRelations = relations(
    locationOperators,
    ({one}) => ({
        location: one(locations, {
            fields: [locationOperators.location_id],
            references: [locations.location_id],
        }),
        operator: one(operators, {
            fields: [locationOperators.operator_id],
            references: [operators.operator_id],
        }),
    }),
);

export const userRelations = relations(users, ({many}) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    operators: many(operators),
    ticketResponses: many(ticketResponses),
}));

export const accountRelations = relations(accounts, ({one}) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const sessionRelations = relations(sessions, ({one}) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const verificationTokenRelations = relations(
    verificationTokens,
    ({one}) => ({
        user: one(users, {
            fields: [verificationTokens.identifier],
            references: [users.id],
        }),
    }),
);
