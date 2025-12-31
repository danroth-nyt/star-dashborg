/**
 * Star Borg Character Progression Data
 * Based on "Rebel Promotion" rules from Star Borg Rebel Handbook v1.1
 * 
 * When you save the galaxy and rest:
 * - Increase HP by D6
 * - Choose two Ability Scores to increase by 1 (max +6)
 * - Choose one class-specific advancement option
 */

import { botData, bountyHunterData, magiKnightData, smugglerData, technicianData, youngsterData } from './characterData';

// ==========================================
// CLASS ADVANCEMENT OPTIONS
// ==========================================

export const CLASS_ADVANCEMENTS = {
  bot: [
    {
      id: 'thisMeansWar',
      name: 'THIS MEANS WAR',
      description: 'Roll a Heirloom Weapon from the Bounty Hunter Class.',
      type: 'roll',
      effect: 'Gain a random Bounty Hunter Heirloom Weapon',
      implementation: 'roll_bounty_hunter_heirloom',
      repeatable: true,
    },
    {
      id: 'portableBotMind',
      name: 'PORTABLE BOT MIND',
      description: 'You can insert your consciousness and memory into another bot body. The process destroys the circuits of the body you leave. No take backs.',
      type: 'passive',
      effect: 'Ability to transfer consciousness to other bot bodies (one-way)',
      implementation: 'passive_ability',
      repeatable: false,
    },
    {
      id: 'legionTransmission',
      name: 'LEGION TRANSMISSION',
      description: 'On your next mission, you intercept a Legion transmission that reveals critical info about your enemy.',
      type: 'mission',
      effect: 'Next mission: intercept critical Legion intelligence',
      implementation: 'one_time_bonus',
      repeatable: true, // Can be taken multiple times for different missions
    },
  ],

  bountyHunter: [
    {
      id: 'inheritance',
      name: 'INHERITANCE',
      description: 'A fellow Bounty Hunter bought the vapor farm. A bot delivers their effects. Roll an additional Heirloom Weapon (reroll if you already have it).',
      type: 'roll',
      effect: 'Gain another Heirloom Weapon',
      implementation: 'roll_bounty_hunter_heirloom',
      repeatable: true,
    },
    {
      id: 'thisIsTheWay',
      name: 'THIS IS THE WAY',
      description: 'You adopt a foundling to train as a Bounty Hunter. (HP 8, Morale 7, Tier 1 Armor -D2, Zap Gun D4) The GM makes morale checks; if they fail, the foundling retreats.',
      type: 'companion',
      effect: 'Gain Foundling companion (HP 8, Morale 7, Armor T1, Zap Gun D4)',
      implementation: 'add_companion',
      repeatable: false,
      companionStats: {
        name: 'Foundling',
        hp: 8,
        morale: 7,
        armor: 1,
        weapon: 'Zap Gun (D4 damage)',
      },
    },
    {
      id: 'friendsInLowPlaces',
      name: 'FRIENDS IN LOW PLACES',
      description: 'You always know a guy in the system who owes you big. Tell the GM who it is and how you met. Roll PRS to make contact. On a blunder, they are a Legionary stooge that\'s already ratted on you.',
      type: 'passive',
      effect: 'Network of contacts in each system (PRS roll to activate)',
      implementation: 'passive_ability',
      repeatable: false,
    },
  ],

  magiKnight: [
    {
      id: 'strikeMeDown',
      name: 'STRIKE ME DOWN',
      description: 'When you are struck down, bestow your Magi Arts upon a non-bot character in the group.',
      type: 'passive',
      effect: 'On death, transfer Magi Arts to another character',
      implementation: 'passive_ability',
      repeatable: false,
    },
    {
      id: 'foresight',
      name: 'FORESIGHT',
      description: 'Regain 1 Destiny Point if you correctly guess the number you will roll on your test.',
      type: 'passive',
      effect: 'Predict roll result to regain Destiny Point',
      implementation: 'passive_ability',
      repeatable: false,
    },
    {
      id: 'highGround',
      name: 'HIGH GROUND',
      description: 'When your Dragoon Nemesis finds you, you have advantage on the first Attack and Defense roll of the combat.',
      type: 'passive',
      effect: 'Advantage on first attack/defense vs Dragoon Nemesis',
      implementation: 'passive_ability',
      repeatable: false,
    },
  ],

  smuggler: [
    {
      id: 'delusionsOfGrandeur',
      name: 'DELUSIONS OF GRANDEUR',
      description: 'Roll with advantage when you throw your name around or lie shamelessly about yourself.',
      type: 'passive',
      effect: 'Advantage on PRS tests when boasting or lying about yourself',
      implementation: 'passive_ability',
      repeatable: false,
    },
    {
      id: 'beBygones',
      name: 'BE BYGONES',
      description: 'An "old friend" or bounty hunter comes looking to bury the hatchet and work for you. HP:10 Morale: 8 Tier 1 Armor: -D2 Blaster: D6 damage.',
      type: 'companion',
      effect: 'Gain ally companion (HP 10, Morale 8, Armor T1, Blaster D6)',
      implementation: 'add_companion',
      repeatable: false,
      companionStats: {
        name: 'Reformed Rival',
        hp: 10,
        morale: 8,
        armor: 1,
        weapon: 'Blaster (D6 damage)',
      },
    },
    {
      id: 'alwaysShootsFirst',
      name: 'ALWAYS SHOOTS FIRST',
      description: 'Free attack at the start of a blaster fight.',
      type: 'passive',
      effect: 'Free attack at start of blaster combat',
      implementation: 'passive_ability',
      repeatable: false,
    },
  ],

  technician: [
    {
      id: 'moreMachine',
      name: 'MORE MACHINE',
      description: 'Roll a Bot Function from the Bot class.',
      type: 'roll',
      effect: 'Gain a random Bot Function',
      implementation: 'roll_bot_function',
      repeatable: true,
    },
    {
      id: 'superweaponSavant',
      name: 'SUPERWEAPON SAVANT',
      description: 'Recreate a portable facsimile of a Legionary Superweapon that you\'ve seen up close (has the bulky and shoddy equipment tags).',
      type: 'craft',
      effect: 'Create portable version of Legion Superweapon (bulky, shoddy)',
      implementation: 'one_time_craft',
      repeatable: true, // Can craft different superweapons
    },
    {
      id: 'alwaysCarryASpare',
      name: 'ALWAYS CARRY A SPARE',
      description: 'When tinkering with technology, you may reroll the first blunder on a KNW test.',
      type: 'passive',
      effect: 'Reroll first blunder on KNW tests when tinkering',
      implementation: 'passive_ability',
      repeatable: false,
    },
  ],

  youngster: [
    {
      id: 'rebelRenown',
      name: 'REBEL RENOWN',
      description: 'Roll a Particular Set Of Skills from the Bounty Hunter Class. It replaces your Knack, if you still have one.',
      type: 'roll',
      effect: 'Gain Bounty Hunter skill (replaces Knack)',
      implementation: 'roll_bounty_hunter_skill',
      repeatable: false,
    },
    {
      id: 'awakening',
      name: 'AWAKENING',
      description: 'Learn one Magi Art and roll one Dragoon Nemesis from the Magi Knight Class to hunt you.',
      type: 'roll',
      effect: 'Gain Magi Art + Dragoon Nemesis',
      implementation: 'roll_magi_awakening',
      repeatable: false,
    },
    {
      id: 'prettyHandy',
      name: 'PRETTY HANDY',
      description: 'Roll a Scratch Build from the Technician Class. It replaces your Knack, if you still have one.',
      type: 'roll',
      effect: 'Gain Scratch Build (replaces Knack)',
      implementation: 'roll_scratch_build',
      repeatable: false,
    },
  ],
};

