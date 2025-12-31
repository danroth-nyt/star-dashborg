// ==========================================
// STARFORGED ORACLES
// Source: Ironsworn: Starforged by Shawn Tomkin
// ==========================================

import { rollDice } from './oracles';

// ==========================================
// INCITING INCIDENT
// Roll 1d100 (we use 19 entries from original table)
// ==========================================

export const sfIncitingIncidents = [
  { incident: "Aid a starship caught in a spacetime fracture." },
  { incident: "Broker peace between two feuding settlements." },
  { incident: "Chart a new passage between isolated settlements." },
  { incident: "Defend the people of a beleaguered settlement against raiders." },
  { incident: "Discover who sabotaged a settlement's air processors." },
  { incident: "Escort a tradeship carrying prized cargo." },
  { incident: "Ferry a rescue team to a perilous disaster site." },
  { incident: "Infiltrate a fortified base to steal crucial data." },
  { incident: "Investigate terrifying manifestations at a remote settlement." },
  { incident: "Locate a downed spacer on an uninhabited planet." },
  { incident: "Protect a fugitive from a relentless bounty hunter." },
  { incident: "Recover a cherished pre-exodus artifact from an enemy." },
  { incident: "Rescue a starship crew held captive by mutineers." },
  { incident: "Retrieve a cache of stolen weapons from a pirate ship." },
  { incident: "Sabotage an enemy installation." },
  { incident: "Search for a missing expedition in the depths of a precursor vault." },
  { incident: "Shield a wondrous lifeform from those who seek to destroy it." },
  { incident: "Track and slay a marauding beast." },
  { incident: "Transport a displaced people to their new home." }
];

// Mark which entry overlaps with PV's "Prison Break" for conditional filtering
// This is index 10 in the original Starforged table (not in our filtered list)
// We've already removed it, so no need to mark

// ==========================================
// GENERATOR FUNCTIONS
// ==========================================

// Generate Starforged Inciting Incident
export function generateSFIncitingIncident() {
  const roll = rollDice(sfIncitingIncidents.length);
  const result = sfIncitingIncidents[roll - 1];
  
  return {
    roll,
    incident: result.incident,
    source: 'starforged'
  };
}
