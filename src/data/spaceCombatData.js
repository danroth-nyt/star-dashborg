// Space Combat Station and Action Definitions

export const STATIONS = {
  pilot: {
    id: 'pilot',
    name: 'Pilot',
    maxAssignments: 1,
    description: 'Controls ship movement and evasion',
    actions: ['steady', 'fixedBeamCannon', 'evade'],
  },
  copilot: {
    id: 'copilot',
    name: 'Co-Pilot',
    maxAssignments: 1,
    description: 'Targeting systems and torpedoes',
    actions: ['targetLock', 'fireTorpedo', 'jamming'],
  },
  engineer1: {
    id: 'engineer1',
    name: 'Engineer',
    maxAssignments: 1,
    description: 'Ship systems and repairs',
    actions: ['repairShield', 'loadTorpedo', 'hyperdriveJump', 'deflectors'],
  },
  engineer2: {
    id: 'engineer2',
    name: 'Engineer',
    maxAssignments: 1,
    description: 'Ship systems and repairs',
    actions: ['repairShield', 'loadTorpedo', 'hyperdriveJump', 'deflectors'],
  },
  gunner1: {
    id: 'gunner1',
    name: 'Gunner 1',
    maxAssignments: 1,
    description: 'Laser turret operations',
    actions: ['fireLaserTurret', 'deflectors'],
  },
  gunner2: {
    id: 'gunner2',
    name: 'Gunner 2',
    maxAssignments: 1,
    description: 'Laser turret operations',
    actions: ['fireLaserTurret', 'deflectors'],
  },
};

export const ACTIONS = {
  // PILOT ACTIONS
  steady: {
    id: 'steady',
    name: 'Steady',
    type: 'support',
    ability: 'KNW',
    dr: 12,
    description: 'Test KNW to grant advantage to the next attack test against an enemy',
    effect: 'Next ally attack has advantage',
  },
  fixedBeamCannon: {
    id: 'fixedBeamCannon',
    name: 'Fixed Beam Cannon',
    type: 'attack',
    ability: 'PRS',
    dr: 12,
    damage: '1d4',
    description: 'Test PRS to fire the fixed beam cannon',
    effect: 'Deal D4 damage on success',
  },
  evade: {
    id: 'evade',
    name: 'Evade',
    type: 'defense',
    ability: 'AGI',
    dr: 12,
    description: 'Test AGI to negate incoming enemy attack',
    effect: 'Negate one incoming attack on success',
  },

  // COPILOT ACTIONS
  targetLock: {
    id: 'targetLock',
    name: 'Target Lock',
    type: 'support',
    ability: 'AGI',
    dr: 12,
    description: 'Test AGI. Reduce a single enemy\'s armor by 1 tier until end of round',
    effect: 'Reduce enemy armor by 1 tier',
  },
  fireTorpedo: {
    id: 'fireTorpedo',
    name: 'Fire Particle Torpedo',
    type: 'attack',
    ability: 'KNW',
    dr: 12,
    damage: '1d8',
    description: 'If a particle torpedo is loaded, test KNW to fire',
    effect: 'Deal D8 damage on success (requires loaded torpedo)',
    requiresTorpedo: true,
  },
  jamming: {
    id: 'jamming',
    name: 'Jamming',
    type: 'defense',
    ability: 'PRS',
    dr: 12,
    description: 'Test PRS to negate incoming enemy attack',
    effect: 'Negate one incoming attack on success',
  },

  // ENGINEER ACTIONS
  repairShield: {
    id: 'repairShield',
    name: 'Repair Shield',
    type: 'support',
    ability: 'KNW',
    dr: 12,
    description: 'Test KNW to increase Ship Armor by 1 tier (max 2)',
    effect: 'Restore 1 armor tier (max Tier 2)',
  },
  loadTorpedo: {
    id: 'loadTorpedo',
    name: 'Load Particle Torpedo',
    type: 'support',
    ability: 'STR',
    dr: 12,
    description: 'Test STR to load D2 torpedoes to fire',
    effect: 'Load 1-2 torpedoes on success',
  },
  hyperdriveJump: {
    id: 'hyperdriveJump',
    name: 'Hyperdrive Jump',
    type: 'special',
    ability: 'KNW',
    dr: 14,
    description: 'Charting, charging, and engaging takes 3 rounds. Dangerous in combat',
    effect: 'Charge 1/3 rounds. Jump at 3 rounds (may destroy ship)',
    warning: 'Jumping in combat with 4+ enemies destroys the ship!',
  },
  deflectors: {
    id: 'deflectors',
    name: 'Deflectors',
    type: 'defense',
    ability: 'PRS',
    dr: 12,
    description: 'Test PRS to negate incoming enemy attack',
    effect: 'Negate one incoming attack on success',
  },

  // GUNNER ACTIONS
  fireLaserTurret: {
    id: 'fireLaserTurret',
    name: 'Fire Laser Turret',
    type: 'attack',
    ability: 'AGI',
    dr: 12,
    damage: '1d6',
    description: 'Test AGI to fire the laser turret',
    effect: 'Deal D6 damage on success',
  },
};

