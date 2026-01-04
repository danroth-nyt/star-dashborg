// Enemy Ship Data for Space Combat
// Based on Star Borg GM Guide

// Greek letters for auto-naming spawned units
export const GREEK_LETTERS = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ'];

// Enemy ship templates
export const ENEMY_SHIPS = {
  hunterFighter: {
    id: 'hunterFighter',
    name: 'Hunter Fighter',
    hp: 6,
    morale: 7,
    moraleBoosted: 8, // When 4+ in group (Squadthink)
    armor: 0,
    weapon: { name: 'Turbo Laser', damage: '1d6', diceCount: 1, diceSides: 6 },
    hyperdrive: false,
    traits: ['Mass Produced', 'Squadthink'],
    description: 'Mass-produced Legion fighters. A single hit destroys them.',
    fodder: true, // One successful hit always reduces HP to 0
    dr: 12, // Difficulty rating to defend against
  },
  predatorLeader: {
    id: 'predatorLeader',
    name: 'Predator Leader',
    hp: 12,
    morale: 10,
    armor: 2,
    weapon: { name: 'Particle Beam', damage: '1d8', diceCount: 1, diceSides: 8 },
    hyperdrive: true,
    traits: ['Elite'],
    description: 'Elite Legion command ship. DR14 to defend against.',
    fodder: false,
    dr: 14, // Elite = DR14
  },
  dreadnought: {
    id: 'dreadnought',
    name: 'Dreadnought Carrier',
    hp: null, // Impervious
    morale: null, // No morale
    armor: null, // Cannot be damaged normally
    weapon: { name: 'Turbo Cannon Batteries', damage: '1d10', diceCount: 1, diceSides: 10 },
    hyperdrive: true,
    traits: ['Impervious', 'Heartless'],
    description: 'Massive carrier. Cannot be destroyed by fighters - plot device ship.',
    fodder: false,
    dr: 12,
    special: 'Rebels can stay out of range for 1 round with DR12 AGI test instead of taking action.',
  },
  pirateMarauder: {
    id: 'pirateMarauder',
    name: 'Pirate Marauder',
    hp: 12,
    morale: 7,
    armor: 1,
    weapon: { name: 'Twin Turbo Turrets', damage: '1d8', diceCount: 1, diceSides: 8, advantage: true },
    hyperdrive: true,
    traits: ['Communications Disruption', 'Boarding Airlock'],
    description: 'Pirate raider with jamming and boarding capabilities.',
    fodder: false,
    dr: 12,
    special: 'Jamming prevents outgoing comms. Boarding in D2+1 rounds.',
  },
};

// Fighter build variations (roll d6)
export const FIGHTER_BUILDS = {
  sleekInterceptor: {
    id: 'sleekInterceptor',
    name: 'Sleek Interceptor',
    roll: 1,
    effect: 'Goes first in combat (test PRS DR12 or interceptor acts first)',
    modifiers: { initiative: true },
    description: 'Incredible speed allows it to strike out of nowhere.',
  },
  bulkyInterdictor: {
    id: 'bulkyInterdictor',
    name: 'Bulky Interdictor',
    roll: 2,
    effect: 'Tractor beam prevents hyperspace jumps. Tier 2 armor.',
    modifiers: { armor: 2, tractorBeam: true },
    description: 'Tractor beam ship with heavy armor.',
  },
  flyingWing: {
    id: 'flyingWing',
    name: 'Flying Wing',
    roll: 3,
    effect: 'Disadvantage to hit for first 2 rounds of combat.',
    modifiers: { evasion: 2 }, // rounds of disadvantage
    description: 'Flat build makes it hard to target on approach.',
  },
  twinSeatBomber: {
    id: 'twinSeatBomber',
    name: 'Twin-Seat Bomber',
    roll: 4,
    effect: 'Attacks every other round with D10 bomb. Explodes on death.',
    modifiers: { 
      weapon: { name: 'Particle Bomb', damage: '1d10', diceCount: 1, diceSides: 10 },
      attackEveryOther: true,
      explodesOnDeath: true,
    },
    description: 'Deadly payload, attacks every other round.',
  },
  reconBotSaucer: {
    id: 'reconBotSaucer',
    name: 'Recon Bot Saucer',
    roll: 5,
    effect: 'Calls reinforcements from carrier in D4 rounds.',
    modifiers: { 
      weapon: { name: 'Beam Gun', damage: '1d4', diceCount: 1, diceSides: 4 },
      callsReinforcements: true,
    },
    description: 'Weak weapons but calls for backup.',
  },
  armorPlatedHull: {
    id: 'armorPlatedHull',
    name: 'Armor-Plated Hull',
    roll: 6,
    effect: 'Increase armor tier by 1.',
    modifiers: { armorBonus: 1 },
    description: 'Extra plating provides additional protection.',
  },
};

// Convert FIGHTER_BUILDS to array for random selection
export const FIGHTER_BUILDS_ARRAY = Object.values(FIGHTER_BUILDS);

// Enemy status options
export const ENEMY_STATUS = {
  active: { id: 'active', label: 'Active', color: 'cyan', icon: 'crosshair' },
  fleeing: { id: 'fleeing', label: 'Fleeing', color: 'yellow', icon: 'arrow-right' },
  surrendered: { id: 'surrendered', label: 'Surrendered', color: 'gray', icon: 'flag' },
  destroyed: { id: 'destroyed', label: 'Destroyed', color: 'red', icon: 'skull' },
};