// ==========================================
// PROGRESSION HELPERS
// ==========================================

/**
 * Get available advancements for a class, filtering out non-repeatable ones already taken
 */
export function getAvailableAdvancements(classId, alreadyTaken = []) {
  const classAdvancements = CLASS_ADVANCEMENTS[classId] || [];
  
  return classAdvancements.filter(advancement => {
    // If repeatable, always available
    if (advancement.repeatable) {
      return true;
    }
    
    // If not repeatable, only available if not already taken
    return !alreadyTaken.includes(advancement.id);
  });
}

/**
 * Check if a character can claim a promotion
 */
export function canClaimPromotion(character, roomGalaxiesSaved) {
  const claimed = character.galaxySavesClaimed || character.galaxy_saves_claimed || 0;
  return roomGalaxiesSaved > claimed;
}

/**
 * Get number of unclaimed promotions
 */
export function getUnclaimedPromotions(character, roomGalaxiesSaved) {
  const claimed = character.galaxySavesClaimed || character.galaxy_saves_claimed || 0;
  return Math.max(0, roomGalaxiesSaved - claimed);
}

/**
 * Validate stat increase (max +6)
 */
export function canIncreaseStat(currentValue) {
  return currentValue < 6;
}

/**
 * Get stat increase options (returns stats that can still be increased)
 */
export function getStatIncreaseOptions(stats) {
  return Object.entries(stats)
    .filter(([_, value]) => value < 6)
    .map(([stat, _]) => stat);
}

// ==========================================
// ADVANCEMENT IMPLEMENTATIONS
// ==========================================

/**
 * Roll a random item from a data table
 */
export function rollRandomItem(dataArray) {
  const index = Math.floor(Math.random() * dataArray.length);
  return dataArray[index];
}

/**
 * Implement an advancement option
 */
export function implementAdvancement(advancementId, classId) {
  const advancement = CLASS_ADVANCEMENTS[classId]?.find(a => a.id === advancementId);
  if (!advancement) return null;

  const result = {
    advancement: advancement,
    rolledFeature: null,
    companion: null,
  };

  switch (advancement.implementation) {
    case 'roll_bounty_hunter_heirloom':
      result.rolledFeature = {
        type: 'heirloom',
        ...rollRandomItem(bountyHunterData.heirlooms),
      };
      break;

    case 'roll_bounty_hunter_skill':
      result.rolledFeature = {
        type: 'skill',
        ...rollRandomItem(bountyHunterData.skills),
      };
      break;

    case 'roll_bot_function':
      result.rolledFeature = {
        type: 'function',
        ...rollRandomItem(botData.functions),
      };
      break;

    case 'roll_magi_awakening':
      result.rolledFeature = {
        type: 'magiAwakening',
        art: rollRandomItem(magiKnightData.arts),
        nemesis: rollRandomItem(magiKnightData.dragoonNemeses),
      };
      break;

    case 'roll_scratch_build':
      result.rolledFeature = {
        type: 'scratchBuild',
        ...rollRandomItem(technicianData.scratchBuilds),
      };
      break;

    case 'add_companion':
      result.companion = advancement.companionStats;
      break;

    case 'passive_ability':
    case 'one_time_bonus':
    case 'one_time_craft':
      // These are just tracked, no roll needed
      break;
  }

  return result;
}
