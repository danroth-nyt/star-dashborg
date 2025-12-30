// Ship Shop Data - Purchasable Upgrades and Torpedo Types
// From Star Borg Rulebook p. 24 - "What A Piece Of Junk!"

export const TORPEDO_TYPES = {
  standard: {
    id: 'standard',
    name: 'Standard Particle Torpedo',
    damage: '1d8',
    description: 'Standard issue particle torpedo',
    effect: 'Deal D8 damage on hit',
    cost: 0, // Loaded during combat
    category: 'torpedo',
  },
  cluster: {
    id: 'cluster',
    name: 'Cluster Torpedo',
    damage: '1d4',
    description: 'Up to 3 targets, roll to hit and for damage once for each target',
    effect: 'Hit up to 3 different targets with D4 damage each',
    cost: 2,
    category: 'torpedo',
    special: 'multi_target',
  },
  hunterKiller: {
    id: 'hunterKiller',
    name: 'Hunter-Killer Torpedo',
    damage: '1d8',
    description: 'Advanced targeting system rolls with advantage to hit and damage',
    effect: 'Roll with advantage for both hit and damage',
    cost: 2,
    category: 'torpedo',
    special: 'advantage',
  },
  chaff: {
    id: 'chaff',
    name: 'Chaff Torpedo',
    damage: '0',
    description: 'All rebels make defensive tests with advantage, attack tests with disadvantage for a full round',
    effect: 'Defensive screen - advantage on defense, disadvantage on attacks',
    cost: 1,
    category: 'torpedo',
    special: 'defensive',
  },
  ion: {
    id: 'ion',
    name: 'Ion Torpedo',
    damage: '1d8',
    description: 'Permanently reduces a target\'s shield tier by 1',
    effect: 'D8 damage + permanently reduces enemy armor by 1 tier',
    cost: 2,
    category: 'torpedo',
    special: 'armor_reduction',
  },
};

export const TURRET_UPGRADES = {
  gravityCatapult: {
    id: 'gravityCatapult',
    name: 'Gravity Catapult',
    damage: '1d10',
    description: 'Requires the engineer to load an object with the "bulky" tag into the chamber. Add this to 1 gunner station.',
    effect: 'D10 damage but requires bulky items as ammo',
    cost: 2,
    category: 'turret',
    special: 'requires_ammo',
  },
  hyperRailgun: {
    id: 'hyperRailgun',
    name: 'Hyper Railgun',
    damage: '1d6',
    description: 'High-velocity projectiles that ignore all armor',
    effect: 'D6 damage that ignores enemy armor completely',
    cost: 2,
    category: 'turret',
    special: 'ignore_armor',
  },
};

export const MISC_UPGRADES = {
  smugglingCompartments: {
    id: 'smugglingCompartments',
    name: 'Smuggling Compartments',
    description: 'Hide from sight and sensors if captured or boarded',
    effect: 'Rebels can hide in secret compartments during capture/boarding',
    cost: 1,
    category: 'misc',
    special: 'stealth',
  },
  asteroidMiningDrill: {
    id: 'asteroidMiningDrill',
    name: 'Asteroid Mining Drill',
    damage: '1d8',
    description: 'Bore a tunnel through solid rock at slow speed. Pilot can attack with PRS test, but their next defense test is at disadvantage',
    effect: 'D8 damage attack but next defense has disadvantage',
    cost: 1,
    category: 'misc',
    special: 'drilling',
  },
  harpoonTowCable: {
    id: 'harpoonTowCable',
    name: 'Harpoon and Tow Cable',
    description: 'Copilot can attach magnetic harpoon to object of equal or lesser mass. If target is a piloted ship, test AGI',
    effect: 'Grapple and tow objects or enemy ships',
    cost: 1,
    category: 'misc',
    special: 'grapple',
  },
  hyperspaceDestabilizer: {
    id: 'hyperspaceDestabilizer',
    name: 'Hyperspace Destabilizer',
    description: 'Makes jumping to Hyperspace impossible in a wide area while active',
    effect: 'Prevent all hyperspace jumps in combat zone',
    cost: 1,
    category: 'misc',
    special: 'anti_hyperspace',
  },
};

export const ALL_SHOP_UPGRADES = {
  ...TORPEDO_TYPES,
  ...TURRET_UPGRADES,
  ...MISC_UPGRADES,
};

export const SHOP_CATEGORIES = [
  {
    id: 'galaxyRewards',
    name: 'Galaxy Rewards',
    description: 'Heroic upgrades earned by saving the galaxy - cannot be purchased',
    items: [], // Populated from SHIP_UPGRADES in spaceCombatData
    isHeroic: true,
  },
  {
    id: 'torpedoes',
    name: 'Torpedoes',
    description: 'Advanced munitions for devastating attacks',
    items: Object.keys(TORPEDO_TYPES).filter(key => key !== 'standard'),
  },
  {
    id: 'turrets',
    name: 'Turret Upgrades',
    description: 'Weapon system enhancements',
    items: Object.keys(TURRET_UPGRADES),
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    description: 'Utility systems and specialized equipment',
    items: Object.keys(MISC_UPGRADES),
  },
];

// Helper to get upgrade by ID
export function getUpgradeById(id) {
  return ALL_SHOP_UPGRADES[id];
}

// Helper to get all upgrades in a category
export function getUpgradesByCategory(category) {
  return Object.values(ALL_SHOP_UPGRADES).filter(
    upgrade => upgrade.category === category
  );
}
