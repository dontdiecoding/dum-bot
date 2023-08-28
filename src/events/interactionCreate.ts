import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event, ExtendedInteraction } from "../lib/base";

// It is, This one takes in a slash command e.g /hello and it will see if that command has been registered and stored by the bot
// If it has then it will be executed

// This one is needed for the bot to run and ofc more can be done in here,
// this is just the basics

export default new Event("interactionCreate", (int) => {
    if (int.isCommand()) {
        const command = client.commands.find(
            (f) => f.name.toLowerCase() === int.commandName.toLowerCase()
        );
        if (!command)
            return int.reply({
                content: "Somehow you ran a command that doesnt exist!?",
            });

        (int as ExtendedInteraction).interactionMember =
            int.guild?.members.cache.find((f) => f.id === int.user.id);
            
        command.run({
            args: int.options as CommandInteractionOptionResolver,
            client: client,
            ctx: int as ExtendedInteraction,
        });
    }
});
