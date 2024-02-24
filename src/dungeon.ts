import { Player } from "./player" 
import { dbManager } from "./db_manager"
import Client from "tmi.js";

export class Dungeon {

    twitch_client: Client
    db_manager: dbManager
    players_in_dungeon: {[key: string]: Player}

    constructor(twitch_client: Client, db_manager: dbManager) {
        console.log("Starting dungeon.ts")
        this.twitch_client = twitch_client
        this.db_manager = db_manager
        this.players_in_dungeon = {};
    }

    dungeonWelcome(senderUser, channel) { 
        this.twitch_client.say(
            channel,
            `Welcome to the dungeon, @${senderUser}!`
          );
    }

    joinDungeon(senderUser, channel) {
        if (this.players_in_dungeon.hasOwnProperty(senderUser)) {
            this.twitch_client.say(
                channel,
                `@${senderUser} is already in the dungeon >:(!!!`
              );    
        } else {
            const player = new Player(senderUser)
            this.players_in_dungeon[senderUser] = player
            this.twitch_client.say(
                channel,
                `@${senderUser} is now in the dungeon!`
              );    
        }
    }

    getDungeon(channel) {
        const player_names = Object.keys(this.players_in_dungeon)
        if (player_names.length == 0){
            this.twitch_client.say(
                channel,
                `There are no players in the dungeon :(`
              );    
        } else {
            this.twitch_client.say(
                channel,
                `Players in dungeon: ${player_names}`
              );    
        }
    }

    runDungeon(channel) {
        for (let playerName in this.players_in_dungeon) {
            const playerObj = this.players_in_dungeon[playerName];
            const xp = Math.floor(Math.random() * 100)
            const gold = Math.floor(Math.random() * 10)

            this.twitch_client.say(
                channel,
                `Wow! Looks like ${playerName} just got ${xp} xp and ${gold} gold!`
              );
            
            playerObj.gold += gold
            const level_up = playerObj.addxp(xp)

            if (level_up) {
                this.twitch_client.say(
                    channel,
                    `${playerName} is now level ${playerObj.level}. Lets gooo!`
                  );
    
            }

            this.players_in_dungeon[playerName] = playerObj
        }

        this.db_manager.persist_all(this.players_in_dungeon)
    }

    getStats(senderUser, channel) {
        if (this.players_in_dungeon.hasOwnProperty(senderUser)) {
            const playerObj = this.players_in_dungeon[senderUser];
            this.twitch_client.say(
                channel,
                `${senderUser} is level ${playerObj.level}. They have ${playerObj.xp} xp and ${playerObj.gold} gold!`
              );

        } else {
            this.twitch_client.say(
            channel,
            `@${senderUser} hs nothing... Maybe consider entering a dungeon`
            );    
        }
    }

}

