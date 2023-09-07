import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonComponentData,
    ButtonInteraction,
    StringSelectMenuInteraction,
    TextChannel,
} from "discord.js";
import {
    ArgsOf,
    ButtonComponent,
    Discord,
    On,
    SelectMenuComponent,
} from "discordx";
import { handleSelectMenu } from "../plugins/tickets";
import { db } from "../db";
import { tickets } from "../db/schema/tickets";
import { sql } from "drizzle-orm";

@Discord()
class TicketHandler {
    @SelectMenuComponent({ id: "ticket-menu" })
    async handle(interaction: StringSelectMenuInteraction) {
        handleSelectMenu(interaction);
    }

    @ButtonComponent({ id: "delete-ticket" })
    async handleDelete(interaction: ButtonInteraction) {
        const channel = interaction.guild?.channels.cache.find(
            (f) => f.id === interaction.channel?.id
        ) as TextChannel;
        const ticketList = await db
            .select()
            .from(tickets)
            .where(
                sql`${tickets.channelId} = ${interaction.channel?.id} AND ${
                    tickets.status
                } = ${"closed"}`
            );

        if (!ticketList) {
            interaction.deferUpdate().catch(() => null);
            return;
        }
        const ticket = ticketList.find((f) => f.channelId === channel.id);
        if (!ticket) {
            return interaction.reply({
                content: `It appears this ticket doesnt exist? Please contact one of my maintainers.`,
                ephemeral: true,
            });
        }
        await db
            .update(tickets)
            .set({
                status: "deleted",
            })
            .then(() => null)
            .catch(() => {
                return interaction.reply({
                    content: `It appears there has been an deleting this ticket, please contact one of my maintainers. It will stay closed in the mean time.`,
                    ephemeral: true,
                });
            });

        channel.deletable
            ? channel.delete(`Closing ticket - ${ticket.type} #${ticket.id}`)
            : null;
    }

    @ButtonComponent({ id: "reopen-ticket" })
    async handleReopen(interaction: ButtonInteraction) {
        const ticketList = await db
            .select()
            .from(tickets)
            .where(
                sql`${tickets.channelId} = ${interaction.channel?.id} AND ${
                    tickets.status
                } = ${"closed"}`
            );

        if (!ticketList) {
            interaction.deferUpdate().catch(() => null);
            return;
        }

        await db
            .update(tickets)
            .set({
                status: "open",
            })
            .then(() => null)
            .catch(() => {
                return interaction.reply({
                    content: `It appears there has been an reopening this ticket, please contact one of my maintainers.`,
                    ephemeral: true,
                });
            });

        const components = interaction.message.components
            ? interaction.message.components[0].components
            : null;

        if (!components) {
            return interaction.reply({
                content: `It appears there has been an reopening this ticket, please contact one of my maintainers. This ticket will stay closed for the mean time.`,
                ephemeral: true,
            });
        }

        const c = components.map((c) => {
            return {
                data: {
                    ...c.data,
                    disabled: !c.data.disabled,
                },
            };
        }) as [
            {
                data: ButtonComponentData;
            }
        ];

        interaction.update({
            components: [
                new ActionRowBuilder<ButtonBuilder>({
                    components: c.map(
                        (c) =>
                            new ButtonBuilder({
                                ...c.data,
                            })
                    ),
                }),
            ],
        });
        return;
    }

    @ButtonComponent({ id: "close-ticket" })
    async handleClose(interaction: ButtonInteraction) {
        const channel = interaction.guild?.channels.cache.find(
            (f) => f.id === interaction.channel?.id
        ) as TextChannel;

        const member = interaction.guild?.members.cache.find(
            (f) => f.id === interaction.user.id
        );

        if (!member?.permissions.has(["ManageChannels"])) {
            interaction.deferUpdate().catch(() => null);
            return;
        }

        const ticketList = await db
            .select()
            .from(tickets)
            .where(
                sql`${tickets.channelId} = ${interaction.channel?.id} AND ${
                    tickets.status
                } = ${"open"}`
            );

        if (
            !ticketList ||
            !ticketList.find((f) => f.channelId === channel.id)
        ) {
            interaction.deferUpdate().catch(() => null);
            return;
        }

        const ticket = ticketList[0];

        await db
            .update(tickets)
            .set({
                status: "closed",
            })
            .where(sql`${tickets.id} = ${ticket.id}`)
            .catch((err) => {
                return interaction.reply({
                    content: `It appears there has been an error closing this ticket, please contact one of my maintainers.`,
                    ephemeral: true,
                });
            })
            .then(() => null);

        const components = interaction.message.components
            ? interaction.message.components[0].components
            : null;

        if (!components) {
            return interaction.reply({
                content: `It appears there has been an error closing this ticket, please contact one of my maintainers. This ticket will be closed for the mean time.`,
                ephemeral: true,
            });
        }

        const c = components.map((c) => {
            return {
                data: {
                    ...c.data,
                    disabled: !c.data.disabled,
                },
            };
        }) as [
            {
                data: ButtonComponentData;
            }
        ];

        interaction.update({
            components: [
                new ActionRowBuilder<ButtonBuilder>({
                    components: c.map(
                        (c) =>
                            new ButtonBuilder({
                                ...c.data,
                            })
                    ),
                }),
            ],
        });
    }

    @On({ event: "messageCreate" })
    async onMessage([message]: ArgsOf<"messageCreate">) {
        const channelId = message.channel.id;
        const ticketList = await db
            .select()
            .from(tickets)
            .where(
                sql`${tickets.channelId} = ${channelId} AND ${
                    tickets.status
                } = ${"open"}`
            );
        if (!ticketList || ticketList.length < 1) return;
        const ticket = ticketList[0];
        await db.update(tickets).set({
            messages: [
                ...(ticket.messages as string[]),
                JSON.stringify({
                    embeds: message.embeds ? message.embeds : [],
                    content: message.content ? message.content : null,
                    author: message.author,
                }),
            ],
        });
    }
}
