import { Player } from "./player" 
import { Database } from "sqlite3";

export class dbManager {
  db: Database

  constructor(db_path) {
    let db = new Database(db_path, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the database.');
    });
  
  db.run('CREATE TABLE IF NOT EXISTS players(name TEXT PRIMARY KEY, gold data_type INTEGER, xp data_type INTEGER, level data_type INTEGER)');
  this.db = db
  }

  write_data(player: typeof Player) {
    console.log(`Writing data for player ${player.name}`)
  }

  persist_all(player_dict) {
    for (let key in player_dict) {
      const playerObj = player_dict[key];

      const insertStatement = `INSERT OR REPLACE INTO players (name, gold, xp, level) VALUES ('${playerObj.name}', ${playerObj.gold}, ${playerObj.xp}, ${playerObj.level})`
      this.db.run(insertStatement)
    }

  }

  get_player(playerName) : typeof Player {
    const getStatement = 'SELECT name, gold, xp, level FROM players WHERE name=?'

    let playerObj;
    
    this.db.get(getStatement, [playerName], (error, row) => {
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
      console.log(row)
      playerObj = new Player(row['name'], row['gold'], row['xp'], row['level'])
    })

    return playerObj
  }
}