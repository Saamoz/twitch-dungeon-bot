import { RefreshingAuthProvider } from '@twurple/auth'
import { Bot, createBotCommand } from '@twurple/easy-bot'

import express from 'express'
import { WebSocketServer } from 'ws';

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
  ]
})

const botSay = (x) => {bot.say('daemo72', x)}



app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/rundungeon', (req, res) => {
  dungeon.runDungeon(req.body["difficulty"], botSay)
  res.redirect('/control.html')
})

app.post('/say', (req, res) => {
  console.log(req.body)
  const message = req.body["message"]
  if (message) {
    botSay(message)
  }
  // res.redirect('/control.html')
})

app.post('/announce', (req, res) => {
  botSay("Dungeon is starting soon! Use !join to join the dungeon!")
  res.redirect('/control.html')
})


app.post('/opendungeon', (req, res) => {
  console.log("Opening dungeon")
  dungeon.open = true;
  res.redirect('/control.html')
})


app.listen(port, () => {
  console.log(`Web UI Started at http://localhost:${port}/control.html`)
})


const wss = new WebSocketServer({ port: port + 1 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    
    const jsonObject = JSON.parse(data);
    console.log(jsonObject);
  });

  ws.send('something');
});
