import { RefreshingAuthProvider } from '@twurple/auth'
import { Bot, createBotCommand } from '@twurple/easy-bot'


import { Dungeon } from './dungeon'
import { dbManager } from './db_manager'

const clientId = '66ck4puv8ur1a2wfduhaegyphsntwe'
const clientSecret = '6me1qmdowp7fri8igmblb8vwignzbm'

const port = process.env.PORT || 4141

const tokenData = await Bun.file('./token.json').json()
const authProvider = new RefreshingAuthProvider(
  {
    clientId,
    clientSecret
  }
)
await authProvider.addUserForToken(tokenData, ['chat'])


authProvider.onRefresh(async (userId, newTokenData) => await Bun.write('./token.json', JSON.stringify(newTokenData, null, 4)))

const db_manager = new dbManager('./db/playerdata.db')
const dungeon = new Dungeon(db_manager)

new Bot({
  authProvider,
  channels: ['daemo72'],
  commands: [
    createBotCommand('dungeon', dungeon.dungeonWelcome),
    createBotCommand('join', dungeon.joinDungeon.bind(dungeon)),
    createBotCommand('rundungeon', dungeon.runDungeon.bind(dungeon)),
    createBotCommand('stats', dungeon.getStats.bind(dungeon)),
  ]
})

const BASE_PATH = "./public";
Bun.serve({
  port: port,
  async fetch(req) {
    const filePath = BASE_PATH + new URL(req.url).pathname;
    console.log(filePath)
    const file = Bun.file(filePath);

    console.log(await file.text())

    // return new Response(filePath);
    
    return new Response(file);
  },
  error() {
    return new Response(null, { status: 404 });
  },
});
