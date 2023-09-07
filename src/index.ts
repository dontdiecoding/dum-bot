import "dotenv/config";
import { IntentsBitField, Partials } from "discord.js";
import { importx } from "@discordx/importer";
import { Client } from "discordx";
import { info_log } from "./lib/utils";
import { env } from "./env";

export const client = new Client({
    intents: [
        IntentsBitField.Flags.AutoModerationConfiguration,
        IntentsBitField.Flags.AutoModerationExecution,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
    ],
    botGuilds: [env.GUILD_ID],
    silent: false,
});

client.on("ready", async () => {
    info_log(`User is online -> ${client.user?.tag}`);
    await client.initApplicationCommands();
});

client.on("interactionCreate", (interaction) => {
    client.executeInteraction(interaction);
});

async function run() {
    await importx(`${__dirname}/{events,commands}/**/*.{ts,js}`);
    await client.login(env.DISCORD_TOKEN);
}

run();
