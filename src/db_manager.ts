import { Player } from './player' 
import { Database } from 'bun:sqlite'

export class dbManager {
  db: Database

  constructor(db_path) {
    const db = new Database(db_path)
    console.log('Connected to the database.')
    db.run('CREATE TABLE IF NOT EXISTS players(name TEXT PRIMARY KEY, gold data_type INTEGER, xp data_type INTEGER, level data_type INTEGER)')
    this.db = db
  }

  write_data(player: typeof Player) {
    console.log(`Writing data for player ${player.name}`)
  }

  persist_all(player_dict) {
    for (const key in player_dict) {
      const playerObj = player_dict[key]

      const insertStatement = `INSERT OR REPLACE INTO players (name, gold, xp, level) VALUES ('${playerObj.name}', ${playerObj.gold}, ${playerObj.xp}, ${playerObj.level})`
      this.db.run(insertStatement)
    }

  }

  async get_player(playerName) : Promise<Player> {
    const getStatement = 'SELECT name, gold, xp, level FROM players WHERE name=$name'
    
    return new Promise((resolve, _) => {
      const result = this.db.query(getStatement).get({ $name: playerName })
      if (result === undefined) throw Error
      if (result === null) { return resolve(new Player(playerName)) }
      else {return resolve(new Player(result['name'], result['gold'], result['xp'], result['level']))}
    })
  }

}