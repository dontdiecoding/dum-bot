import { z } from "zod";

// They all have to be strings because thats how they are exported
// We use this to have intellisense on the dotenv 😊
const envSchema = z.object({
    DISCORD_TOKEN: z.string(),
    GUILD_ID: z.string(),
    DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);

