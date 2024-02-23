import { Player } from "./player" 
const sqlite3 = require('sqlite3')


let db = new sqlite3.Database('./db/playerdata.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

db.run('CREATE TABLE IF NOT EXISTS players(name text PRIMARY KEY, gold data_type DEFAULT 0, xp data_type DEFAULT 0)');


function write_data(player: typeof Player) {
    console.log(`Writing data for player ${player.name}`)

}