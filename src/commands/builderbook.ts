import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { getAllContents } from "../lib/builderbook";

@Discord()
class BuilderBook {
    @Slash({ name: "builderbook", description: "Search the builderbook" })
    builderbook(
        @SlashOption({
            name: "query",
            description: "search query",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        query: string,
        interaction: CommandInteraction
    ) {
    }
}