// Armor tier damage reduction
export const ENEMY_ARMOR_TIERS = {
  0: { tier: 0, reduction: 0, dice: null, label: 'None' },
  1: { tier: 1, reduction: 2, dice: 'd2', label: 'Tier 1 (-D2)' },
  2: { tier: 2, reduction: 4, dice: 'd4', label: 'Tier 2 (-D4)' },
  3: { tier: 3, reduction: 6, dice: 'd6', label: 'Tier 3 (-D6)' },
};

// Morale rules reference
export const MORALE_RULES = {
  triggers: [
    'The leader is killed',
    'Half the group is eliminated',
    'A single enemy has only 1/3 of its HP left',
  ],
  check: 'Roll 2d6. If result > highest MRL in group, they are demoralized.',
  outcomes: [
    { roll: '1-4', result: 'Flees' },
    { roll: '5-6', result: 'Surrenders' },
  ],
  squadthink: 'If 4+ fighters in group, MRL is 8 instead of 7.',
};

// Space combat special rules
export const SPACE_COMBAT_RULES = {
  shipVsPeople: {
    title: 'Ship vs People',
    description: 'Spaceships roll double damage dice against people not in ships (e.g., D6 becomes 2D6).',
  },
  handheldVsShip: {
    title: 'Handheld vs Ships',
    description: 'Spaceships take half damage from handheld weapons dealing under D10.',
  },
  hyperdriveWarning: {
    title: 'Hyperdrive in Combat',
    description: 'Jumping to hyperspace with 4+ enemies destroys the Rebel ship!',
  },
  eliteDefense: {
    title: 'Elite Enemies',
    description: 'DR14 to defend against Elite enemies (Predator Leader, Dragoon, Bounty Hunter).',
  },
};

// Helper to create a new enemy instance
export function createEnemy(shipType, options = {}) {
  const template = ENEMY_SHIPS[shipType];
  if (!template) {
    throw new Error(`Unknown ship type: ${shipType}`);
  }

  const id = crypto.randomUUID();
  const suffix = options.suffix || '';
  const build = options.build || null;
  
  // Apply build modifiers
  let armor = template.armor;
  let weapon = { ...template.weapon };
  let traits = [...template.traits];
  
  if (build) {
    const buildData = FIGHTER_BUILDS[build];
    if (buildData) {
      traits.push(buildData.name);
      
      if (buildData.modifiers.armor !== undefined) {
        armor = buildData.modifiers.armor;
      }
      if (buildData.modifiers.armorBonus) {
        armor = (armor || 0) + buildData.modifiers.armorBonus;
      }
      if (buildData.modifiers.weapon) {
        weapon = { ...buildData.modifiers.weapon };
      }
    }
  }

  return {
    id,
    name: `${template.name}${suffix ? ' ' + suffix : ''}`,
    type: shipType,
    build,
    hp: {
      current: template.hp,
      max: template.hp,
    },
    morale: template.morale,
    armor,
    weapon,
    traits,
    status: 'active',
    notes: '',
    fodder: template.fodder,
    dr: template.dr,
    createdAt: Date.now(),
  };
}

// Helper to create multiple enemies with Greek letter suffixes
export function createEnemySquad(shipType, count, options = {}) {
  const enemies = [];
  for (let i = 0; i < count && i < GREEK_LETTERS.length; i++) {
    enemies.push(createEnemy(shipType, {
      ...options,
      suffix: GREEK_LETTERS[i],
    }));
  }
  return enemies;
}

// Roll random fighter build
export function rollFighterBuild() {
  const roll = Math.floor(Math.random() * 6);
  return FIGHTER_BUILDS_ARRAY[roll];
}

// Roll morale check (2d6 vs MRL)
export function rollMoraleCheck(morale) {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  const total = die1 + die2;
  const demoralized = total > morale;
  
  let outcome = null;
  if (demoralized) {
    const outcomeRoll = Math.floor(Math.random() * 6) + 1;
    outcome = outcomeRoll <= 4 ? 'flees' : 'surrenders';
  }
  
  return {
    dice: [die1, die2],
    total,
    morale,
    demoralized,
    outcome,
  };
}

// Roll weapon damage
export function rollWeaponDamage(weapon, advantage = false) {
  const { diceCount, diceSides } = weapon;
  const rolls = [];
  
  for (let i = 0; i < diceCount; i++) {
    if (advantage) {
      const roll1 = Math.floor(Math.random() * diceSides) + 1;
      const roll2 = Math.floor(Math.random() * diceSides) + 1;
      rolls.push({ roll1, roll2, best: Math.max(roll1, roll2) });
    } else {
      rolls.push(Math.floor(Math.random() * diceSides) + 1);
    }
  }
  
  const total = advantage 
    ? rolls.reduce((sum, r) => sum + r.best, 0)
    : rolls.reduce((sum, r) => sum + r, 0);
  
  return {
    weapon: weapon.name,
    damage: weapon.damage,
    rolls,
    total,
    advantage,
  };
}

// Calculate damage after armor reduction
export function calculateDamageAfterArmor(damage, armorTier) {
  if (armorTier === 0 || armorTier === null) {
    return { finalDamage: damage, reduction: 0, armorRoll: null };
  }
  
  const armorData = ENEMY_ARMOR_TIERS[armorTier];
  if (!armorData || !armorData.reduction) {
    return { finalDamage: damage, reduction: 0, armorRoll: null };
  }
  
  // Roll armor reduction die
  const armorRoll = Math.floor(Math.random() * armorData.reduction) + 1;
  const finalDamage = Math.max(0, damage - armorRoll);
  
  return {
    finalDamage,
    reduction: armorRoll,
    armorRoll,
    armorDie: armorData.dice,
  };
}
