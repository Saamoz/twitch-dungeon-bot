export class Player {
  gold: number
  xp: number
  level: number
  name: string

  level_thresholds = {
    1: 100,
    2: 200,
    3: 400
  }
   
  constructor(name, gold=0, xp=0, level=1) {
    this.name = name
    this.gold = gold
    this.xp = xp
    this.level = level
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