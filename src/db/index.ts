import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "../env";

// This shouldnt need to be touched as its just connecting to the database

// Connects to the database and exports it so you can use it 
const client = postgres(env.DATABASE_URL);
const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), {
    migrationsFolder: "drizzle",
});

// See we use the postgres package to make the client and then we pass it into drizzle so it can manage it
export const db = drizzle(client);

