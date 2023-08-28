import { Command } from "../lib/base";

// Yeah so this is an exmaple

export default new Command({
    name: "ping",
    description: "Pong!",
    // Those classes are so its easier to know

    run: ({ ctx }) => {
        ctx.reply({ content: `Pong!` });
    },
});

// Yeah so you can make piped statements