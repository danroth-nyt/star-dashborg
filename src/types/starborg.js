/**
 * Star Borg Game System Type Definitions
 * Based on Star Borg Rebel Handbook v1.1
 */

// ============================================
// STATS
// ============================================

export const STATS = {
  AGI: {
    id: 'agi',
    name: 'Agility',
    shortName: 'AGI',
    description: 'Sneak, Dodge, Pilot, Throw',
    abilities: ['Sneak', 'Dodge', 'Pilot', 'Throw'],
  },
  KNW: {
    id: 'knw',
    name: 'Knowledge',
    shortName: 'KNW',
    description: 'Tech, Search, Magi Arts',
    abilities: ['Tech', 'Search', 'Magi Arts'],
  },
  PRS: {
    id: 'prs',
    name: 'Presence',
    shortName: 'PRS',
    description: 'Charm, Bluff, Fire Blaster',
    abilities: ['Charm', 'Bluff', 'Fire Blaster'],
  },
  STR: {
    id: 'str',
    name: 'Strength',
    shortName: 'STR',
    description: 'Strike, Wrestle, Lift, Endure',
    abilities: ['Strike', 'Wrestle', 'Lift', 'Endure'],
  },
};

// ============================================
// CHARACTER CLASSES
// ============================================

export const CHARACTER_CLASSES = {
  bot: {
    id: 'bot',
    name: 'Bot',
    description: 'Curse the Maker! Your clanking body of servos and circuits can barely manage stairs.',
    hpDice: { count: 3, sides: 6, modifier: 0 },
    destinyDice: { count: 1, sides: 2 },
    statModifiers: {
      agi: { count: 3, sides: 6, modifier: -2 }, // CLUMSY: Roll 3d6-2 for AGI
    },
    special: 'Bot Repair Rules: Must destroy mechanical equipment to benefit from rest',
  },
  bountyHunter: {
    id: 'bountyHunter',
    name: 'Bounty Hunter',
    description: "You've been to one end of the Galaxy to the next, caught a lot of bounties.",
    hpDice: { count: 1, sides: 8, modifier: 0 }, // Standard STR + D8
    destinyDice: { count: 1, sides: 2 },
    statModifiers: {
      str: { count: 3, sides: 6, modifier: 2 }, // HARDENED: Roll 3D6+2 for STR
    },
    special: 'Has a soft spot for certain types of people',
  },
  magiKnight: {
    id: 'magiKnight',
    name: 'Magi Knight',
    description: 'For a thousand generations, the Magi Knights were the guardians of peace.',
    hpDice: { count: 1, sides: 8, modifier: 0 }, // Standard STR + D8
    destinyDice: { count: 1, sides: 2 },
    statModifiers: {
      knw: { count: 3, sides: 6, modifier: 2 }, // WISE: Roll 3D6+2 for KNW
    },
    special: 'Has Blazer Sword and Magi Arts, but risks Dragoon detection',
  },
  smuggler: {
    id: 'smuggler',
    name: 'Smuggler',
    description: 'You look out for just one person in the galaxy, yourself.',
    hpDice: { count: 1, sides: 8, modifier: 0 }, // Standard STR + D8
    destinyDice: { count: 1, sides: 2 },
    statModifiers: {
      prs: { count: 3, sides: 6, modifier: 2 }, // SWINDLER: Roll 3D6+2 for PRS
    },
    special: 'Owns a ramshackle ship and carries contraband',
  },
  technician: {
    id: 'technician',
    name: 'Technician',
    description: "It's not your fault! The life support was repaired with gardening equipment!",
    hpDice: { count: 1, sides: 8, modifier: 0 }, // Standard STR + D8
    destinyDice: { count: 1, sides: 2 },
    statModifiers: {
      knw: { count: 3, sides: 6, modifier: 2 }, // HANDY: Roll 3D6+2 for KNW
      prs: { count: 3, sides: 6, modifier: -1 }, // SPACEY: Roll 3D6-1 for PRS
    },
    special: 'Can invent flimsy devices with Hack Job rules',
  },
  youngster: {
    id: 'youngster',
    name: 'Youngster',
    description: 'You are meant for bigger things. You know that your family tree has greatness in it.',
    hpDice: { count: 1, sides: 8, modifier: 0 }, // Standard STR + D8
    destinyDice: { count: 1, sides: 4 }, // LUCKY: Roll D4 for Destiny Points
    statModifiers: {},
    special: 'Has an heirloom item from their mysterious past',
  },
};

