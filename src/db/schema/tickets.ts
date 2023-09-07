import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

export const tickets = pgTable(`tickets`, {
    id: serial("id").primaryKey().notNull(),
    type: text(`type`),
    creatorId: text(`creatorId`),
    channelId: text(`channelId`),
    status: text(`status`),
    messages: text(`messages`).array(),

    createdAt: text(`createdAt`).default(Date.now().toString()),
});
