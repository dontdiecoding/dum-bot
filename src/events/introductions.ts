import { Discord, On, ArgsOf, Client } from "discordx";
import config from "../config";
import { error_log } from "../lib/utils";

@Discord()
class Introductions {
    @On({ event: "messageCreate" })
    onMessage([message]: ArgsOf<"messageCreate">, client: Client) {
        if (message.author.bot) return;
        if (message.channel.id === config.introductions.channel) {
            const role = message.guild?.roles.cache.find(
                (f) => f.id === config.introductions.role
            );

            if (!role) {
                error_log(`Failed to find introduction role.`);
            }

            if (message.member?.roles.cache.has(config.introductions.role))
                return;

            message.member?.roles.add(config.introductions.role);
        }
    }
}
