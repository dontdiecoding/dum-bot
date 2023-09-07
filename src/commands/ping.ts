import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CommandInteraction,
    MessageActionRowComponentBuilder,
} from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";

@Discord()
class PingCommand {
    @ButtonComponent({ id: "hello" })
    handler(interaction: ButtonInteraction): void {
        interaction.reply(`gg ez ${interaction.user.tag}`);
    }

    @Slash({ description: "Pong!", name: "ping" })
    ping(interaction: CommandInteraction) {
        const btn = new ButtonBuilder()
            .setLabel("Hello")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("hello");

        const buttonRow =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                btn
            );

        interaction.reply({
            content: "discordx refactor :(",
            components: [buttonRow],
        });
    }
}
