import { ActivityType } from "discord.js";
import { client } from "..";
import { Event } from "../lib/base";
import { info_log } from "../lib/utils";
import { db } from "../db";
import { exampleTable } from "../db/schema";

// Each file within "events" will be register as its own event
// So this one will run once the bot is online aka ready

// Yeah an example + one that is used

export default new Event("ready", async () => {
    client.user?.setActivity(`buildergroop!?`, {
        type: ActivityType.Listening,
    });

    info_log(`User is online -> ${client.user?.tag}`);

    // Getting data -> https://orm.drizzle.team/docs
    const examples = db.select().from(exampleTable);
    console.log(examples);

    // This is an exmaple of fetching just all of the examples stored

    const data = await db.insert(exampleTable).values({
        name: "These are optional since i set a default value for them in the schema",
    });

    // Correct, so its used to like make the uhhhhhhhhhhhhhhh
    // the data unique to the rest
});
