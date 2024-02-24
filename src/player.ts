export class Player {
    gold: number;
    xp: number;
    level: number;
    name: string;

    level_thresholds = {
        1: 100,
        2: 200,
        3: 400
    }
   
    constructor(name) {
        this.gold = 0;
        this.xp = 0;
        this.level = 1;
        this.name = name;
    }

    addxp(amount) : boolean {
        this.xp += amount
        if (this.xp > this.level_thresholds[this.level]) {
            this.xp -= this.level_thresholds[this.level]
            this.level += 1
            return true
        }
        return false
    }
}  