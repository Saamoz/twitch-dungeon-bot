import * as tmi from "tmi.js";
import Express from "express";
import dotenv from "dotenv";

import { Dungeon } from "./dungeon";
import { dbManager } from "./db_manager"
import { channel } from "diagnostics_channel";

dotenv.config();

const { WATCHED_CHANNEL, BOT_USERNAME, BOT_USER_ACCESS_TOKEN } = process.env;

if (!WATCHED_CHANNEL) throw new Error("WATCHED_CHANNEL required");
if (!BOT_USERNAME) throw new Error("BOT_USERNAME required");
if (!BOT_USER_ACCESS_TOKEN) throw new Error("BOT_USER_ACCESS_TOKEN required");

const port = process.env.PORT || 4141;

const app = Express();

const client = new tmi.Client({
  channels: [WATCHED_CHANNEL],
  identity: {
    username: BOT_USERNAME,
    password: `oauth:${BOT_USER_ACCESS_TOKEN}`,
  },
});

client.connect();

const db_manager = new dbManager('./db/playerdata.db')
const dungeon = new Dungeon(client, db_manager)

client.on("message", (channel, tags, message, isSelf) => {
  const senderUser = tags["display-name"];

  if (!isSelf) {
    switch (message.toLowerCase()) {
      case '!dungeon': {
        dungeon.dungeonWelcome(senderUser, channel);
        break;
      }
      case '!join': {
        dungeon.joinDungeon(senderUser, channel)
        break;
      }
      case '!dungeonget': {
        dungeon.getDungeon(channel)
        break;
      }
      case '!rundungeon': {
        dungeon.runDungeon(channel)
        break;
      }
      case '!stats': {
        dungeon.getStats(senderUser, channel)
        break;
      }
    }  
  }
}
);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
