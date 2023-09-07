import { Client, Message } from "discord.js";
import { ArgsOf, Discord, On } from "discordx";

@Discord()
class CodeBlocks {
    @On({ event: "messageCreate" })
    onMessage([message]: ArgsOf<"messageCreate">, client: Client) {
        let c = message.content;
        const regex = /```[^\n]*\n([\s\S]*?)\n```/g;

        const codeBlocks = [];
        let match;
        while ((match = regex.exec(c)) != null) {
            const language = match[0]
                .replace(match[1], "")
                .replaceAll(`\`\`\``, "")
                .replaceAll("\n", "")
                .trim();
            if (match[1].trim().split("\n").length >= 50) {
                c = c.replace(match[0], "");
                codeBlocks.push({
                    language: language,
                    content: match[1].trim(),
                });
            }
        }

        if (codeBlocks.length <= 0) return;
        message.reply({ content: "okay" });
    }
}
