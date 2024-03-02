import { Player } from './player' 
import { dbManager } from './db_manager'

export class Dungeon {

  db_manager: dbManager
  players_in_dungeon: {[key: string]: Player}

  constructor(db_manager: dbManager) {
    console.log('Starting dungeon.ts')
    this.db_manager = db_manager
    this.players_in_dungeon = {}
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
    if (userName in this.players_in_dungeon) {
      say(`@${userName} is already in the dungeon >:(!!!`)    
    } else {
      const playerObj = await this.add_or_update_player(userName)
      this.players_in_dungeon[userName] = playerObj
      say(`@${userName} is now in the dungeon!`)    
    }
  }

  runDungeon(params, { say }) {
    console.log('Running dungeon')
    let levelscore = 0
    for (const playerName in this.players_in_dungeon) {
      const playerObj = this.players_in_dungeon[playerName]
      levelscore += playerObj.level
    }

    const difficulty_scale = {
      'easy': 3,
      'medium': 6,
      'hard': 10
    }

    let difficulty
    if (params.length === 0) {
      difficulty = difficulty_scale['medium']
    } else {
      if (!(params[0] in difficulty_scale)) {
        say(`ERROR: Difficulty ${params[0]} not found!`)
        return
      }
      difficulty = difficulty_scale[params[0]]
    }
    
    const random_difficulty_mod = Math.random() + 0.5
    difficulty *= random_difficulty_mod

    console.log(`Levels needed is ${Math.floor(difficulty)}`)

    if (levelscore > difficulty) {
      console.log("Dungeon passed")
      for (const playerName in this.players_in_dungeon) {
        const playerObj = this.players_in_dungeon[playerName]
        const xp = Math.floor(Math.random() * 100)
        const gold = Math.floor(Math.random() * 10)
  
        say(`Wow! Looks like ${playerName} just got ${xp} xp and ${gold} gold!`)
              
        playerObj.gold += gold
        const level_up = playerObj.addxp(xp)
  
        if (level_up) say(`${playerName} is now level ${playerObj.level}. Lets gooo`)
      }

      this.db_manager.persist_all(this.players_in_dungeon)
    } else {
      console.log("Dungeon Failed")
      say(`The dungeon was too powerful...`)
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

}

