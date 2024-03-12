import { RefreshingAuthProvider } from '@twurple/auth'
import { Bot, createBotCommand } from '@twurple/easy-bot'

import express from 'express'

import { Dungeon } from './dungeon'
import { dbManager } from './db_manager'

const clientId = '66ck4puv8ur1a2wfduhaegyphsntwe'
const clientSecret = '6me1qmdowp7fri8igmblb8vwignzbm'

const port = process.env.PORT || 4141
const app = express()

const tokenData = await Bun.file('./token.json').json()
const authProvider = new RefreshingAuthProvider(
  {
    clientId,
    clientSecret
  }
)
await authProvider.addUserForToken(tokenData, ['chat'])

const channelname = 'daemo72'


authProvider.onRefresh(async (userId, newTokenData) => await Bun.write('./token.json', JSON.stringify(newTokenData, null, 4)))

const db_manager = new dbManager('./db/playerdata.db')
const dungeon = new Dungeon(db_manager)

const bot = new Bot({
  authProvider,
  channels: [channelname],
  commands: [
    createBotCommand('dungeon', dungeon.dungeonWelcome),
    createBotCommand('join', dungeon.joinDungeon.bind(dungeon)),
    // createBotCommand('rundungeon', dungeon.runDungeon.bind(dungeon)),
    createBotCommand('stats', dungeon.getStats.bind(dungeon)),
  ]
})

const botSay = (x) => {bot.say('daemo72', x)}

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/rundungeon', (req, res) => {
  dungeon.runDungeon(req.body["difficulty"], botSay)
  res.redirect('/control.html')
})

app.post('/say', (req, res) => {
  const message = req.body["message"]
  if (message) {
    botSay(message)
  }
  res.redirect('/control.html')
})

app.post('/announce', (req, res) => {
  botSay("Dungeon is starting soon! Use !join to join the dungeon!")
  res.redirect('/control.html')
})


app.listen(port, () => {
  console.log(`Web UI Started at http://localhost:${port}/control.html`)
})
