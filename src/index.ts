import "dotenv/config";
import { BuilderBaut } from "./lib/client";
export const client = new BuilderBaut();
client.init();