export const ARMOR_TIERS = [
  {
    tier: 0,
    name: 'No Armor',
    damage: 0,
    description: 'No damage negation',
    color: 'red',
  },
  {
    tier: 1,
    name: 'Tier 1',
    damage: 2,
    description: '-D2 damage',
    color: 'yellow',
  },
  {
    tier: 2,
    name: 'Tier 2',
    damage: 4,
    description: '-D4 damage',
    color: 'cyan',
  },
  {
    tier: 3,
    name: 'Tier 3',
    damage: 6,
    description: '-D6 damage (max)',
    color: 'cyan',
  },
];

export const SHIP_UPGRADES = {
  boosterRockets: {
    id: 'boosterRockets',
    name: 'Booster Rockets',
    description: 'The Steady action affects the next D2 attacks against enemies',
    effect: 'steady_multi',
  },
  torpedoWinch: {
    id: 'torpedoWinch',
    name: 'Particle Torpedo Winch',
    description: 'Any station can Load Particle Torpedoes with a KNW test',
    effect: 'load_any_station',
  },
  overchargeShields: {
    id: 'overchargeShields',
    name: 'Overcharge Shields',
    description: 'At start shields are Tier 2, but can be moved up to Tier 3 by repairing',
    effect: 'max_tier_3',
  },
  turboLasers: {
    id: 'turboLasers',
    name: 'Turbo Laser Turrets',
    description: 'Choose a Gunner Station to deal D8 damage instead of D6',
    effect: 'gunner_d8',
  },
};

export const COMBAT_RULES = {
  initiative: {
    title: 'Initiative',
    description: 'Roll a dice. ODD: Enemies go first. EVEN: Rebels go first.',
  },
  rounds: {
    title: 'Rounds',
    description: 'A round is enough time to make an attack and change stations. Usually 10 rounds in one minute.',
  },
  stationChange: {
    title: 'Changing Stations',
    description: 'It takes one round to change to a different Station.',
  },
  armorDegradation: {
    title: 'Armor Degradation',
    description: 'When a Rebel fails a defense roll, the Ship Armor reduces by 1 Tier for the next attack that hits.',
  },
  shipDestruction: {
    title: 'Ship Destruction',
    description: 'If all Rebels aboard are killed or incapacitated, the ship is captured or destroyed.',
  },
};

export const SOLO_RULES = {
  description: 'Solo Rebels control all Space Ship stations and can make two Space Combat actions per turn.',
  actionsPerTurn: 2,
};

export const DAMAGE_DICE = {
  d2: { sides: 2, min: 1, max: 2 },
  d4: { sides: 4, min: 1, max: 4 },
  d6: { sides: 6, min: 1, max: 6 },
  d8: { sides: 8, min: 1, max: 8 },
  d10: { sides: 10, min: 1, max: 10 },
  d12: { sides: 12, min: 1, max: 12 },
};
