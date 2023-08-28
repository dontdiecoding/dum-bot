import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    GatewayIntentBits,
    GatewayIntentsString,
    Partials,
} from "discord.js";
import { env } from "../env";
import { CommandOptions, Event } from "./base";
import glob from "glob";
import { promisify } from "util";
import { debug_log, error_log, info_log } from "./utils";

const globPromise = promisify(glob);

// The lib folder contains most of the base code, this wont need to be changed much
// It includes like the client and the command / event bases.


export class BuilderBaut extends Client {
    commands: Collection<string, CommandOptions> = new Collection();
    // Commands are stored in the local
    debug: boolean = false;
    constructor() {
        super({
            intents: Object.keys(GatewayIntentBits)
                .filter((f) => f.toLowerCase().startsWith("guild"))
                .concat("MessageContent") as GatewayIntentsString[],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User,
            ],
        });

        const args = process.argv.slice(2);
        this.debug = args.includes("--debug") || args.includes("-d");
    }

    public init() {
        this.register();
        this.login(env.DISCORD_TOKEN);
    }

    private async register() {
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = (await globPromise(
            `${__dirname}/../commands/**/*{.ts,.js}`
        )) as string[];
        commandFiles.forEach(async (filePath) => {
            const command: CommandOptions = (await import(filePath))?.default;
            if (!command || !command.name) return;
            if (this.debug) debug_log(`Found command -> ${command.name}`);
            this.commands.set(command.name, command);
            slashCommands.push(command);
        });

        this.on("ready", () => {
            const guild = this.guilds.cache.find((f) => f.id === env.GUILD_ID);
            if (!guild) {
                error_log(`Failed to find server -> ${env.GUILD_ID}`);
                return;
            }

            guild.commands.set(slashCommands);
        });

        const eventFiles = (await globPromise(
            `${__dirname}/../events/**/*{.ts,.js}`
        )) as string[];
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = (await import(filePath))
                ?.default;
            if (!event || !event.name) return;
            if (this.debug) debug_log(`Found event -> ${event.name}`);
            this.on(event.name, event.main);
        });
    }
}
