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

  get_level_threshold(level) {
    return 100 * Math.pow(2, level - 1)
  }
   
  constructor(name, gold=0, xp=0, level=1) {
    this.name = name
    this.gold = gold
    this.xp = xp
    this.level = level
  }

  addxp(amount) : boolean {
    this.xp += amount
    if (this.xp > this.get_level_threshold(this.level)) {
      this.xp -= this.get_level_threshold(this.level)
      this.level += 1
      return true
    }
    return false
  }
}  