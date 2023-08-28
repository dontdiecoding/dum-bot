import { pgTable, text, serial } from 'drizzle-orm/pg-core'

// These are our database schemas
// So you define a schema with the like id to a row, and a type
// These can be called and updated which ill show an example of in a second.

export const exampleTable = pgTable(`example`, {
    id: serial("id").primaryKey().notNull(),
    name: text(`name`).default("Default name"), // E.G name
    email: text(`email`).default("example@example.com")
})

// You can put it in multiple files or just keep them to this file, either way it will be registered in the database
// Drizzle is like prisma but better