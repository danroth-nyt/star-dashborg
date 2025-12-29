/**
 * Star Borg Dice Rolling Utilities
 * Based on Star Borg Rebel Handbook v1.1
 */

/**
 * Roll a single die with the specified number of sides
 * @param {number} sides - Number of sides on the die
 * @returns {number} - Random number between 1 and sides (inclusive)
 */
export function rollD(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll multiple dice and sum the results
 * @param {number} count - Number of dice to roll
 * @param {number} sides - Number of sides per die
 * @returns {number} - Sum of all dice rolls
 */
export function rollDice(count, sides) {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += rollD(sides);
  }
  return total;
}

/**
 * Roll 3d6 and return the sum
 * @returns {number} - Sum of three d6 rolls (3-18)
 */
export function roll3d6() {
  return rollDice(3, 6);
}

/**
 * Roll dice with a modifier
 * @param {number} count - Number of dice to roll
 * @param {number} sides - Number of sides per die
 * @param {number} modifier - Modifier to add to the total (can be negative)
 * @returns {number} - Sum of dice rolls plus modifier (minimum 1)
 */
export function rollWithModifier(count, sides, modifier = 0) {
  const roll = rollDice(count, sides) + modifier;
  return Math.max(1, roll); // Never less than 1
}

/**
 * Convert a 3d6 sum to a Star Borg ability score modifier
 * Based on the stat conversion table from the handbook
 * @param {number} sum - The sum of 3d6 (or modified dice roll)
 * @returns {number} - Ability score modifier (-3 to +3)
 */
export function sumToModifier(sum) {
  if (sum <= 4) return -3;
  if (sum <= 6) return -2;
  if (sum <= 8) return -1;
  if (sum <= 12) return 0;
  if (sum <= 14) return 1;
  if (sum <= 16) return 2;
  return 3; // 17-20+
}

/**
 * Roll a stat (3d6) and convert to modifier
 * @returns {number} - Ability score modifier (-3 to +3)
 */
export function rollStat() {
  const sum = roll3d6();
  return sumToModifier(sum);
}

/**
 * Roll a stat with modifiers (e.g., 3d6+2 for Bounty Hunter STR)
 * @param {number} count - Number of dice to roll
 * @param {number} sides - Number of sides per die
 * @param {number} modifier - Modifier to add to the roll
 * @returns {number} - Ability score modifier (-3 to +3)
 */
export function rollStatWithModifier(count, sides, modifier = 0) {
  const sum = rollWithModifier(count, sides, modifier);
  return sumToModifier(sum);
}

/**
 * Roll a d20 for tests
 * @returns {number} - Random number between 1 and 20
 */
export function rollD20() {
  return rollD(20);
}

/**
 * Roll a d20 test with advantage (roll twice, take best)
 * @returns {number} - Best of two d20 rolls
 */
export function rollWithAdvantage() {
  const roll1 = rollD20();
  const roll2 = rollD20();
  return Math.max(roll1, roll2);
}

/**
 * Roll a d20 test with disadvantage (roll twice, take worst)
 * @returns {number} - Worst of two d20 rolls
 */
export function rollWithDisadvantage() {
  const roll1 = rollD20();
  const roll2 = rollD20();
  return Math.min(roll1, roll2);
}

/**
 * Roll a test against a difficulty rating
 * @param {number} abilityScore - Character's ability score modifier
 * @param {number} dr - Difficulty Rating (8-18)
 * @param {boolean} advantage - Roll with advantage
 * @param {boolean} disadvantage - Roll with disadvantage
 * @returns {Object} - { roll, total, success, crit, blunder }
 */
export function rollTest(abilityScore, dr, advantage = false, disadvantage = false) {
  let roll;
  
  if (advantage) {
    roll = rollWithAdvantage();
  } else if (disadvantage) {
    roll = rollWithDisadvantage();
  } else {
    roll = rollD20();
  }
  
  const total = roll + abilityScore;
  const success = total >= dr;
  const crit = roll === 20;
  const blunder = roll === 1;
  
  return {
    roll,
    total,
    success,
    crit,
    blunder,
    dr,
  };
}

/**
 * Roll damage dice
 * @param {number} count - Number of dice
 * @param {number} sides - Sides per die
 * @param {Object} [armor] - Armor reduction { count, sides }
 * @returns {Object} - { damage, armorReduction, totalDamage }
 */
export function rollDamage(count, sides, armor = null) {
  const damage = rollDice(count, sides);
  let armorReduction = 0;
  
  if (armor && armor.count > 0) {
    armorReduction = rollDice(armor.count, armor.sides);
  }
  
  const totalDamage = Math.max(0, damage - armorReduction);
  
  return {
    damage,
    armorReduction,
    totalDamage,
  };
}

/**
 * Roll on a table (1-indexed)
 * @param {number} sides - Size of the table (d6, d10, etc.)
 * @returns {number} - Roll result (1 to sides)
 */
export function rollTable(sides) {
  return rollD(sides);
}

/**
 * Roll for bits (d6: 1-3 = no bits, 4-6 = has bits)
 * @returns {boolean} - True if character has bits
 */
export function rollBits() {
  return rollD(6) >= 4;
}

/**
 * Roll HP for a character
 * @param {number} strModifier - Character's STR modifier
 * @param {Object} hpDice - Class HP dice { count, sides, modifier }
 * @returns {number} - Maximum HP (minimum 1)
 */
export function rollHP(strModifier, hpDice = { count: 1, sides: 8, modifier: 0 }) {
  const roll = rollWithModifier(hpDice.count, hpDice.sides, hpDice.modifier);
  return Math.max(1, roll + strModifier);
}

/**
 * Roll destiny points
 * @param {Object} destinyDice - Class destiny dice { count, sides }
 * @returns {number} - Starting destiny points
 */
export function rollDestinyPoints(destinyDice = { count: 1, sides: 2 }) {
  return rollDice(destinyDice.count, destinyDice.sides);
}
