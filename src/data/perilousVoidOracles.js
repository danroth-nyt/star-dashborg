// ==========================================
// THE PERILOUS VOID ORACLES
// Source: The Perilous Void by Blackoath Entertainment
// ==========================================

import { rollDice } from './oracles';

// ==========================================
// OPENING SCENE (Page 29)
// Roll 1d10 to determine the immediate situation kicking off the session
// ==========================================

export const pvOpeningScenes = [
  {
    incident: "Imminent Annihilation. Your current location is about to be destroyed.",
    followUpQuestions: [
      "What's the source of potential destruction?",
      "What are the potential means of escape?"
    ]
  },
  {
    incident: "Alien Ambush. You're pinned down by hostile alien forces.",
    followUpQuestions: [
      "What do you know about the aliens?",
      "How have they gotten you in a tight spot?"
    ]
  },
  {
    incident: "Rescue. You're in the middle of saving an individual or group whose well-being is at risk.",
    followUpQuestions: [
      "Who are you rescuing?",
      "Who wants to stop you?",
      "What's the greatest obstacle you face?"
    ]
  },
  {
    incident: "Crash Landing. You've been forced to land your ship on a planet, moon, or asteroid.",
    followUpQuestions: [
      "Why are you being forced to make a crash landing?",
      "What dangers await you?"
    ]
  },
  {
    incident: "Boarding Action. A hostile force has just breached your ship's airlock.",
    followUpQuestions: [
      "Who or what is coming on board?",
      "What do they want from you?"
    ]
  },
  {
    incident: "Mutiny. A ship's crew revolts against their commanders.",
    followUpQuestions: [
      "Whose side are you on?",
      "What precipitated the revolt?",
      "What's at stake?"
    ]
  },
  {
    incident: "Blown Cover. You're deep undercover and hostile forces have discovered your identity.",
    followUpQuestions: [
      "Who were you deceiving?",
      "What was your cover?",
      "What's the immediate threat?"
    ]
  },
  {
    incident: "Heist Gone Wrong. You got what you came for, but now all hell's broken loose.",
    followUpQuestions: [
      "What are you stealing?",
      "What went wrong?",
      "Who or what is coming after you?"
    ]
  },
  {
    incident: "Biohazard Outbreak. A deadly virus has been released, and you're at ground zero.",
    followUpQuestions: [
      "What does the virus do?",
      "What protective measures can be taken to avoid its effects?"
    ]
  }
];

// ==========================================
// INCITING INCIDENT (Page 25)
// Roll 1d10 to determine the catalyst for the campaign narrative
// ==========================================

export const pvIncitingIncidents = [
  {
    incident: "Hostage Situation. Someone is being held by a hostile group, and they're in danger.",
    followUpQuestions: [
      "Who's being held hostage?",
      "Why do you need to help them?",
      "Who is the hostile group?"
    ]
  },
  {
    incident: "Biohazard Outbreak. A deadly pathogen has escaped containment.",
    followUpQuestions: [
      "Where was it being contained?",
      "What allowed it to escape?",
      "What does it do to people?"
    ]
  },
  {
    incident: "Diplomatic Sabotage. Peace talks between hostile factions are on the verge of collapse.",
    followUpQuestions: [
      "What factions are involved?",
      "Who's the saboteur?",
      "Whose side are you on?"
    ]
  },
  {
    incident: "Crash Landing. You've been forced to land your ship on a planet, moon, or asteroid.",
    followUpQuestions: [
      "Why are you being forced to make a crash landing?",
      "What dangers await you?"
    ]
  },
  {
    incident: "Planetary Invasion. You're caught in the path of a powerful invading force.",
    followUpQuestions: [
      "Who are the invaders?",
      "What is their objective?",
      "How can you escape alive?"
    ]
  },
  {
    incident: "Derelict Escape. You discovered something life-threatening aboard an abandoned hulk.",
    followUpQuestions: [
      "What were you looking for aboard the derelict?",
      "What threat did you discover?"
    ]
  },
  {
    incident: "Prison Break. You've broken someone out, and the authorities are in pursuit.",
    followUpQuestions: [
      "Who was in jail?",
      "Why did you break them out?",
      "How close are the authorities?"
    ]
  },
  {
    incident: "Interstellar Ambush. A hostile ship has issued a demand for your surrender.",
    followUpQuestions: [
      "Why are you vulnerable right now?",
      "Who among you knows the opposing ship's captain?"
    ]
  },
  {
    incident: "Imminent Impact. A rogue asteroid is on a collision course with your current location.",
    followUpQuestions: [
      "How can you possibly escape?",
      "What else will surely be destroyed?"
    ]
  },
  {
    incident: "Navigational Error. You've popped out of jumpspace too close to a stellar body.",
    followUpQuestions: [
      "Where and what is the stellar body?",
      "How can you escape its gravitational pull?"
    ]
  }
];

// ==========================================
// GENERATOR FUNCTIONS
// ==========================================

// Generate Inciting Incident
export function generatePVIncitingIncident() {
  const roll = rollDice(pvIncitingIncidents.length);
  const result = pvIncitingIncidents[roll - 1];
  
  return {
    roll,
    incident: result.incident,
    followUpQuestions: result.followUpQuestions,
    source: 'perilousVoid'
  };
}
