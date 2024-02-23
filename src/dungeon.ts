import { Player } from "./player" 

const in_dungeon = []

console.log("Starting dungeon.ts")

function dungeonWelcome(senderUser) {
    return `Welcome to the dungeon, @${senderUser}!`
}

function joinDungeon(senderUser) {
    const player_in_dungeon:boolean = (in_dungeon.filter((p) => p.name == senderUser)).length == 1 
    if (player_in_dungeon) {
        return `@${senderUser} is already in the dungeon >:(!!!`
    } else {
        const player = new Player(senderUser)
        in_dungeon.push(player)
        return `@${senderUser} is now in the dungeon!`
    }
}

function getDungeon() {
    if (in_dungeon.length == 0){
        return `There are no players in the dungeon :(`
    } else {
        const player_names = in_dungeon.map(p => p.name)
        return `Players in dungeon: ${player_names}`
    }
}

function runDungeon() {

}

module.exports = { dungeonWelcome, joinDungeon, getDungeon }