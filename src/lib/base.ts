import {
    ChatInputApplicationCommandData,
    ClientEvents,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionResolvable,
} from "discord.js";
import { BuilderBaut } from "./client";

export interface ExtendedInteraction extends CommandInteraction {
    interactionMember: GuildMember | undefined;
}

export type CommandRunCtx = {
    client: BuilderBaut;
    ctx: ExtendedInteraction;
    args: CommandInteractionOptionResolver;
};

export type CommandOptions = {
    userPermissions?: PermissionResolvable[];
    run: (ctx: CommandRunCtx) => void;
} & ChatInputApplicationCommandData;


export class Command {
    constructor(opts: CommandOptions) {
        Object.assign(this, opts);
    }
}

export class Event<K extends keyof ClientEvents> {
    constructor(
        public name: K,
        public main: (...args: ClientEvents[K]) => void
    ) {}
}
