import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonComponent,
    ButtonStyle,
    ChannelType,
    MessageActionRowComponentBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    TextChannel,
    resolveColor,
} from "discord.js";
import dayjs from "dayjs";
import { client } from "..";
import config from "../config";
import { env } from "../env";
import { error_log, format_str } from "../lib/utils";
import { db } from "../db";
import { tickets } from "../db/schema/tickets";
import { sql } from "drizzle-orm";

export const ticketMenu = () => {
    const guild = client.guilds.cache.find((f) => f.id === env.GUILD_ID);
    if (!guild) {
        error_log(`Failed to find guild -> ${env.GUILD_ID}`);
        return;
    }

    const ticketChannel = guild.channels.cache.find(
        (f) => f.id === config.tickets.channel
    ) as TextChannel;
    if (!ticketChannel) {
        error_log(`Failed to find ticket channel -> ${config.tickets.channel}`);
        return;
    }

    ticketChannel.send({
        embeds: [
            {
                color: resolveColor(config.colour),
                title: "Tickets",
                description: `Open a ticket to contact a board or staff member for assistance. Please provide all information surrounding your reason for opening.`,
            },
        ],
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new StringSelectMenuBuilder()
                    .addOptions([
                        {
                            label: "Report 🚨",
                            value: "report",
                        },
                        {
                            label: "Suggestion 🤔",
                            value: "suggestion",
                        },
                    ])
                    .setCustomId("ticket-menu")
            ),
        ],
    });
};

export const handleSelectMenu = async (
    interaction: StringSelectMenuInteraction
) => {
    if (interaction.customId === "ticket-menu") {
        const value = interaction.values[0] as "suggestion" | "report";
        const existingTicket = await db
            .select()
            .from(tickets)
            .where(
                sql`${tickets.creatorId} = ${interaction.user.id} AND ${
                    tickets.status
                } = ${"open"}`
            );
        if (existingTicket.length > 0) {
            return interaction.reply({
                content: `It appears you already have a ticket open? Please finsh in that one before attempting to open a new one.`,
                ephemeral: true,
            });
        }
        const last = (await db.select().from(tickets)).at(-1);
        const channel = (await interaction.guild?.channels
            .create({
                name: `${value.toLowerCase()}-${(last?.id || 0) + 1}`,
                parent: config.tickets.category,
                type: ChannelType.GuildText,
            })
            .catch(() => {
                return interaction.reply({
                    content: `It looks like there has been a problem creating your ticket, please contact one of my maintainers.`,
                });
            })) as TextChannel;
        if (!channel)
            return interaction.reply({
                content: `It looks like there has been a problem creating your ticket, please contact one of my maintainers.`,
            });

        const newTicket = await db
            .insert(tickets)
            .values({
                channelId: channel.id,
                creatorId: interaction.user.id,
                status: "open",
                messages: [],
                type: `${value.toLowerCase()}`,
            })
            .returning();

        interaction.deferUpdate();

        channel.send({
            content: `<@${interaction.user.id}>`,
            embeds: [
                {
                    author: {
                        name: `Thank you ${interaction.user.tag}`,
                    },
                    footer: {
                        text: `${format_str(value)} #${
                            newTicket[0].id
                        } opened at ${dayjs(Date.now()).format(
                            "HH:MM - DD/MM/YYYY"
                        )}`,
                    },
                    color: resolveColor(config.colour),
                    description: `A staff/board member will be with you shortly. Please provide any details that pertain to the reason for opening a ${value}.\n\n*Kindly avoid attempting to contact staff/board members directly; they will respond to you as soon as they are able.*`,
                },
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder({
                        custom_id: "delete-ticket",
                        style: ButtonStyle.Danger,
                        label: "Delete",
                        disabled: true,
                    }),
                    new ButtonBuilder({
                        custom_id: "close-ticket",
                        style: ButtonStyle.Danger,
                        label: "Close",
                    }),
                    new ButtonBuilder({
                        custom_id: "reopen-ticket",
                        style: ButtonStyle.Primary,
                        label: "Reopen",
                        disabled: true,
                    }),
                ]),
            ],
        });
    }
};