// ============================================
// SPECIES
// ============================================

export const SPECIES = [
  {
    id: 'baselineHuman',
    name: 'Baseline Human',
    description: 'Standard galactic citizen',
  },
  {
    id: 'woolyAnthrosquatch',
    name: 'Wooly Anthrosquatch',
    description: 'Large, hairy bipedal creature',
  },
  {
    id: 'fishEyedIchthyoid',
    name: 'Fish-eyed Ichthyoid',
    description: 'Aquatic humanoid with large eyes',
  },
  {
    id: 'scaleyLacertian',
    name: 'Scaley Lacertian',
    description: 'Reptilian species with scales',
  },
  {
    id: 'flatheadedTricladid',
    name: 'Flatheaded Tricladid',
    description: 'Creature with distinctive flat head',
  },
  {
    id: 'runtishZinto',
    name: 'Runtish Zinto',
    description: 'Small but resilient species',
  },
  {
    id: 'suckerLippedAnuran',
    name: 'Sucker-lipped Anuran',
    description: 'Amphibian-like with sucker lips',
  },
  {
    id: 'flightlessMacrobat',
    name: 'Flightless Macrobat',
    description: 'Large bat-like creature that cannot fly',
  },
  {
    id: 'lithePseudopoid',
    name: 'Lithe Pseudopoid',
    description: 'Flexible and agile species',
  },
  {
    id: 'littleUrsanid',
    name: 'Little Ursanid',
    description: 'Small bear-like creature',
  },
];

// ============================================
// DIFFICULTY RATINGS
// ============================================

export const DIFFICULTY_RATINGS = {
  ROUTINE: 8,
  EASY: 10,
  NORMAL: 12,
  DIFFICULT: 14,
  REALLY_COMPLICATED: 16,
  NEARLY_IMPOSSIBLE: 18,
};

// ============================================
// ARMOR TIERS
// ============================================

export const ARMOR_TIERS = {
  NONE: { tier: 0, name: 'None', damageReduction: { count: 0, sides: 0 } },
  LIGHT: { tier: 1, name: 'Light Armor', damageReduction: { count: 1, sides: 2 } },
  MEDIUM: { tier: 2, name: 'Medium Armor', damageReduction: { count: 1, sides: 4 } },
  HEAVY: { tier: 3, name: 'Heavy Armor', damageReduction: { count: 1, sides: 6 } },
};

// ============================================
// JSDOC TYPE DEFINITIONS
// ============================================

/**
 * @typedef {Object} CharacterStats
 * @property {number} agi - Agility modifier (-3 to +3)
 * @property {number} knw - Knowledge modifier (-3 to +3)
 * @property {number} prs - Presence modifier (-3 to +3)
 * @property {number} str - Strength modifier (-3 to +3)
 */

/**
 * @typedef {Object} EquipmentItem
 * @property {string} id
 * @property {string} name
 * @property {string} type - 'weapon', 'armor', 'gear', etc.
 * @property {Object} [damage] - { count: number, sides: number }
 * @property {Array<string>} [tags] - ['bulky', 'reload', 'shoddy', etc.]
 * @property {string} [description]
 */

/**
 * @typedef {Object} Character
 * @property {string} id - Unique identifier
 * @property {string} user_id - References auth.users
 * @property {string} room_code - References rooms table
 * @property {string} name - Character name
 * @property {string} class - Class ID (bot, bountyHunter, etc.)
 * @property {string} species - Species ID
 * @property {CharacterStats} stats - Ability score modifiers
 * @property {number} hp_current - Current hit points
 * @property {number} hp_max - Maximum hit points
 * @property {number} destinyPoints - Current destiny points
 * @property {Array<EquipmentItem>} equipment - Character's equipment
 * @property {number} bits - Whether character has bits (0 or 1)
 * @property {Object} [classFeatures] - Class-specific features and abilities
 * @property {string} [motivation] - Rebel motivation
 */

/**
 * @typedef {Object} DiceRoll
 * @property {number} count - Number of dice
 * @property {number} sides - Number of sides per die
 * @property {number} [modifier] - Modifier to add to total
 */
