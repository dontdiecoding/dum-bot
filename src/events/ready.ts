import { Discord, Once } from "discordx";
import { ticketMenu } from "../plugins/tickets";

@Discord()
class ReadyEvent {
    @Once({ event: "ready" })
    onReady() {
        // ticketMenu();
    }
}
