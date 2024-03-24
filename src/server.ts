import { RefreshingAuthProvider } from '@twurple/auth'
import { Bot, createBotCommand } from '@twurple/easy-bot'

import express from 'express'

import { Dungeon } from './dungeon'
import { dbManager } from './db_manager'

const clientId = '66ck4puv8ur1a2wfduhaegyphsntwe'
const clientSecret = '6me1qmdowp7fri8igmblb8vwignzbm'

const port = 4141
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
    createBotCommand('buypotion', dungeon.buypotion.bind(dungeon)),
  ]
})

const botSay = (x) => {bot.say('daemo72', x)}

app.use(express.static('public'))
app.use(express.json())

app.post('/rundungeon', (req, res) => {
  dungeon.runDungeon(req.body['difficultyVal'], botSay)
  res.status(200)
})

app.post('/say', (req, res) => {
  const message = req.body['message']
  if (message) {
    botSay(message)
  }
  res.status(200)
})

app.post('/announce', (req, res) => {
  botSay('Dungeon is open! Use !join to join the dungeon!')
  res.status(200)
})

app.post('/opendungeon', (req, res) => {
  if (req.body["doopen"]) {
    if (dungeon.open) {
      console.log('dungeon close')
      dungeon.open = false 
      dungeon.players_in_dungeon = {}
    } else {
      console.log('dungeon open')
      dungeon.open = true  
    }
  } 
  res.send(dungeon.open)
})

app.post('/openstore', (req, res) => {
  if (req.body["doopen"]) {
    if (dungeon.store_open) {
      console.log('store close')
      botSay("Store is closing! ദ്ദി ˉ͈̀꒳ˉ͈́ )✧")
      dungeon.store_open = false 
    } else {
      console.log('store open')
      botSay("Store is open for business! ٩(^ᗜ^ )و ´-")
      dungeon.store_open = true  
    }
  } 
  res.send(dungeon.store_open)
})

app.get('/isopen', (req, res) => {
  res.send(dungeon.open)
})

app.get('/playerlist', (req, res) => {
  res.send(dungeon.players_in_dungeon)
})

app.listen(port, () => {
  console.log(`Web UI Started at http://localhost:${port}/control.html`)
})