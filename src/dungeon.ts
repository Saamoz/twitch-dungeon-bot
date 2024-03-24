import { Player } from './player' 
import { dbManager } from './db_manager'

export class Dungeon {

  db_manager: dbManager
  players_in_dungeon: {[key: string]: Player}
  open: boolean
  store_open: boolean

  constructor(db_manager: dbManager) {
    console.log('Starting dungeon.ts')
    this.db_manager = db_manager
    this.players_in_dungeon = {}
    this.open = false
    this.store_open = false
  }

  async add_or_update_player(playerName) {
    const playerObj = await this.db_manager.get_player(playerName)
    return playerObj
  }

  dungeonWelcome(_, { reply }) { 
    reply('Welcome to the dungeon, ')
  }

  async joinDungeon(_, { userName, say }) {
    console.log(`${userName} joining dungeon`)
    if (!this.open) {
      say('The dungeon is closed! Ask the Doe to open it.')    
    } else {
      if (userName in this.players_in_dungeon) {
        say(`@${userName} is already in the dungeon >:(!!!`)    
      } else {
        const playerObj = await this.add_or_update_player(userName)
        this.players_in_dungeon[userName] = playerObj
        say(`@${userName} is now in the dungeon!`)    
      }
    }
  }

  runDungeon(difficulty, say) {
    console.log('Running dungeon')
    let levelscore = 0
    for (const playerName in this.players_in_dungeon) {
      const playerObj = this.players_in_dungeon[playerName]
      levelscore += playerObj.level
    }
    
    const random_difficulty_mod = Math.random() + 0.5
    difficulty *= random_difficulty_mod

    console.log(`Levels needed is ${Math.floor(difficulty)}`)

    if (levelscore > difficulty) {
      console.log('Dungeon passed')
      for (const playerName in this.players_in_dungeon) {
        const playerObj = this.players_in_dungeon[playerName]
        const xp = Math.floor(Math.random() * difficulty * 10)
        const gold = Math.floor(Math.random() * difficulty)
  
        say(`Wow! Looks like ${playerName} just got ${xp} xp and ${gold} gold!`)
              
        playerObj.gold += gold
        const level_up = playerObj.addxp(xp)
  
        if (level_up) say(`${playerName} is now level ${playerObj.level}. Lets gooo`)
      }

      this.db_manager.persist_all(this.players_in_dungeon)
    } else {
      console.log('Dungeon Failed')
      say('The dungeon was too powerful...')
    }
    this.players_in_dungeon = {}
  }

  async getStats(_, { userName, reply }) {
    console.log(`Getting ${userName} stats`)
    const playerObj = await this.add_or_update_player(userName)
    if (playerObj.gold == 0 && playerObj.xp == 0 && playerObj.level == 1) {
      reply(`@${userName} has nothing... Maybe consider entering a dungeon`)    
    } else {
      reply(`${userName} is level ${playerObj.level}. They have ${playerObj.xp} xp and ${playerObj.gold} gold!`)
    }
  }

  async buypotion(_, { userName, reply }) {
    if (!this.store_open) {
      reply('The store is closed!')
    } else {
      const potionCost = 10;
      let playerObj = await this.add_or_update_player(userName)
      if (playerObj.gold >= potionCost) {
        reply(`Congrats on your new potion!`)
        playerObj.gold -= potionCost
        this.db_manager.persist_one(playerObj)
      } else {
        reply(`You need ${potionCost - playerObj.gold} more gold to afford a potion!`)
      }
    }
  }

}

