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
    hpDice: { count: 3, sides: 6, modifier: 0, ignoreSTR: true }, // METAL: Roll 3d6 for HP (no STR)
    destinyDice: { count: 1, sides: 2 },
    statModifiers: {
      agi: { count: 3, sides: 6, modifier: -2 }, // CLUMSY: Roll 3d6-2 for AGI
    },
    special: 'Bot Repair Rules: Must destroy mechanical equipment to benefit from rest',
    specialRules: [
      { name: 'METAL', description: 'Roll 3d6 for HP (no STR modifier)' },
      { name: 'CLUMSY', description: 'Roll 3d6-2 for AGI' },
      { name: 'BOT REPAIR RULES', description: 'Must destroy a piece of mechanical equipment to use its components to benefit from rest. Roll with advantage if a Technician helps.' }
    ],
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
    specialRules: [
      { name: 'HARDENED', description: 'Roll 3d6+2 for STR' },
      { name: 'SOFT SPOT', description: 'You have a soft spot for certain types. They remind you of happier times. Regain a Destiny Point if you help them (but look tough while doing it). Discard your Heirloom Weapon if you don\'t.' }
    ],
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
    specialRules: [
      { name: 'WISE', description: 'Roll 3d6+2 for KNW' },
      { name: 'DRAGOON TEST', description: 'Each time you use Magi Arts or ignite Blazer Sword, roll D20. If you roll equal to or below threshold (starts at 5), the Dragoons sense your presence. The threshold increases by 1 each time you use these powers.' },
      { name: 'BURNER IDENTITY', description: 'You are in hiding. Your Burner Identity has a quirk that triggers on ability test failures. Roll with advantage when a Youngster is close by.' },
      { name: 'BLAZER SWORD', description: 'Your Magi weapon - retractable beam of energy (2D6 damage)' }
    ],
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
    specialRules: [
      { name: 'SWINDLER', description: 'Roll 3d6+2 for PRS. Regain 1 Destiny Point when you lie your way out of a problem.' },
      { name: 'SCUM', description: 'Roll D20 whenever you arrive at a new spaceport. On a blunder, you inconveniently run into an "old friend" who wants payback.' },
      { name: 'HUNK OF JUNK', description: 'You own a ramshackle but trustworthy ship.' },
      { name: 'CONTRABAND', description: 'You are smuggling contraband with Containment Points. When you roll a blunder on any test, reduce Containment Points by 1. When it reaches 0, contraband is no longer salable or safe.' }
    ],
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
    specialRules: [
      { name: 'HANDY', description: 'Roll 3d6+2 for KNW' },
      { name: 'SPACEY', description: 'Roll 3d6-1 for PRS' },
      { name: 'HACK JOB RULES', description: 'Invent flimsy devices with bizarrely jerry-rigged components. To make a device that works for a single round, destroy two mechanical items and combine their components. Flip a coin: heads it works, tails it doesn\'t.' },
      { name: 'JUNK DRAWER', description: 'You have D4 extra inventory slots for small broken machines to be sacrificed for Hack Job parts.' }
    ],
  },
  youngster: {
    id: 'youngster',
    name: 'Youngster',
    description: 'You are meant for bigger things. You know that your family tree has greatness in it.',
    hpDice: { count: 1, sides: 8, modifier: 0 }, // Standard STR + D8
    destinyDice: { count: 1, sides: 4 }, // LUCKY: Roll D4 for Destiny Points
    statModifiers: {},
    special: 'Has an heirloom item from their mysterious past',
    specialRules: [
      { name: 'LUCKY', description: 'Roll D4 for Destiny Points (instead of D2)' },
      { name: 'MYSTERIOUS PAST', description: 'Tragedy struck your guardians. You have an heirloom from your mysterious lineage.' },
      { name: 'KNACK', description: 'You have a special knack or skill from your upbringing.' }
    ],
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
