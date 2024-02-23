import * as tmi from "tmi.js";
import Express from "express";
import dotenv from "dotenv";
const dungeon = require("./dungeon")


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

client.on("message", (channel, tags, message, isSelf) => {
  const senderUser = tags["display-name"];

  if (!isSelf && message == '!dungeon') {
    const resp = dungeon.dungeonWelcome(senderUser)
    client.say(
      channel,
      resp
    );
  }
});

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
