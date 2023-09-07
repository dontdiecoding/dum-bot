import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "../env";

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), {
    migrationsFolder: "./drizzle",
});

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);
