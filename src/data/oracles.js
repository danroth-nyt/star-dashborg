// Oracle tables - These will be populated from the Star Borg PDFs
// For now, we have placeholder structure and some sample data

export const oracleTables = {
  spaceMishaps: [
    'Asteroid field detected',
    'Ship systems malfunction',
    'Hostile vessel approaching',
    'Strange anomaly detected',
    'Hull breach warning',
    'Navigation systems offline',
  ],
  npcNames: [
    'Zyx the Enforcer',
    'Captain Vorg',
    'Dr. Nexus',
    'Rebel Scout K-7',
    'Admiral Kryll',
    'The Broker',
  ],
  locations: [
    'Derelict space station',
    'Rebel outpost',
    'Imperial cruiser',
    'Mining colony',
    'Black market bazaar',
    'Abandoned research facility',
  ],
  complications: [
    'Time limit imposed',
    'Unexpected witness',
    'Equipment failure',
    'Betrayal from within',
    'Reinforcements arrive',
    'Collateral damage',
  ],
};

export const missionGenerators = {
  types: [
    'Sabotage',
    'Rescue',
    'Theft',
    'Assassination',
    'Espionage',
    'Escape',
  ],
  targets: [
    'Imperial commander',
    'Weapon prototype',
    'Prisoner',
    'Data cache',
    'Supply depot',
    'Communications hub',
  ],
  locations: [
    'Space station',
    'Planet surface',
    'Asteroid base',
    'Moving convoy',
    'Orbital platform',
    'Underground facility',
  ],
};

export const affirmationOracle = {
  yes: 'Yes',
  yesAnd: 'Yes, and...',
  no: 'No',
  noAnd: 'No, but...',
};

// Roll on a table
export function rollTable(tableId) {
  const table = oracleTables[tableId];
  if (!table || table.length === 0) {
    return 'Table not found or empty';
  }
  return table[Math.floor(Math.random() * table.length)];
}

// Roll dice
export function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Roll multiple dice
export function rollMultipleDice(count, sides) {
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollDice(sides));
  }
  return rolls;
}

// Affirmation oracle
export function rollAffirmation() {
  const roll = rollDice(6);
  if (roll === 1) return affirmationOracle.noAnd;
  if (roll <= 3) return affirmationOracle.no;
  if (roll <= 5) return affirmationOracle.yes;
  return affirmationOracle.yesAnd;
}

// Generate mission
export function generateMission() {
  return {
    type: missionGenerators.types[Math.floor(Math.random() * missionGenerators.types.length)],
    target: missionGenerators.targets[Math.floor(Math.random() * missionGenerators.targets.length)],
    location: missionGenerators.locations[Math.floor(Math.random() * missionGenerators.locations.length)],
  };
}

