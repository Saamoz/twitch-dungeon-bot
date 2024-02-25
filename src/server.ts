import { RefreshingAuthProvider } from '@twurple/auth'
import { Bot, createBotCommand } from '@twurple/easy-bot'
import { promises as fs } from 'fs'

import Express from 'express'

import { Dungeon } from './dungeon'
import { dbManager } from './db_manager'

const clientId = '66ck4puv8ur1a2wfduhaegyphsntwe'
const clientSecret = '6me1qmdowp7fri8igmblb8vwignzbm'

const port = process.env.PORT || 4141
const app = Express()

const tokenData = JSON.parse(await fs.readFile('./token.json', 'utf-8'))
const authProvider = new RefreshingAuthProvider(
  {
    clientId,
    clientSecret
  }
)
await authProvider.addUserForToken(tokenData, ['chat'])


authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile('./token.json', JSON.stringify(newTokenData, null, 4), 'utf-8'))

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

app.get('/', (req, res) => {
  res.json({ status: 'ok' })
})
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
